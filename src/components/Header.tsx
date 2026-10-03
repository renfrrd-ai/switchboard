"use client";

import Link from "next/link";
import { openSearch } from "@/lib/search";
import { setTheme, useTheme } from "@/lib/theme";
import { Logo, MoonIcon, SearchIcon, SunIcon } from "./icons";

export function Header() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <header className="flex items-center justify-between gap-3">
      <Link href="/" className="-m-1.5 flex min-h-11 items-center gap-2.5 rounded-xl p-1.5">
        <Logo />
        <div className="font-display text-[19px] font-bold tracking-[-0.01em]">Switchboard</div>
      </Link>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-round"
          aria-label="Search"
          aria-keyshortcuts="Control+K Meta+K"
          title="Search (Ctrl K or ⌘K)"
          onClick={openSearch}
        >
          <SearchIcon />
        </button>
        <button
          type="button"
          className="btn btn-round"
          aria-label={`Switch to ${next} mode`}
          onClick={() => setTheme(next)}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
