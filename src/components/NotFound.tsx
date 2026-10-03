import Link from "next/link";
import { PageShell } from "./PageShell";

/** Shown when a project or note id isn't on this device (deleted, or saved elsewhere). */
export function NotFound({ what }: { what: "project" | "note" }) {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-3 rounded-[28px] bg-sunk px-6 py-16 text-center">
        <div className="font-display text-[26px] font-bold tracking-[-0.02em]">
          This {what} isn&apos;t here
        </div>
        <p className="max-w-[46ch] text-sm text-muted">
          It may have been deleted. Everything is saved on this device only, so it won&apos;t
          show up if it was made on another one.
        </p>
        <Link href="/" className="btn btn-solid mt-2">
          Go home
        </Link>
      </div>
    </PageShell>
  );
}
