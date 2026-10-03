"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { editedLabel, todayISO } from "@/lib/dates";
import { addNote } from "@/lib/notes";
import type { AreaId, Note } from "@/lib/types";
import { PlusIcon } from "./icons";

const SNIPPET_LENGTH = 140;

/** A "Notes" section: heading, New note button, and the notes as links. */
export function NoteList({
  notes,
  owner,
  emptyText,
}: {
  notes: Note[];
  owner: { projectId: string } | { area: AreaId };
  emptyText: string;
}) {
  const router = useRouter();
  const today = todayISO();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[26px] font-bold tracking-[-0.02em]">
          Notes{" "}
          {notes.length > 0 && (
            <span className="font-mono text-sm font-normal text-muted">{notes.length}</span>
          )}
        </h2>
        <button
          type="button"
          className="btn"
          onClick={() => router.push(`/note/${addNote(owner)}`)}
        >
          <PlusIcon />
          New note
        </button>
      </div>

      {notes.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => {
            const snippet = note.text.replace(/\s+/g, " ").trim().slice(0, SNIPPET_LENGTH);
            return (
              <li key={note.id}>
                <Link
                  href={`/note/${note.id}`}
                  className="flex min-h-11 flex-col gap-1 rounded-[16px] border border-line bg-surface px-[18px] py-3.5 hover:border-muted"
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className={`font-semibold ${note.title ? "" : "text-muted"}`}>
                      {note.title || "Untitled"}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {editedLabel(note.updatedAt, today)}
                    </span>
                  </span>
                  {snippet && (
                    <span className="line-clamp-2 text-sm text-muted [overflow-wrap:anywhere]">
                      {snippet}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-[16px] border border-dashed border-line px-[18px] py-6 text-sm text-muted">
          {emptyText}
        </p>
      )}
    </section>
  );
}
