#!/usr/bin/env node

/**
 * Re-encode the responsive artwork derivatives in place.
 *
 * The repository ships pre-generated `<base>-{small,medium,large}.webp`
 * variants. Historically many of these were encoded losslessly, which made the
 * `-large` files 5-7 MiB each. This script rebuilds every variant as a
 * deterministic lossy WebP, resized from the widest available source in each
 * group, with all EXIF/XMP metadata stripped.
 *
 * It never enlarges beyond the source resolution and never writes a variant
 * that would be larger than the file already on disk, so total weight only ever
 * decreases. Running it repeatedly is idempotent.
 *
 * Usage:
 *   node scripts/optimize-images.mjs                 # re-encode public/images in place
 *   node scripts/optimize-images.mjs --input <dir>   # target a different tree
 *   node scripts/optimize-images.mjs --dry-run       # report only, write nothing
 *   node scripts/optimize-images.mjs --quality 80    # override large-variant quality
 *
 * Requires sharp (a devDependency).
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const args = process.argv.slice(2);

function flagValue(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) {
    return fallback;
  }
  return args[index + 1];
}

const inputDir = flagValue("--input", "public/images");
const dryRun = args.includes("--dry-run");
const largeQuality = Number(flagValue("--quality", "82"));
const smallMediumQuality = Math.max(1, largeQuality - 4);

// Target widths per variant. `withoutEnlargement` prevents upscaling, so a
// source narrower than the target is left at its native width.
const VARIANTS = [
  { suffix: "small", width: 640, quality: smallMediumQuality },
  { suffix: "medium", width: 1280, quality: smallMediumQuality },
  { suffix: "large", width: 2200, quality: largeQuality },
];

const VARIANT_RE = /^(?<base>.+)-(?<size>small|medium|large)\.(?<ext>webp|jpe?g|png|tiff?)$/i;

async function listImageFiles(rootDir) {
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (VARIANT_RE.test(entry.name)) {
        out.push(full);
      }
    }
  }
  await walk(rootDir);
  return out;
}

/** Group variant files by `<dir>/<base>`. */
function groupByBase(files) {
  const groups = new Map();
  for (const file of files) {
    const match = VARIANT_RE.exec(path.basename(file));
    if (!match) continue;
    const key = path.join(path.dirname(file), match.groups.base);
    if (!groups.has(key)) {
      groups.set(key, { base: key, variants: {} });
    }
    groups.get(key).variants[match.groups.size.toLowerCase()] = file;
  }
  return [...groups.values()].sort((a, b) => a.base.localeCompare(b.base));
}

async function widestSource(variants) {
  // Read each candidate fully into memory and pick the widest. Working from a
  // buffer (not a live file handle) means libvips never keeps the source file
  // open, so a later unlink/overwrite of that same file cannot hit EBUSY.
  let best = null;
  for (const file of Object.values(variants)) {
    try {
      const buffer = await fs.readFile(file);
      const meta = await sharp(buffer).metadata();
      const width = meta.width ?? 0;
      if (!best || width > best.width) {
        best = { file, width, height: meta.height ?? 0, buffer };
      }
    } catch (error) {
      console.warn(`  ! could not read ${file}: ${error.message}`);
    }
  }
  return best;
}

function mib(bytes) {
  return `${(bytes / 1048576).toFixed(2)} MiB`;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Write resiliently. OneDrive's filter driver rejects both a truncating open
 * (UNKNOWN) and a rename-over (EPERM) of a synced file under load. Deleting the
 * synced file first and then creating a brand-new one is the pattern it
 * reliably accepts; retry with backoff to absorb transient sync lag.
 */
async function writeFileRobust(target, buffer) {
  const attempts = 6;
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await fs.rm(target, { force: true });
      await fs.writeFile(target, buffer, { flag: "wx" });
      return;
    } catch (error) {
      lastError = error;
      await delay(250 * (attempt + 1));
    }
  }
  throw lastError;
}

async function fileSize(file) {
  try {
    return (await fs.stat(file)).size;
  } catch {
    return 0;
  }
}

/** True only if the file on disk is genuinely a WebP (not e.g. a JPEG with a
 * mislabelled .webp extension, which some legacy variants are). Reads just the
 * 12-byte RIFF/WEBP header via a handle that is always closed, so it never
 * leaves the file open. */
async function isRealWebp(file) {
  let handle;
  try {
    handle = await fs.open(file, "r");
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(12), 0, 12, 0);
    return (
      bytesRead >= 12 &&
      buffer.toString("latin1", 0, 4) === "RIFF" &&
      buffer.toString("latin1", 8, 12) === "WEBP"
    );
  } catch {
    return false;
  } finally {
    await handle?.close();
  }
}

async function processGroup(group) {
  const source = await widestSource(group.variants);
  if (!source) {
    console.warn(`! skipping ${group.base}: no readable source`);
    return { before: 0, after: 0, failed: VARIANTS.length };
  }

  let before = 0;
  let after = 0;
  let failed = 0;

  for (const variant of VARIANTS) {
    const target = `${group.base}-${variant.suffix}.webp`;
    const existingSize = await fileSize(target);
    before += existingSize;

    // Auto-orient from EXIF, resize, strip metadata (sharp drops metadata by
    // default), encode deterministic lossy WebP. Encoding from the in-memory
    // source buffer avoids holding the file open on disk.
    const pipeline = sharp(source.buffer)
      .rotate()
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: variant.quality, effort: 6, smartSubsample: true });

    let buffer;
    let info;
    try {
      const result = await pipeline.toBuffer({ resolveWithObject: true });
      buffer = result.data;
      info = result.info;
    } catch (error) {
      console.warn(`  ! failed to encode ${target}: ${error.message}`);
      after += existingSize;
      failed += 1;
      continue;
    }

    if (!info || !info.width || !info.height) {
      console.warn(`  ! invalid output for ${target}, keeping existing`);
      after += existingSize;
      failed += 1;
      continue;
    }

    // Never regress size, but always replace a file that is not genuinely
    // WebP (e.g. a JPEG mislabelled .webp) even if the rewrite is not smaller.
    if (existingSize > 0 && buffer.length >= existingSize && (await isRealWebp(target))) {
      after += existingSize;
      console.log(
        `  = ${path.basename(target)} kept (${mib(existingSize)}; re-encode was ${mib(buffer.length)})`
      );
      continue;
    }

    if (dryRun) {
      after += buffer.length;
      console.log(
        `  ~ ${path.basename(target)} ${mib(existingSize)} -> ${mib(buffer.length)} (dry-run)`
      );
      continue;
    }

    try {
      await writeFileRobust(target, buffer);
      after += buffer.length;
      console.log(
        `  + ${path.basename(target)} ${info.width}x${info.height} ${mib(existingSize)} -> ${mib(buffer.length)}`
      );
    } catch (error) {
      after += existingSize;
      failed += 1;
      console.warn(`  ! failed to write ${target}: ${error.message}`);
    }
  }

  return { before, after, failed };
}

async function main() {
  const files = await listImageFiles(inputDir).catch((error) => {
    console.error(`Cannot read input directory "${inputDir}": ${error.message}`);
    process.exit(1);
  });

  if (files.length === 0) {
    console.log(`No variant images found under ${inputDir}.`);
    return;
  }

  const groups = groupByBase(files);
  console.log(
    `${dryRun ? "[dry-run] " : ""}Re-encoding ${files.length} variants across ${groups.length} artworks in ${inputDir}\n`
  );

  let totalBefore = 0;
  let totalAfter = 0;
  let totalFailed = 0;
  for (const group of groups) {
    console.log(path.relative(inputDir, group.base));
    const { before, after, failed } = await processGroup(group);
    totalBefore += before;
    totalAfter += after;
    totalFailed += failed;
  }

  const saved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(1) : "0.0";
  console.log(
    `\nDone. ${mib(totalBefore)} -> ${mib(totalAfter)} (saved ${mib(saved)}, ${pct}%)${
      dryRun ? " [dry-run, nothing written]" : ""
    }`
  );
  if (totalFailed > 0) {
    console.warn(`\n${totalFailed} variant(s) could not be re-encoded/written.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
