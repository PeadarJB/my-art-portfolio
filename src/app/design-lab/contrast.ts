/**
 * Local WCAG 2.x contrast utility for the design laboratory only.
 *
 * Pure TypeScript, no dependency (the Phase 1A brief forbids adding one just to
 * calculate contrast). Used at render time to label every text/background
 * combination in the palette specimen with a *calculated* ratio rather than an
 * asserted one.
 */

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG contrast ratio between two hex colours, rounded to 2 decimals. */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(hexToRgb(foreground));
  const l2 = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export type ContrastGrade = {
  ratio: number;
  /** Passes AA for normal-size body text (>= 4.5:1). */
  normalAA: boolean;
  /** Passes AA for large text >= 24px / 18.66px bold (>= 3:1). */
  largeAA: boolean;
  /** Passes AAA for normal text (>= 7:1). */
  normalAAA: boolean;
  /** Short label, e.g. "AAA", "AA", "AA large", "fail". */
  label: string;
};

export function gradeContrast(foreground: string, background: string): ContrastGrade {
  const ratio = contrastRatio(foreground, background);
  const normalAA = ratio >= 4.5;
  const largeAA = ratio >= 3;
  const normalAAA = ratio >= 7;
  const label = normalAAA
    ? "AAA"
    : normalAA
      ? "AA"
      : largeAA
        ? "AA large only"
        : "fail";
  return { ratio, normalAA, largeAA, normalAAA, label };
}
