import { SOON_WITHIN_DAYS, STALE_AFTER_DAYS, isAlwaysOn } from "./areas";
import { daysBetween } from "./dates";
import type { Board, Deadline, Project } from "./types";

export interface UpcomingDeadline extends Deadline {
  daysLeft: number;
  soon: boolean;
}

/** Deadlines from today onward, soonest first. */
export function upcomingDeadlines(board: Board, today: string): UpcomingDeadline[] {
  return board.deadlines
    .map((d) => {
      const daysLeft = daysBetween(today, d.date);
      return { ...d, daysLeft, soon: daysLeft <= SOON_WITHIN_DAYS };
    })
    .filter((d) => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function daysSinceTouched(project: Project, today: string): number {
  return daysBetween(project.lastTouched, today);
}

/** Stale means: holding a slot, but nothing has moved for two weeks. */
export function isStale(project: Project, today: string): boolean {
  return (
    project.active &&
    !isAlwaysOn(project.area) &&
    daysSinceTouched(project, today) >= STALE_AFTER_DAYS
  );
}

export function slottedProjects(board: Board): Project[] {
  return board.projects.filter((p) => p.active && !isAlwaysOn(p.area));
}

export function parkedCount(board: Board): number {
  return board.projects.filter((p) => !p.active && !isAlwaysOn(p.area)).length;
}
