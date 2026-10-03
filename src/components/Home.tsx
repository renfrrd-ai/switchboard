import { AREAS, MAX_ACTIVE } from "@/lib/areas";
import { formatDate, todayISO } from "@/lib/dates";
import { parkedCount, slottedProjects, upcomingDeadlines } from "@/lib/derive";
import type { AreaId, Board } from "@/lib/types";
import { ComingUp } from "./ComingUp";
import { EmptySlot, SlotCard } from "./SlotCard";

export function Home({
  board,
  onOpenArea,
}: {
  board: Board;
  onOpenArea: (area: AreaId) => void;
}) {
  const today = todayISO();
  const slotted = slottedProjects(board);
  const upcoming = upcomingDeadlines(board, today);
  const next = upcoming[0];

  return (
    <>
      <section className="flex flex-col gap-3.5">
        <div className="font-mono text-[13px] text-muted">{formatDate(today)}</div>
        <h1 className="font-display text-[clamp(44px,7vw,84px)] leading-[0.95] font-[750] tracking-[-0.035em]">
          {slotted.length} live, <span className="text-muted">{parkedCount(board)} parked.</span>
        </h1>
        {next && (
          <p className="text-base text-muted">
            Next up:{" "}
            <span className="font-medium text-ink">
              {next.label}, {formatDate(next.date)}
            </span>
          </p>
        )}
      </section>

      <section aria-label="Active slots" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: MAX_ACTIVE }, (_, i) => {
          const project = slotted[i];
          const number = `0${i + 1}`;
          return project ? (
            <SlotCard key={project.id} project={project} number={number} today={today} />
          ) : (
            <EmptySlot key={number} number={number} />
          );
        })}
      </section>

      <section className="flex flex-wrap items-start gap-4">
        <ComingUp upcoming={upcoming} />
        <div className="grid min-w-0 flex-[2_1_520px] grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {AREAS.map((area) => {
            const mine = board.projects.filter((p) => p.area === area.id);
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onOpenArea(area.id)}
                className={`area-${area.id} flex min-h-[72px] min-w-0 flex-col gap-3.5 rounded-[20px] bg-area-soft p-4 text-left transition-transform hover:-translate-y-0.5 sm:min-h-[132px] sm:p-5`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="inline-flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-area-ink">
                    <span className="dot" />
                    {area.label}
                  </span>
                  <span className="font-display text-[30px] leading-none font-[750] text-area-ink">
                    {mine.length}
                  </span>
                </span>
                <span className="mt-auto hidden text-[13px] leading-[1.45] text-muted sm:block">
                  {mine.length
                    ? mine.map((p) => p.name || "Untitled").join(" · ")
                    : "Nothing here yet"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
