"use client";

import { useState } from "react";
import { useBoard } from "@/lib/store";
import type { TabId } from "@/lib/types";
import { AreaView } from "./AreaView";
import { Header } from "./Header";
import { Home } from "./Home";
import { Tabs } from "./Tabs";

export function Switchboard() {
  const board = useBoard();
  const [tab, setTab] = useState<TabId>("home");

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-7 px-4 pt-4 pb-14 md:gap-10 md:px-8 md:pt-8 md:pb-20">
      <Header />
      <Tabs tab={tab} onChange={setTab} board={board} />
      {board &&
        (tab === "home" ? (
          <Home board={board} onOpenArea={setTab} />
        ) : (
          <AreaView key={tab} board={board} areaId={tab} />
        ))}
    </div>
  );
}
