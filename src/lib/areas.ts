import type { AreaId, Stage } from "./types";

export interface Area {
  id: AreaId;
  label: string;
  /**
   * Always-on areas hold work with deadlines you don't control.
   * Their projects never take one of the three active slots.
   */
  alwaysOn: boolean;
}

export const AREAS: Area[] = [
  { id: "school", label: "School", alwaysOn: true },
  { id: "products", label: "Products", alwaysOn: false },
  { id: "builds", label: "Builds", alwaysOn: false },
  { id: "content", label: "Content", alwaysOn: false },
  { id: "commitments", label: "Commitments", alwaysOn: true },
  { id: "personal", label: "Personal", alwaysOn: false },
];

export const AREA_BY_ID = Object.fromEntries(
  AREAS.map((a) => [a.id, a]),
) as Record<AreaId, Area>;

export function isAlwaysOn(area: AreaId): boolean {
  return AREA_BY_ID[area].alwaysOn;
}

/** Slots shared across every area that is not always-on. */
export const MAX_ACTIVE = 3;

/** An active project untouched for this many days is flagged stale. */
export const STALE_AFTER_DAYS = 14;

/** A deadline this close is highlighted. */
export const SOON_WITHIN_DAYS = 7;

export const STAGES: { id: Stage; level: number }[] = [
  { id: "Idea", level: 1 },
  { id: "Planned", level: 2 },
  { id: "Building", level: 3 },
  { id: "MVP", level: 4 },
  { id: "Live", level: 5 },
  { id: "Ongoing", level: 0 },
];

export const STAGE_STEPS = 5;

export function stageLevel(stage: Stage): number {
  return STAGES.find((s) => s.id === stage)?.level ?? 0;
}
