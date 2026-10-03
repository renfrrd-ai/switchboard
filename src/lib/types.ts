import type { JSONContent } from "@tiptap/react";

export type AreaId =
  | "school"
  | "products"
  | "builds"
  | "content"
  | "commitments"
  | "personal";

export type TabId = "home" | AreaId;

export type Stage = "Idea" | "Planned" | "Building" | "MVP" | "Live" | "Ongoing";

export interface Project {
  id: string;
  area: AreaId;
  name: string;
  note: string;
  stage: Stage;
  /** ISO date (YYYY-MM-DD) of the last time the next step was completed. */
  lastTouched: string;
  /** Exactly one next step. Empty means it still needs to be written. */
  nextStep: string;
  /** Occupies one of the three active slots. Ignored in always-on areas. */
  active: boolean;
}

export interface Deadline {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  label: string;
  source: string;
}

/**
 * A note belongs to exactly one project or one area: one of `projectId` and
 * `area` is set and the other is null.
 */
export interface Note {
  id: string;
  projectId: string | null;
  area: AreaId | null;
  title: string;
  /** The editor's document as JSON. Null until the body is first edited. */
  body: JSONContent | null;
  /** Plain-text copy of the body, kept for search. */
  text: string;
  /** ISO timestamps. */
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  projects: Project[];
  deadlines: Deadline[];
}
