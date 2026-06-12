"use client";

import { useMemo, useState } from "react";
import { formatStage } from "@/lib/tournament/format";
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
}: {
  matches: Match[];
  teams: Team[];
}) {
  const [stage, setStage] = useState<Stage | "all">("all");
  const [status, setStatus] = useState<MatchStatus | "all">("all");
  const teamsById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const filtered = matches.filter((match) => {
    const stageMatch = stage === "all" || match.stage === stage;
    const statusMatch = status === "all" || match.status === status;
    return stageMatch && statusMatch;
  });

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
      </div>
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
