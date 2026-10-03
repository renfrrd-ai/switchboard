"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useNotes } from "@/lib/notes";
import { OPEN_SEARCH_EVENT, search, type SearchResult } from "@/lib/search";
import { useBoard } from "@/lib/store";
import { SearchIcon } from "./icons";

/** Cmd/Ctrl+K anywhere, or the header's search button. */
export function SearchPalette() {
  const [open, setOpen] = useState(false);
  // Where focus was before opening, to put it back on close.
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      if (!returnTo.current) returnTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        show();
      }
    };
    const onOpen = show;
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) returnTo.current?.focus?.({ preventScroll: true });
    returnTo.current = null;
  };

  return open ? <Palette onClose={close} /> : null;
}

/** `onClose(true)` puts focus back where it was; `onClose(false)` is for leaving the page. */
function Palette({ onClose }: { onClose: (restoreFocus: boolean) => void }) {
  const router = useRouter();
  const board = useBoard();
  const notes = useNotes();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = board && notes ? search(board, notes, query) : [];
  const current = Math.min(active, Math.max(results.length - 1, 0));

  // Hold the page still while open.
  useEffect(() => {
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${current}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [current]);

  const go = (result: SearchResult | undefined) => {
    if (!result) return;
    onClose(false);
    router.push(result.href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[min(12vh,96px)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(true);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="flex max-h-[min(560px,calc(100dvh-120px))] w-full max-w-[620px] flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <span className="text-muted">
            <SearchIcon />
          </span>
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results.length ? `search-result-${current}` : undefined}
            aria-autocomplete="list"
            aria-label="Search projects and notes"
            placeholder="Search projects and notes"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="field search-field min-h-14 flex-1 rounded-none px-1 text-base focus:border-transparent"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((current + 1) % Math.max(results.length, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((current - 1 + results.length) % Math.max(results.length, 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[current]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClose(true);
              }
            }}
          />
          <button type="button" className="btn btn-quiet -mr-2 px-3 text-muted" onClick={() => onClose(true)}>
            Esc
          </button>
        </div>

        {results.length > 0 ? (
          <ul
            id="search-results"
            ref={listRef}
            role="listbox"
            aria-label={query ? "Results" : "Recent notes"}
            className="flex flex-col overflow-y-auto p-2"
          >
            {!query && (
              <li role="presentation" className="eyebrow px-3 pt-2 pb-1 text-muted">
                Recent notes
              </li>
            )}
            {results.map((r, i) => (
              <li
                key={r.key}
                id={`search-result-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === current}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex min-h-11 cursor-pointer flex-col justify-center gap-0.5 rounded-xl px-3 py-2 ${
                  i === current ? "bg-sunk" : ""
                }`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-medium">{r.title}</span>
                  <span className="eyebrow flex-none text-muted">{r.kind}</span>
                </span>
                {r.snippet && (
                  <span className="line-clamp-2 text-[13px] text-muted [overflow-wrap:anywhere]">
                    {r.snippet.before}
                    <mark className="rounded-sm bg-transparent font-semibold text-ink">
                      {r.snippet.match}
                    </mark>
                    {r.snippet.after}
                  </span>
                )}
                {r.where && <span className="truncate font-mono text-xs text-muted">{r.where}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted">
            {query ? `Nothing matches “${query}”.` : "No notes yet. Search finds projects and notes."}
          </p>
        )}

        <div className="hidden gap-4 border-t border-line px-5 py-2.5 font-mono text-xs text-muted md:flex">
          <span>↑ ↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
