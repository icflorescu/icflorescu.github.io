// Number formats shared by the build (stats) and the browser (the Count component's animation).

/** 942911 → "942k", 6233608 → "6.2M" (rounded down, so the page never overstates) */
export function compact(n: number) {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M`;
  if (n >= 1000) return `${Math.floor(n / 1000)}k`;
  return String(n);
}

/** 4066 → "4,066" */
export function thousands(n: number) {
  return n.toLocaleString('en-US');
}

export const FORMATS = { plain: String, compact, thousands } as const;
export type Format = keyof typeof FORMATS;

/**
 * `n` as an intermediate step of counting to `to`: in `to`'s format and unit, zero-padded to its digit count, so
 * the figure keeps its width while it counts (to 28: "01"; to 940k: "000k", "312k"; to 4,066: "0,000", "1,523").
 */
export function tick(format: Format, n: number, to: number) {
  const digits = (value: number, of: number) => String(value).padStart(String(of).length, '0');
  if (format === 'compact') {
    if (to >= 1_000_000) {
      const tenths = digits(Math.floor(n / 100_000), Math.floor(to / 100_000));
      return `${tenths.slice(0, -1)}.${tenths.slice(-1)}M`;
    }
    if (to >= 1000) return `${digits(Math.floor(n / 1000), Math.floor(to / 1000))}k`;
  }
  const padded = digits(n, to);
  return format === 'thousands' ? padded.replace(/\B(?=(\d{3})+$)/g, ',') : padded;
}
