export const FOUNDING_YEAR = 1998;

/**
 * Computes Pleasant View Schools' years of existence since 1998.
 * Automatically increments on every New Year's Eve (December 31 in Africa/Nairobi, UTC+3)
 * — e.g. 28 in 2026, incrementing to 29 on 31 Dec 2026 and staying 29 throughout 2027,
 * then incrementing to 30 on 31 Dec 2027, and so on.
 */
export function getYearsOfExistence(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  let year;
  let month;
  let day;
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(d);
    year = Number(parts.find(p => p.type === 'year')?.value);
    month = Number(parts.find(p => p.type === 'month')?.value);
    day = Number(parts.find(p => p.type === 'day')?.value);
  } catch {
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();
  }

  const effectiveYear = month === 12 && day === 31 ? year + 1 : year;
  return Math.max(1, effectiveYear - FOUNDING_YEAR);
}

/**
 * Replaces hardcoded or stored year-of-existence phrases (e.g. "24+", "24-year", "28 YEARS OF ACADEMIC...")
 * with the live computed years of existence so even database-stored strings roll over automatically on Dec 31.
 */
export function syncHeritageYearsText(value, now = new Date()) {
  if (typeof value !== 'string' || !value) return value;
  const yrs = getYearsOfExistence(now);
  return value
    .replace(/\b1998\s*\(\s*\d+\+?\s*Years\s+of\s+(?:Excellence|Existence)\s*\)/gi, `1998 (${yrs} Years of Existence)`)
    .replace(/\b\d+\+?\s*-\s*(Year\s+(?:Academic|Heritage|Legacy|Githunguri|Eminence|Existence))/gi, `${yrs}-$1`)
    .replace(/\b\d+\+?\s+(Years\s+of\s+(?:Academic|Excellence|Existence|Leadership|Eminence|Heritage))/gi, `${yrs} $1`)
    .replace(/\bacross\s+our\s+\d+\+?\s*(?:-|\s)\s*year\b/gi, `across our ${yrs}-year`);
}

/**
 * Dynamically keeps the "Years of Existence / Excellence" glance metric card synchronized
 * with getYearsOfExistence() on every New Year's Eve.
 */
export function normalizeGlanceMetricRow(row, now = new Date()) {
  if (!row || typeof row !== 'object') return row;
  const yrs = getYearsOfExistence(now);
  const label = String(row.stat_label || '');
  const desc = String(row.stat_desc || '');
  const val = String(row.stat_value || '').trim();
  const isHeritageRow =
    /years\s+of\s+(?:excellence|existence|heritage|eminence)/i.test(label) ||
    (/est\.?\s*1998/i.test(desc) && /^\d+\+?$/.test(val));
  if (!isHeritageRow) return row;
  return {
    ...row,
    stat_value: String(yrs),
    stat_label: /^years\s+of\s+excellence$/i.test(label.trim()) ? 'Years of Existence' : label
  };
}
