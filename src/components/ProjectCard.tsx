import { STAGES, STAGE_STEPS, stageLevel } from "@/lib/areas";
import { touchedLabel } from "@/lib/dates";
import { daysSinceTouched, isStale } from "@/lib/derive";
import { completeStep, removeProject, setActive, updateProject } from "@/lib/store";
import type { Project, Stage } from "@/lib/types";
import { CheckIcon, TrashIcon } from "./icons";
import { StepInput } from "./StepInput";

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
  const level = stageLevel(project.stage);
  const label = project.name || "this project";

  return (
    <article
      className={`grid grid-cols-1 items-center gap-3.5 rounded-[20px] border bg-surface p-[18px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_148px_140px] md:gap-5 md:px-6 md:py-5 ${
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

      <div className="flex min-w-0 items-start rounded-[14px] bg-bg px-1">
        <button
          type="button"
          className="group grid size-11 flex-none place-items-center rounded-xl"
          aria-label={`Mark the next step for ${label} done`}
          onClick={() => completeStep(project.id)}
        >
          <span className="grid size-[22px] place-items-center rounded-full border-2 border-muted text-transparent group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
            <CheckIcon />
          </span>
        </button>
        <StepInput
          className="[--grow-px:4px]"
          value={project.nextStep}
          onChange={(nextStep) => updateProject(project.id, { nextStep })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <select
            className="-ml-1 h-8 rounded-md bg-transparent text-[13px] font-semibold"
            aria-label="Stage"
            value={project.stage}
            onChange={(e) => updateProject(project.id, { stage: e.target.value as Stage })}
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
          {level > 0 && (
            <span className="flex gap-[3px]" aria-hidden="true">
              {Array.from({ length: STAGE_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-1 w-3 rounded-sm ${i < level ? "bg-area" : "bg-line"}`}
                />
              ))}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">
            {touchedLabel(daysSinceTouched(project, today))}
          </span>
          {isStale(project, today) && <span className="pill">Stale</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        {alwaysOn ? (
          <span className="eyebrow inline-flex min-h-11 items-center gap-2 text-area-ink">
            <span className="dot" />
            Always on
          </span>
        ) : (
          <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-0">
            <button
              type="button"
              role="switch"
              aria-checked={project.active}
              aria-label={`${label} is live`}
              disabled={!project.active && slotsFull}
              onClick={() => setActive(project.id, !project.active)}
              className="grid h-11 w-[52px] flex-none place-items-center"
            >
              <span
                className={`relative block h-7 w-12 rounded-full transition-colors ${
                  project.active ? "bg-area" : "bg-sw-off"
                }`}
              >
                <span
                  className={`absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform ${
                    project.active ? "translate-x-5" : ""
                  }`}
                />
              </span>
            </button>
            <span className="eyebrow text-muted">{project.active ? "Live" : "Parked"}</span>
          </div>
        )}
        <button
          type="button"
          className="btn btn-quiet btn-round text-muted"
          aria-label={`Delete ${label}`}
          onClick={() => {
            if (window.confirm(`Delete ${label}? This can't be undone.`)) {
              removeProject(project.id);
            }
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}
