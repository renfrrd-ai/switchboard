import { MAX_ACTIVE } from "@/lib/areas";
import { formatDate, todayISO } from "@/lib/dates";
import { parkedCount, slottedProjects, upcomingDeadlines } from "@/lib/derive";
import type { Board } from "@/lib/types";
import { ComingUp } from "./ComingUp";
import { EmptySlot, SlotCard } from "./SlotCard";

/**
 * One place to look: the three live slots carry the colour and the weight.
 * Deadlines sit quietly underneath. Areas are reached from the tabs.
 */
export function Home({ board }: { board: Board }) {
  const today = todayISO();
  const slotted = slottedProjects(board);
  const upcoming = upcomingDeadlines(board, today);

  return (
    <>
      <section className="flex flex-col gap-2">
        <div className="font-mono text-[13px] text-muted">{formatDate(today)}</div>
        <h1 className="font-display text-[clamp(34px,5vw,56px)] leading-[0.95] font-[750] tracking-[-0.03em]">
          {slotted.length} live, <span className="text-muted">{parkedCount(board)} parked.</span>
        </h1>
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

      <ComingUp upcoming={upcoming} />
    </>
  );
}
