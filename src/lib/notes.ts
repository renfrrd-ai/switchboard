"use client";

import { useSyncExternalStore } from "react";
import type { AreaId, Note } from "./types";

/**
 * Notes live in this module and are saved to localStorage on every change,
 * under their own key so the board and the notes load and save separately.
 * Every read and write goes through the functions below.
 */

const STORAGE_KEY = "switchboard:notes:v1";

let notes: Note[] | null = null;
const listeners = new Set<() => void>();

function load(): Note[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Note[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Unreadable or blocked storage: start with no notes.
  }
  return [];
}

function save(next: Note[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep working in memory for this session.
  }
}

function commit(next: Note[]) {
  notes = next;
  save(next);
  listeners.forEach((notify) => notify());
}

function current(): Note[] {
  if (notes === null) notes = load();
  return notes;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Pick up changes made in another tab or window of the same browser.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    notes = load();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

/** Every saved note, or null while rendering on the server. */
export function useNotes(): Note[] | null {
  return useSyncExternalStore(subscribe, current, () => null);
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Most recently edited first. */
const byUpdated = (a: Note, b: Note) => b.updatedAt.localeCompare(a.updatedAt);

export function projectNotes(all: Note[], projectId: string): Note[] {
  return all.filter((n) => n.projectId === projectId).sort(byUpdated);
}

/** Notes filed under an area itself, not under one of its projects. */
export function areaNotes(all: Note[], area: AreaId): Note[] {
  return all.filter((n) => n.projectId === null && n.area === area).sort(byUpdated);
}

export function countProjectNotes(projectId: string): number {
  return current().filter((n) => n.projectId === projectId).length;
}

export function addNote(owner: { projectId: string } | { area: AreaId }): string {
  const now = new Date().toISOString();
  const note: Note = {
    id: newId(),
    projectId: "projectId" in owner ? owner.projectId : null,
    area: "area" in owner ? owner.area : null,
    title: "",
    body: null,
    text: "",
    createdAt: now,
    updatedAt: now,
  };
  commit([...current(), note]);
  return note.id;
}

export function updateNote(id: string, patch: Partial<Pick<Note, "title" | "body" | "text">>) {
  const updatedAt = new Date().toISOString();
  commit(current().map((n) => (n.id === id ? { ...n, ...patch, updatedAt } : n)));
}

export function removeNote(id: string) {
  commit(current().filter((n) => n.id !== id));
}

export function removeProjectNotes(projectId: string) {
  commit(current().filter((n) => n.projectId !== projectId));
}
