"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime, formatStage } from "@/lib/tournament/format";
import type { Match, MatchStatus, Stage, Team } from "@/lib/tournament/types";
import { MatchCard } from "./match-card";

const stageOptions: Array<Stage | "all"> = [
  "all",
  "group",
  "round32",
  "round16",
  "quarter",
  "semi",
  "third",
  "final",
];
const statusOptions: Array<MatchStatus | "all"> = [
  "all",
  "scheduled",
  "live",
  "halfTime",
  "finished",
];

const statusLabels: Record<MatchStatus | "all", string> = {
  all: "全部状态",
  scheduled: "未开始",
  live: "进行中",
  halfTime: "中场",
  finished: "已结束",
  extraTime: "加时",
  penalties: "点球",
  postponed: "延期",
  cancelled: "取消",
};

export function MatchFilters({
  matches,
  teams,
  lastUpdatedAt,
  isMock,
}: {
  matches: Match[];
  teams: Team[];
  lastUpdatedAt: string;
  isMock: boolean;
}) {
  const [stage, setStage] = useState<Stage | "all">("all");
  const [status, setStatus] = useState<MatchStatus | "all">("all");
  const [data, setData] = useState({ matches, teams, lastUpdatedAt, isMock });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const teamsById = useMemo(() => new Map(data.teams.map((team) => [team.id, team])), [data.teams]);
  const filtered = data.matches.filter((match) => {
    const stageMatch = stage === "all" || match.stage === stage;
    const statusMatch = status === "all" || match.status === status;
    return stageMatch && statusMatch;
  });

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
      const response = await fetch("/api/matches", { cache: "no-store" });
      if (!response.ok) throw new Error("refresh failed");
      setData(await response.json());
    } catch {
      setError("赛程比分刷新失败，当前展示最后一次可用数据。");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="stack">
      <div className="filterbar">
        <label>
          阶段
          <select value={stage} onChange={(event) => setStage(event.target.value as Stage | "all")}>
            {stageOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "全部阶段" : formatStage(option)}
              </option>
            ))}
          </select>
        </label>
        <label>
          状态
          <select value={status} onChange={(event) => setStatus(event.target.value as MatchStatus | "all")}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {statusLabels[option]}
              </option>
            ))}
          </select>
        </label>
        <div className="refresh-row inline">
          <span>
            最后更新：{formatDateTime(data.lastUpdatedAt)} ·{" "}
            {data.isMock ? "模拟数据" : "实时数据"}
          </span>
          <button className="secondary-button" type="button" onClick={refresh} disabled={isRefreshing}>
            {isRefreshing ? "刷新中" : "刷新比分"}
          </button>
        </div>
      </div>
      {error ? <div className="warning-banner">{error}</div> : null}
      {filtered.length ? (
        <div className="match-grid">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} teamsById={teamsById} />
          ))}
        </div>
      ) : (
        <div className="empty-state">当前筛选条件下没有比赛。</div>
      )}
    </div>
  );
}
