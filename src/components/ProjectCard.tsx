import Link from "next/link";
import { touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import type { Project } from "@/lib/types";
import { LiveControl, NextStepField, StageControl } from "./ProjectControls";

/**
 * A project in its area's list: what it is, whether it's live, the next step,
 * and one quiet line of status. Renaming and deleting happen on its page.
 */
export function ProjectCard({
  project,
  today,
  alwaysOn,
  slotsFull,
  noteCount,
}: {
  project: Project;
  today: string;
  alwaysOn: boolean;
  slotsFull: boolean;
  noteCount: number;
}) {
  const live = project.active && !alwaysOn;
  const label = project.name || "this project";

  return (
    <article
      className={`flex min-w-0 flex-col gap-3 rounded-[20px] border bg-surface p-4 md:p-5 ${
        live ? "border-area" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/project/${project.id}`}
          className="group -m-1.5 flex min-h-11 min-w-0 flex-1 flex-col justify-center rounded-xl p-1.5"
        >
          <span
            className={`truncate font-display text-[19px] leading-tight font-[650] decoration-2 underline-offset-4 group-hover:underline ${
              project.name ? "" : "text-muted"
            }`}
          >
            {project.name || "Untitled"}
          </span>
          {project.note && <span className="truncate text-[13px] text-muted">{project.note}</span>}
        </Link>
        <LiveControl project={project} label={label} alwaysOn={alwaysOn} slotsFull={slotsFull} />
      </div>

      <NextStepField project={project} label={label} />

      <div className="-mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <StageControl project={project} />
        <span className="font-mono text-xs text-muted">
          {touchedLabel(daysSinceTouched(project, today))}
        </span>
        {isStale(project, today) && <span className="pill">Stale</span>}
        {noteCount > 0 && (
          <span className="ml-auto font-mono text-xs text-muted">
            {noteCount === 1 ? "1 note" : `${noteCount} notes`}
          </span>
        )}
      </div>
    </article>
  );
}
