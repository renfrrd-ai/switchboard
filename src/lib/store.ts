"use client";

import { useSyncExternalStore } from "react";
import { MAX_ACTIVE, isAlwaysOn } from "./areas";
import { todayISO } from "./dates";
import { removeProjectNotes } from "./notes";
import { seedBoard } from "./seed";
import type { AreaId, Board, Deadline, Project } from "./types";

/**
 * The board lives in this module and is saved to localStorage on every change.
 * Every read and write goes through the functions below, so moving to a real
 * database later means replacing `load` and `save` and nothing else.
 */

const STORAGE_KEY = "switchboard:board:v1";

let board: Board | null = null;
const listeners = new Set<() => void>();

function load(): Board {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Board;
      if (Array.isArray(parsed.projects) && Array.isArray(parsed.deadlines)) {
        return parsed;
      }
    }
  } catch {
    // Unreadable or blocked storage: fall through to the seed.
  }
  return seedBoard();
}

function save(next: Board) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep working in memory for this session.
  }
}

function commit(next: Board) {
  board = next;
  save(next);
  listeners.forEach((notify) => notify());
}

function current(): Board {
  if (board === null) board = load();
  return board;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Pick up changes made in another tab or window of the same browser.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    board = load();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved board, or null while rendering on the server. */
export function useBoard(): Board | null {
  return useSyncExternalStore(subscribe, current, () => null);
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function activeCount(b: Board): number {
  return b.projects.filter((p) => p.active && !isAlwaysOn(p.area)).length;
}

export function updateProject(id: string, patch: Partial<Omit<Project, "id">>) {
  const b = current();
  commit({
    ...b,
    projects: b.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  });
}

/** Marks the next step done: stamps today and clears the step. */
export function completeStep(id: string) {
  updateProject(id, { lastTouched: todayISO(), nextStep: "" });
}

/** Returns false when the project could not be activated because slots are full. */
export function setActive(id: string, active: boolean): boolean {
  const b = current();
  const project = b.projects.find((p) => p.id === id);
  if (!project || isAlwaysOn(project.area)) return false;
  if (active && !project.active && activeCount(b) >= MAX_ACTIVE) return false;
  updateProject(id, { active });
  return true;
}

export function addProject(area: AreaId): string {
  const b = current();
  const project: Project = {
    id: newId(),
    area,
    name: "",
    note: "",
    stage: isAlwaysOn(area) ? "Ongoing" : "Idea",
    lastTouched: todayISO(),
    nextStep: "",
    active: false,
  };
  commit({ ...b, projects: [...b.projects, project] });
  return project.id;
}

/** Deletes the project and every note filed under it. */
export function removeProject(id: string) {
  const b = current();
  commit({ ...b, projects: b.projects.filter((p) => p.id !== id) });
  removeProjectNotes(id);
}

export function addDeadline(input: Omit<Deadline, "id">) {
  const b = current();
  commit({ ...b, deadlines: [...b.deadlines, { ...input, id: newId() }] });
}

export function removeDeadline(id: string) {
  const b = current();
  commit({ ...b, deadlines: b.deadlines.filter((d) => d.id !== id) });
}
