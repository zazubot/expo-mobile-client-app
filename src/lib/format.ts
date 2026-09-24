/** Shared formatting helpers. Keep all date/number formatting here. */

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function parseDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Sep 24, 2026, 2:15 PM" (locale dependent). Falls back to the raw string. */
export function formatDateTime(iso: string): string {
  const date = parseDate(iso);
  return date ? dateTimeFormatter.format(date) : iso;
}

/** "just now", "5m ago", "3h ago", "2d ago"; older dates use the absolute format. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const date = parseDate(iso);
  if (!date) return iso;
  const seconds = Math.round((now - date.getTime()) / 1000);
  if (seconds < 45) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateTime(iso);
}

/** 1234 -> "1.2K" */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

/** "PRO" -> "Pro", "LIFETIME" -> "Lifetime" */
export function formatPlan(plan: string): string {
  const lower = plan.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Collapses whitespace and cuts long text with an ellipsis. */
export function truncate(text: string, max = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/** Renders an unknown answer/variable value as display text. */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.map(formatValue).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** Up to two initials from a display name, e.g. "Acme Corp" -> "AC". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return (first + last).toUpperCase();
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

/** "Sep 24, 2026" from an ISO string. Falls back to the raw string. */
export function formatDate(iso: string): string {
  const date = parseDate(iso);
  return date ? dateFormatter.format(date) : iso;
}

/**
 * Formats an epoch timestamp as a date. Accepts seconds (Stripe convention)
 * or milliseconds; values above 1e12 are treated as milliseconds.
 */
export function formatEpochDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined || !Number.isFinite(epoch)) return '—';
  const ms = epoch > 1e12 ? epoch : epoch * 1000;
  return dateFormatter.format(new Date(ms));
}

/**
 * Formats a money amount given in the currency's minor unit (cents), which is
 * how billing providers report invoice totals. Zero-decimal currencies (JPY,
 * KRW, …) are handled via the currency's own fraction digits.
 */
export function formatCurrency(amountMinor: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: code });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(amountMinor / 10 ** digits);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${code}`;
  }
}
