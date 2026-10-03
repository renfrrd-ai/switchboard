"use client";

import Link from "next/link";
import { AREA_BY_ID, MAX_ACTIVE } from "@/lib/areas";
import { todayISO, touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import { projectNotes, useNotes } from "@/lib/notes";
import { activeCount, updateProject, useBoard } from "@/lib/store";
import { BackLink } from "./BackLink";
import { NoteList } from "./NoteList";
import { NotFound } from "./NotFound";
import { PageShell } from "./PageShell";
import { LiveControl, NextStepField, StageControl } from "./ProjectControls";

export function ProjectPage({ id }: { id: string }) {
  const board = useBoard();
  const notes = useNotes();
  if (!board || !notes) return <PageShell />;

  const project = board.projects.find((p) => p.id === id);
  if (!project) return <NotFound what="project" />;

  const area = AREA_BY_ID[project.area];
  const today = todayISO();
  const label = project.name || "this project";
  const slotsFull = activeCount(board) >= MAX_ACTIVE;

  return (
    <PageShell>
      <title>{`${project.name || "Untitled"} · Switchboard`}</title>
      <div className={`area-${project.area} flex flex-col gap-7`}>
        <BackLink fallback={`/?tab=${project.area}`} />

        <section className="flex flex-col gap-3">
          <Link
            href={`/?tab=${project.area}`}
            className="inline-flex min-h-11 items-center gap-2 self-start font-mono text-[13px] text-area-ink hover:underline"
          >
            <span className="dot" />
            {area.label}
          </Link>
          <input
            type="text"
            className="-mx-2 min-h-11 w-[calc(100%+16px)] rounded-xl border border-transparent bg-transparent px-2 font-display text-[clamp(36px,6vw,64px)] leading-[1.05] font-[750] tracking-[-0.03em] placeholder:text-muted focus:border-focus focus:outline-none"
            aria-label="Project name"
            placeholder="Name it"
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
        </section>

        <section
          className={`flex flex-col gap-4 rounded-[20px] border bg-surface p-[18px] md:p-6 ${
            project.active && !area.alwaysOn ? "border-area" : "border-line"
          }`}
        >
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-area-ink">Next step</span>
            <NextStepField project={project} label={label} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <StageControl project={project} />
              <span className="font-mono text-xs text-muted">
                {touchedLabel(daysSinceTouched(project, today))}
              </span>
              {isStale(project, today) && <span className="pill">Stale</span>}
            </div>
            <LiveControl
              project={project}
              label={label}
              alwaysOn={area.alwaysOn}
              slotsFull={slotsFull}
              stacked={false}
            />
          </div>
        </section>

        <NoteList
          notes={projectNotes(notes, project.id)}
          owner={{ projectId: project.id }}
          emptyText="No notes yet. Plans, links, meeting notes and checklists for this project go here."
        />
      </div>
    </PageShell>
  );
}
