"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/lib/tournament/format";
import type { Standing, Team } from "@/lib/tournament/types";
import { StandingsTable } from "./standings-table";

type StandingsPayload = {
  teams: Team[];
  standings: Record<string, Standing[]>;
  lastUpdatedAt: string;
  isMock: boolean;
  notice: string;
};

export function StandingsBoard({
  initialData,
}: {
  initialData: StandingsPayload;
}) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const teamsById = useMemo(
    () => new Map(data.teams.map((team) => [team.id, team])),
    [data.teams],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh();
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  async function refresh() {
    setIsRefreshing(true);
    setError(undefined);
    try {
      const response = await fetch("/api/standings", { cache: "no-store" });
      if (!response.ok) throw new Error("refresh failed");
      setData((await response.json()) as StandingsPayload);
    } catch {
      setError("积分榜刷新失败，当前展示最后一次可用数据。");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="stack">
      <div className="refresh-row">
        <span>
          最后更新：{formatDateTime(data.lastUpdatedAt)} ·{" "}
          {data.isMock ? "模拟数据" : "实时数据"}
        </span>
        <button className="secondary-button" type="button" onClick={refresh} disabled={isRefreshing}>
          {isRefreshing ? "刷新中" : "刷新积分"}
        </button>
      </div>
      {error ? <div className="warning-banner">{error}</div> : null}
      <div className="standings-grid">
        {Object.entries(data.standings).map(([group, table]) => (
          <StandingsTable
            key={group}
            group={group}
            standings={table}
            teamsById={teamsById}
          />
        ))}
      </div>
    </div>
  );
}
