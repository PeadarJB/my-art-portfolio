#!/usr/bin/env node

/**
 * Build responsive artwork derivatives from source images.
 *
 * Usage:
 *   node scripts/optimize-images.mjs --input assets/raw --output public/images-optimized
 *
 * Notes:
 * - Requires sharp (`npm i -D sharp`).
 * - This script is a baseline and should be extended with project-specific quality presets.
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const args = process.argv.slice(2);
const inputFlagIndex = args.indexOf("--input");
const outputFlagIndex = args.indexOf("--output");

const inputDir = inputFlagIndex >= 0 ? args[inputFlagIndex + 1] : "assets/raw";
const outputDir = outputFlagIndex >= 0 ? args[outputFlagIndex + 1] : "public/images-optimized";

const widths = [
  { suffix: "small", width: 640 },
  { suffix: "medium", width: 1280 },
  { suffix: "large", width: 2200 },
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function listImageFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const child = await listImageFiles(full);
      files.push(...child);
      continue;
    }

    if (!/\.(png|jpg|jpeg|tif|tiff|webp)$/i.test(entry.name)) {
      continue;
    }
    files.push(full);
  }

  return files;
}

async function buildDerivatives(sourcePath) {
  const relativePath = path.relative(inputDir, sourcePath);
  const relativeNoExt = relativePath.replace(path.extname(relativePath), "");
  const sourceDir = path.dirname(relativeNoExt);
  const fileBase = path.basename(relativeNoExt);
  const targetDir = path.join(outputDir, sourceDir);

  await ensureDir(targetDir);

  const image = sharp(sourcePath, { failOnError: false });

  for (const spec of widths) {
    const webpTarget = path.join(targetDir, `${fileBase}-${spec.suffix}.webp`);
    const avifTarget = path.join(targetDir, `${fileBase}-${spec.suffix}.avif`);

    await image
      .clone()
      .resize({ width: spec.width, withoutEnlargement: true })
      .webp({ quality: spec.suffix === "large" ? 90 : 84 })
      .toFile(webpTarget);

    await image
      .clone()
      .resize({ width: spec.width, withoutEnlargement: true })
      .avif({ quality: spec.suffix === "large" ? 58 : 52 })
      .toFile(avifTarget);
  }
}

async function main() {
  await ensureDir(outputDir);
  const sourceFiles = await listImageFiles(inputDir);

  if (sourceFiles.length === 0) {
    console.log(`No source files found in ${inputDir}.`);
    return;
  }

  for (const filePath of sourceFiles) {
    await buildDerivatives(filePath);
    console.log(`Optimized: ${filePath}`);
  }

  console.log(`Done. Wrote derivatives to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
