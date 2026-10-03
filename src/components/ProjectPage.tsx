"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AREA_BY_ID, MAX_ACTIVE } from "@/lib/areas";
import { todayISO, touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import { projectNotes, useNotes } from "@/lib/notes";
import { activeCount, removeProject, updateProject, useBoard } from "@/lib/store";
import { BackLink } from "./BackLink";
import { TrashIcon } from "./icons";
import { NoteList } from "./NoteList";
import { NotFound } from "./NotFound";
import { PageShell } from "./PageShell";
import { LiveControl, NextStepField, StageControl, confirmDeleteProject } from "./ProjectControls";

/** Laid out like the note page: Back and delete, where it lives, the name, then the content. */
export function ProjectPage({ id }: { id: string }) {
  const router = useRouter();
  const board = useBoard();
  const notes = useNotes();
  if (!board || !notes) return <PageShell />;

  const project = board.projects.find((p) => p.id === id);
  if (!project) return <NotFound what="project" />;

  const area = AREA_BY_ID[project.area];
  const areaHref = `/?tab=${project.area}`;
  const today = todayISO();
  const label = project.name || "this project";
  const mine = projectNotes(notes, project.id);

  return (
    <PageShell>
      <title>{`${project.name || "Untitled"} · Switchboard`}</title>
      <article className={`area-${project.area} mx-auto flex w-full max-w-[760px] flex-col gap-5`}>
        <div className="flex items-center justify-between gap-3">
          <BackLink fallback={areaHref} />
          <button
            type="button"
            className="btn btn-quiet btn-round text-muted"
            aria-label={`Delete ${label}`}
            onClick={() => {
              if (confirmDeleteProject(label, mine.length)) {
                removeProject(project.id);
                router.replace(areaHref);
              }
            }}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <Link
              href={areaHref}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] text-area-ink hover:underline"
            >
              <span className="dot" />
              {area.label}
            </Link>
            <span className="flex items-center gap-2 font-mono text-xs text-muted">
              {isStale(project, today) && <span className="pill">Stale</span>}
              {touchedLabel(daysSinceTouched(project, today))}
            </span>
          </div>
          <input
            type="text"
            className="-mx-2 min-h-11 w-[calc(100%+16px)] rounded-xl border border-transparent bg-transparent px-2 font-display text-[clamp(32px,5vw,48px)] leading-[1.1] font-[750] tracking-[-0.025em] placeholder:text-muted focus:border-focus focus:outline-none"
            aria-label="Project name"
            placeholder="Name it"
            autoFocus={!project.name}
            value={project.name}
            onChange={(e) => updateProject(project.id, { name: e.target.value })}
          />
          <input
            type="text"
            className="-mx-2 min-h-11 w-[calc(100%+16px)] rounded-lg border border-transparent bg-transparent px-2 text-base text-muted placeholder:text-muted focus:border-focus focus:outline-none"
            aria-label="Short description"
            placeholder="One line on what it is"
            value={project.note}
            onChange={(e) => updateProject(project.id, { note: e.target.value })}
          />
        </div>

        <section
          aria-label="Status"
          className={`flex flex-col gap-3 rounded-[20px] border bg-surface p-4 md:p-5 ${
            project.active && !area.alwaysOn ? "border-area" : "border-line"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow text-area-ink">Next step</span>
            <LiveControl
              project={project}
              label={label}
              alwaysOn={area.alwaysOn}
              slotsFull={activeCount(board) >= MAX_ACTIVE}
            />
          </div>
          <NextStepField project={project} label={label} />
          <div className="-mb-1.5">
            <StageControl project={project} />
          </div>
        </section>

        <div className="mt-4">
          <NoteList
            notes={mine}
            owner={{ projectId: project.id }}
            emptyText="No notes yet. Plans, links, meeting notes and checklists for this project go here."
          />
        </div>
      </article>
    </PageShell>
  );
}
