import Link from "next/link";
import { AREA_BY_ID } from "@/lib/areas";
import { touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import { completeStep, setActive, updateProject } from "@/lib/store";
import type { Project } from "@/lib/types";
import { StepInput } from "./StepInput";

export function SlotCard({
  project,
  number,
  today,
}: {
  project: Project;
  number: string;
  today: string;
}) {
  return (
    <article
      className={`area-${project.area} flex min-w-0 flex-col gap-4 rounded-3xl bg-area-soft p-5 md:gap-[18px] md:rounded-[28px] md:p-7 lg:min-h-[340px]`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-area-ink">
          <span className="dot" />
          {AREA_BY_ID[project.area].label}
        </span>
        <span className="font-display text-[28px] leading-none font-[750] text-area-ink">
          {number}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[28px] leading-[1.05] font-bold tracking-[-0.02em] md:text-[32px]">
          <Link
            href={`/project/${project.id}`}
            className="-my-2 inline-block py-2 decoration-2 underline-offset-4 hover:underline"
          >
            {project.name || "Untitled"}
          </Link>
        </h2>
        {project.note && <p className="text-sm text-muted">{project.note}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex min-h-6 items-center justify-between gap-2">
          <span className="eyebrow text-area-ink">Next step</span>
          {isStale(project, today) ? (
            <span className="pill">Stale · {daysSinceTouched(project, today)} days</span>
          ) : (
            <span className="font-mono text-xs text-muted">
              {touchedLabel(daysSinceTouched(project, today))}
            </span>
          )}
        </div>
        <StepInput
          className="rounded-[14px] bg-surface text-[17px] font-medium [--grow-px:16px] [--grow-py:13px]"
          value={project.nextStep}
          onChange={(nextStep) => updateProject(project.id, { nextStep })}
        />
      </div>

      <div className="flex gap-1.5">
        <button type="button" className="btn btn-solid" onClick={() => completeStep(project.id)}>
          Did it
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setActive(project.id, false)}>
          Park
        </button>
      </div>
    </article>
  );
}

export function EmptySlot({ number }: { number: string }) {
  return (
    <div className="flex min-h-[180px] min-w-0 flex-col gap-4 rounded-3xl border-2 border-dashed border-line p-5 md:gap-[18px] md:rounded-[28px] md:p-7 lg:min-h-[340px]">
      <div className="flex justify-end">
        <span className="font-display text-[28px] leading-none font-[750] text-muted">{number}</span>
      </div>
      <div className="my-auto flex flex-col gap-1.5">
        <div className="font-display text-[26px] font-bold tracking-[-0.02em]">Open slot</div>
        <p className="text-sm text-muted">Flip a project&apos;s switch in any tab to put it here.</p>
      </div>
    </div>
  );
}
