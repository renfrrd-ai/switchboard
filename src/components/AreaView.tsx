"use client";

import { useState } from "react";
import { AREA_BY_ID, MAX_ACTIVE } from "@/lib/areas";
import { todayISO } from "@/lib/dates";
import { areaNotes, useNotes } from "@/lib/notes";
import { activeCount, addProject } from "@/lib/store";
import type { AreaId, Board } from "@/lib/types";
import { PlusIcon } from "./icons";
import { NoteList } from "./NoteList";
import { ProjectCard } from "./ProjectCard";

export function AreaView({ board, areaId }: { board: Board; areaId: AreaId }) {
  const [freshId, setFreshId] = useState<string | null>(null);
  const notes = useNotes();
  const area = AREA_BY_ID[areaId];
  const today = todayISO();
  const projects = board.projects.filter((p) => p.area === areaId);
  const live = projects.filter((p) => p.active).length;
  const slotsFull = activeCount(board) >= MAX_ACTIVE;

  const countWord = projects.length === 1 ? "1 project" : `${projects.length} projects`;
  const summary = area.alwaysOn ? `${countWord}, always on` : `${countWord}, ${live} live`;

  return (
    <section className={`area-${areaId} flex flex-col gap-7`}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 font-mono text-[13px] text-area-ink">
            <span className="dot" />
            {summary}
          </div>
          <h1 className="font-display text-[clamp(44px,7vw,84px)] leading-[0.95] font-[750] tracking-[-0.035em]">
            {area.label}
          </h1>
        </div>
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => setFreshId(addProject(areaId))}
        >
          <PlusIcon />
          Add a project
        </button>
      </div>

      {slotsFull && !area.alwaysOn && (
        <p className="text-sm text-muted">
          All three slots are live. Park one to switch another on.
        </p>
      )}

      {projects.length > 0 ? (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              today={today}
              alwaysOn={area.alwaysOn}
              slotsFull={slotsFull}
              focusName={project.id === freshId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-[28px] bg-area-soft px-6 py-16 text-center">
          <div className="font-display text-[26px] font-bold tracking-[-0.02em]">
            Nothing here yet
          </div>
          <p className="text-sm text-muted">Add the first thing you want to keep an eye on.</p>
        </div>
      )}

      {notes && (
        <NoteList
          notes={areaNotes(notes, areaId)}
          owner={{ area: areaId }}
          emptyText={`Notes about ${area.label} that aren't about one project go here.`}
        />
      )}
    </section>
  );
}
