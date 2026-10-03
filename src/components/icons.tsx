const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="26" height="26" rx="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="14" r="2.5" fill="currentColor" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
      <circle cx="19.5" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2.4" aria-hidden="true" {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" strokeWidth="3.5" aria-hidden="true" {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2.4" aria-hidden="true" {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
    </svg>
  );
}

export function BulletListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function OrderedListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M4 9h3M4 14.5a1.5 1.5 0 0 1 3 0c0 1.5-3 2-3 4h3" />
    </svg>
  );
}

export function TaskListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <path d="M4.5 16.5l1.5 1.5 3-3.5M13 7h8M13 17h8" />
    </svg>
  );
}

export function QuoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M5 5v14M10 8h9M10 12h9M10 16h6" />
    </svg>
  );
}

export function CodeBlockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M10 10l-2 2 2 2M14 10l2 2-2 2" />
    </svg>
  );
}

export function DividerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M3 12h18M8 6h8M8 18h8" opacity="0.5" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
