"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cameFromInsideApp } from "@/lib/nav";
import { ArrowLeftIcon } from "./icons";

/** Goes back to wherever you came from, or to `fallback` if you landed here directly. */
export function BackLink({ fallback }: { fallback: string }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      className="btn btn-quiet -ml-3 self-start px-3 text-muted"
      onClick={(e) => {
        if (cameFromInsideApp()) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      <ArrowLeftIcon />
      Back
    </Link>
  );
}
