import Link from "next/link";
import { touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import { countProjectNotes } from "@/lib/notes";
import { removeProject, updateProject } from "@/lib/store";
import type { Project } from "@/lib/types";
import { ArrowRightIcon, TrashIcon } from "./icons";
import { LiveControl, NextStepField, StageControl, confirmDeleteProject } from "./ProjectControls";

export function ProjectCard({
  project,
  today,
  alwaysOn,
  slotsFull,
  focusName,
}: {
  project: Project;
  today: string;
  alwaysOn: boolean;
  slotsFull: boolean;
  focusName: boolean;
}) {
  const live = project.active && !alwaysOn;
  const label = project.name || "this project";

  return (
    <article
      className={`grid grid-cols-1 items-center gap-3.5 rounded-[20px] border bg-surface p-[18px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_148px_auto] md:gap-5 md:px-6 md:py-5 ${
        live ? "border-area" : "border-line"
      }`}
    >
      <div className="flex min-w-0 flex-col">
        <input
          type="text"
          className="-mx-2 min-h-9 w-[calc(100%+16px)] rounded-lg border border-transparent bg-transparent px-2 font-display text-[19px] font-[650] placeholder:text-muted focus:border-focus focus:outline-none"
          aria-label="Project name"
          placeholder="Name it"
          autoFocus={focusName}
          value={project.name}
          onChange={(e) => updateProject(project.id, { name: e.target.value })}
        />
        <input
          type="text"
          className="-mx-2 min-h-7 w-[calc(100%+16px)] rounded-lg border border-transparent bg-transparent px-2 text-[13px] text-muted placeholder:text-muted focus:border-focus focus:outline-none"
          aria-label="Short description"
          placeholder="One line on what it is"
          value={project.note}
          onChange={(e) => updateProject(project.id, { note: e.target.value })}
        />
      </div>

      <NextStepField project={project} label={label} />

      <div className="flex flex-col gap-1">
        <StageControl project={project} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">
            {touchedLabel(daysSinceTouched(project, today))}
          </span>
          {isStale(project, today) && <span className="pill">Stale</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        <LiveControl project={project} label={label} alwaysOn={alwaysOn} slotsFull={slotsFull} />
        <div className="flex items-center">
          <button
            type="button"
            className="btn btn-quiet btn-round text-muted"
            aria-label={`Delete ${label}`}
            onClick={() => {
              if (confirmDeleteProject(label, countProjectNotes(project.id))) {
                removeProject(project.id);
              }
            }}
          >
            <TrashIcon />
          </button>
          <Link
            href={`/project/${project.id}`}
            className="btn btn-quiet btn-round text-muted"
            aria-label={`Open ${label}`}
          >
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
