const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** Today in the device's own time zone, as YYYY-MM-DD. */
export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function toUTC(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from one ISO date to another. Negative if `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUTC(to) - toUTC(from)) / 86_400_000);
}

export function dateParts(iso: string) {
  const d = new Date(toUTC(iso));
  return {
    weekday: WEEKDAYS[d.getUTCDay()],
    month: MONTHS[d.getUTCMonth()],
    day: `${d.getUTCDate()}`,
  };
}

/** "Tue, Oct 6" */
export function formatDate(iso: string): string {
  const p = dateParts(iso);
  return `${p.weekday}, ${p.month} ${p.day}`;
}

export function touchedLabel(days: number): string {
  if (days <= 0) return "touched today";
  if (days === 1) return "touched yesterday";
  return `${days} days ago`;
}

export function dueLabel(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

/** "edited today", "edited yesterday", or "edited Tue, Oct 6", from an ISO timestamp. */
export function editedLabel(timestamp: string, today: string): string {
  const day = todayISO(new Date(timestamp));
  const days = daysBetween(day, today);
  if (days <= 0) return "edited today";
  if (days === 1) return "edited yesterday";
  return `edited ${formatDate(day)}`;
}
