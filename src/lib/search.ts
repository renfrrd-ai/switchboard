import { AREA_BY_ID } from "./areas";
import type { Board, Note } from "./types";

export interface SearchResult {
  key: string;
  kind: "project" | "note";
  href: string;
  title: string;
  /** Where it lives: the area, or area and project for a note. */
  where: string;
  /** For a note matched in its body: the text around the first match. */
  snippet?: { before: string; match: string; after: string };
}

const MAX_RESULTS = 30;
const RECENT_NOTES = 8;

const terms = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean);
const hasAll = (haystack: string, words: string[]) => {
  const h = haystack.toLowerCase();
  return words.every((w) => h.includes(w));
};

function noteWhere(board: Board, note: Note): string {
  const project = note.projectId ? board.projects.find((p) => p.id === note.projectId) : undefined;
  if (project) return `${AREA_BY_ID[project.area].label} / ${project.name || "Untitled"}`;
  return note.area ? AREA_BY_ID[note.area].label : "";
}

function snippet(text: string, words: string[]): SearchResult["snippet"] {
  const flat = text.replace(/\s+/g, " ");
  const lower = flat.toLowerCase();
  const word = words.find((w) => lower.includes(w));
  if (!word) return undefined;
  const at = lower.indexOf(word);
  const start = Math.max(0, at - 40);
  return {
    before: (start > 0 ? "…" : "") + flat.slice(start, at),
    match: flat.slice(at, at + word.length),
    after: flat.slice(at + word.length, at + word.length + 90),
  };
}

const noteResult = (board: Board, note: Note, words: string[] = []): SearchResult => ({
  key: `note:${note.id}`,
  kind: "note",
  href: `/note/${note.id}`,
  title: note.title || "Untitled",
  where: noteWhere(board, note),
  snippet: words.length && !hasAll(note.title, words) ? snippet(note.text, words) : undefined,
});

/**
 * Projects whose name has every word, then notes whose title has every word,
 * then notes where the words turn up in the title and body together.
 * An empty query lists the most recently edited notes.
 */
export function search(board: Board, notes: Note[], query: string): SearchResult[] {
  const words = terms(query);
  const recent = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (words.length === 0) return recent.slice(0, RECENT_NOTES).map((n) => noteResult(board, n));

  const projects: SearchResult[] = board.projects
    .filter((p) => hasAll(p.name, words))
    .map((p) => ({
      key: `project:${p.id}`,
      kind: "project",
      href: `/project/${p.id}`,
      title: p.name || "Untitled",
      where: AREA_BY_ID[p.area].label,
    }));

  const byTitle = recent.filter((n) => hasAll(n.title, words));
  const byText = recent.filter((n) => !byTitle.includes(n) && hasAll(`${n.title} ${n.text}`, words));

  return [
    ...projects,
    ...byTitle.map((n) => noteResult(board, n, words)),
    ...byText.map((n) => noteResult(board, n, words)),
  ].slice(0, MAX_RESULTS);
}

/** Lets any button open the palette; the palette listens for this. */
export const OPEN_SEARCH_EVENT = "switchboard:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
