"use client";

import { setTheme, useTheme } from "@/lib/theme";
import { Logo, MoonIcon, SunIcon } from "./icons";

export function Header() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Logo />
        <div className="font-display text-[19px] font-bold tracking-[-0.01em]">Switchboard</div>
      </div>
      <button
        type="button"
        className="btn btn-round"
        aria-label={`Switch to ${next} mode`}
        onClick={() => setTheme(next)}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
