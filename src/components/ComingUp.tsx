"use client";

import { useState } from "react";
import { dateParts, dueLabel } from "@/lib/dates";
import type { UpcomingDeadline } from "@/lib/derive";
import { addDeadline, removeDeadline } from "@/lib/store";
import { CloseIcon } from "./icons";

const PREVIEW_COUNT = 3;

export function ComingUp({ upcoming }: { upcoming: UpcomingDeadline[] }) {
  const [editing, setEditing] = useState(false);
  const shown = editing ? upcoming : upcoming.slice(0, PREVIEW_COUNT);
  const more = upcoming.length - shown.length;

  return (
    <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-[18px] rounded-[28px] border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-[-0.01em]">Coming up</h2>
        <button
          type="button"
          className="btn btn-quiet -my-2 -mr-3 px-3 text-muted"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {upcoming.length === 0 && !editing && (
        <p className="text-sm text-muted">No deadlines ahead.</p>
      )}

      {shown.map((d) => {
        const parts = dateParts(d.date);
        return (
          <div key={d.id} className="flex items-center gap-3.5">
            <div className="flex h-14 w-[52px] flex-none flex-col items-center justify-center gap-[3px] rounded-[14px] bg-bg">
              <span className="font-display text-xl leading-none font-bold">{parts.day}</span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
                {parts.month}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{d.label}</div>
              {d.source && <div className="text-[13px] text-muted">{d.source}</div>}
            </div>
            {editing ? (
              <button
                type="button"
                className="btn btn-quiet btn-round text-muted"
                aria-label={`Remove ${d.label}`}
                onClick={() => removeDeadline(d.id)}
              >
                <CloseIcon />
              </button>
            ) : (
              <span
                className={`font-mono text-xs whitespace-nowrap ${
                  d.soon ? "font-medium text-warn" : "text-muted"
                }`}
              >
                {dueLabel(d.daysLeft)}
              </span>
            )}
          </div>
        );
      })}

      {more > 0 && (
        <div className="font-mono text-xs text-muted">{more} more after that</div>
      )}

      {editing && <AddDeadline />}
    </div>
  );
}

function AddDeadline() {
  const [label, setLabel] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");

  return (
    <form
      className="flex flex-col gap-2 border-t border-line pt-[18px]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!label.trim() || !date) return;
        addDeadline({ label: label.trim(), source: source.trim(), date });
        setLabel("");
        setSource("");
        setDate("");
      }}
    >
      <input
        type="text"
        required
        className="field field-boxed"
        aria-label="What is due"
        placeholder="What is due"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <input
        type="text"
        className="field field-boxed"
        aria-label="Where it comes from (optional)"
        placeholder="Where it comes from (optional)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <div className="flex gap-2">
        <input
          type="date"
          required
          className="field field-boxed min-w-0 flex-1"
          aria-label="Due date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="btn btn-solid">
          Add
        </button>
      </div>
    </form>
  );
}
