"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AREA_BY_ID } from "@/lib/areas";
import { useBoard } from "@/lib/store";
import type { AreaId, TabId } from "@/lib/types";
import { AreaView } from "./AreaView";
import { Home } from "./Home";
import { PageShell } from "./PageShell";
import { Tabs } from "./Tabs";

/** The tab lives in the URL (?tab=products) so Back from a project or note lands on it. */
function useTab(): [TabId, (tab: TabId) => void] {
  const router = useRouter();
  const param = useSearchParams().get("tab");
  const tab: TabId = param && param in AREA_BY_ID ? (param as AreaId) : "home";
  const setTab = (next: TabId) =>
    router.push(next === "home" ? "/" : `/?tab=${next}`, { scroll: false });
  return [tab, setTab];
}

export function Switchboard() {
  const board = useBoard();
  const [tab, setTab] = useTab();

  return (
    <PageShell>
      <Tabs tab={tab} onChange={setTab} board={board} />
      {board &&
        (tab === "home" ? (
          <Home board={board} />
        ) : (
          <AreaView key={tab} board={board} areaId={tab} />
        ))}
    </PageShell>
  );
}
