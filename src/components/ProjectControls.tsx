import { STAGES, STAGE_STEPS, stageLevel } from "@/lib/areas";
import { completeStep, setActive, updateProject } from "@/lib/store";
import type { Project, Stage } from "@/lib/types";
import { CheckIcon } from "./icons";
import { StepInput } from "./StepInput";

/** Shared by the project card and the project page. */

export function NextStepField({ project, label }: { project: Project; label: string }) {
  return (
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
  );
}

export function StageControl({ project }: { project: Project }) {
  const level = stageLevel(project.stage);
  return (
    <div className="flex items-center gap-2">
      <select
        className="-ml-1 h-11 rounded-md bg-transparent text-[13px] font-semibold"
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
  );
}

/** The Live/Parked label and switch, or "Always on" in always-on areas. */
export function LiveControl({
  project,
  label,
  alwaysOn,
  slotsFull,
}: {
  project: Project;
  label: string;
  alwaysOn: boolean;
  slotsFull: boolean;
}) {
  if (alwaysOn) {
    return (
      <span className="eyebrow inline-flex min-h-11 flex-none items-center gap-2 text-area-ink">
        <span className="dot" />
        Always on
      </span>
    );
  }
  const blocked = !project.active && slotsFull;
  return (
    <div className="flex flex-none items-center gap-1.5">
      <span className="eyebrow text-muted">{project.active ? "Live" : "Parked"}</span>
      <button
        type="button"
        role="switch"
        aria-checked={project.active}
        aria-label={`${label} is live`}
        title={blocked ? "All three slots are live. Park one first." : undefined}
        disabled={blocked}
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
    </div>
  );
}

/** Asks first, and says how many notes go with the project. */
export function confirmDeleteProject(label: string, noteCount: number): boolean {
  const notes =
    noteCount === 0 ? "" : noteCount === 1 ? " and its note" : ` and its ${noteCount} notes`;
  return window.confirm(`Delete ${label}${notes}? This can't be undone.`);
}
