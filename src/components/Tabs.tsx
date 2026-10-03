import { useEffect, useRef } from "react";
import { AREAS } from "@/lib/areas";
import type { Board, TabId } from "@/lib/types";

const TABS: { id: TabId; label: string }[] = [{ id: "home", label: "Home" }, ...AREAS];

/** One row of tabs. On narrow screens the row scrolls sideways instead of wrapping. */
export function Tabs({
  tab,
  onChange,
  board,
}: {
  tab: TabId;
  onChange: (tab: TabId) => void;
  board: Board | null;
}) {
  const currentRef = useRef<HTMLButtonElement>(null);

  // Keep the current tab in view when the row is scrolled.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [tab]);

  return (
    <nav
      aria-label="Areas"
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-1.5">
        {TABS.map((t) => {
          const current = t.id === tab;
          const count =
            board && t.id !== "home"
              ? board.projects.filter((p) => p.area === t.id).length
              : null;
          return (
            <button
              key={t.id}
              ref={current ? currentRef : undefined}
              type="button"
              aria-pressed={current}
              onClick={() => onChange(t.id)}
              className={`area-${t.id} inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap ${
                current ? "bg-ink text-bg" : "text-muted hover:bg-sunk hover:text-ink"
              }`}
            >
              <span className={`dot ${current && t.id === "home" ? "bg-bg" : ""}`} />
              <span>{t.label}</span>
              {count !== null && (
                <span className={`font-mono text-xs ${current ? "text-bg" : "text-muted"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
