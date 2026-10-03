"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Counts page changes inside the app, so a Back button can step back through
 * history when there is somewhere in the app to go, and fall back to a parent
 * page when the app was opened straight onto a project or note.
 */
let pagesSeen = 0;

export function useTrackPages() {
  const pathname = usePathname();
  useEffect(() => {
    pagesSeen += 1;
  }, [pathname]);
}

export function cameFromInsideApp(): boolean {
  return pagesSeen > 1;
}
