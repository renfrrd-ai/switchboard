"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AREA_BY_ID } from "@/lib/areas";
import { removeNote, updateNote, useNotes } from "@/lib/notes";
import { useBoard } from "@/lib/store";
import { BackLink } from "./BackLink";
import { TrashIcon } from "./icons";
import { NoteEditor } from "./NoteEditor";
import { NotFound } from "./NotFound";
import { PageShell } from "./PageShell";

export function NotePage({ id }: { id: string }) {
  const router = useRouter();
  const board = useBoard();
  const notes = useNotes();
  const [saving, setSaving] = useState(false);
  if (!board || !notes) return <PageShell />;

  const note = notes.find((n) => n.id === id);
  if (!note) return <NotFound what="note" />;

  const project = note.projectId ? board.projects.find((p) => p.id === note.projectId) : undefined;
  const areaId = project?.area ?? note.area ?? "personal";
  const parentHref = project ? `/project/${project.id}` : `/?tab=${areaId}`;
  const parentLabel = project
    ? `${AREA_BY_ID[areaId].label} / ${project.name || "Untitled"}`
    : AREA_BY_ID[areaId].label;

  return (
    <PageShell>
      <title>{`${note.title || "Untitled"} · Switchboard`}</title>
      <article className={`area-${areaId} mx-auto flex w-full max-w-[760px] flex-col gap-5`}>
        <div className="flex items-center justify-between gap-3">
          <BackLink fallback={parentHref} />
          <button
            type="button"
            className="btn btn-quiet btn-round text-muted"
            aria-label="Delete this note"
            onClick={() => {
              if (window.confirm("Delete this note? This can't be undone.")) {
                removeNote(note.id);
                router.replace(parentHref);
              }
            }}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <Link
              href={parentHref}
              className="inline-flex min-h-11 min-w-0 items-center gap-2 font-mono text-[13px] text-area-ink hover:underline"
            >
              <span className="dot" />
              <span className="truncate">{parentLabel}</span>
            </Link>
            <span className="font-mono text-xs text-muted" aria-live="polite">
              {saving ? "Saving…" : "Saved"}
            </span>
          </div>
          <input
            type="text"
            className="-mx-2 min-h-11 w-[calc(100%+16px)] rounded-xl border border-transparent bg-transparent px-2 font-display text-[clamp(32px,5vw,48px)] leading-[1.1] font-[750] tracking-[-0.025em] placeholder:text-muted focus:border-focus focus:outline-none"
            aria-label="Title"
            placeholder="Untitled"
            autoFocus={!note.title && !note.text}
            value={note.title}
            onChange={(e) => updateNote(note.id, { title: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.querySelector<HTMLElement>(".note-body")?.focus();
              }
            }}
          />
        </div>

        <NoteEditor note={note} onSavingChange={setSaving} />
      </article>
    </PageShell>
  );
}
