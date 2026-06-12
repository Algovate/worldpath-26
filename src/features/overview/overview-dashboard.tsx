"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { MatchCard } from "@/features/matches/match-card";
import { formatDateTime } from "@/lib/tournament/format";
import type { TournamentSnapshot } from "@/lib/tournament/snapshot";

type LoadState = {
  snapshot: TournamentSnapshot;
  isRefreshing: boolean;
  error?: string;
};

export function OverviewDashboard({
  initialSnapshot,
}: {
  initialSnapshot: TournamentSnapshot;
}) {
  const [state, setState] = useState<LoadState>({
    snapshot: initialSnapshot,
    isRefreshing: false,
  });
  const { snapshot } = state;
  const teamsById = useMemo(
    () => new Map(snapshot.teams.map((team) => [team.id, team])),
    [snapshot.teams],
  );
  const liveMatches = snapshot.matches.filter(
    (match) => match.status === "live" || match.status === "halfTime",
  );
  const finishedMatches = snapshot.matches.filter(
    (match) => match.status === "finished",
  );
  const upcomingMatches = snapshot.matches
    .filter((match) => match.status === "scheduled")
    .slice(0, 4);
  const leaders = Object.values(snapshot.standings)
    .map((group) => group[0])
    .filter(Boolean)
    .slice(0, 6);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh();
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  async function refresh() {
    setState((current) => ({ ...current, isRefreshing: true, error: undefined }));
    try {
      const response = await fetch("/api/tournament", { cache: "no-store" });
      if (!response.ok) throw new Error("refresh failed");
      const nextSnapshot = (await response.json()) as TournamentSnapshot;
      setState({ snapshot: nextSnapshot, isRefreshing: false });
    } catch {
      setState((current) => ({
        ...current,
        isRefreshing: false,
        error: "比分刷新失败，当前展示最后一次可用数据。",
      }));
    }
  }

  return (
    <div className="stack">
      <SectionHeader
        eyebrow="World Cup 2026"
        title="成绩、积分和冠军预测工作台"
        description={snapshot.notice}
        action={
          <Link className="data-pill" href="/predictions">
            开始预测
          </Link>
        }
      />

      <section className="stats-grid">
        <div className="stat-card">
          <span>球队</span>
          <strong>{snapshot.teams.length}</strong>
        </div>
        <div className="stat-card">
          <span>小组</span>
          <strong>12</strong>
        </div>
        <div className="stat-card">
          <span>进行中</span>
          <strong>{liveMatches.length}</strong>
        </div>
        <div className="stat-card">
          <span>已结束</span>
          <strong>{finishedMatches.length}</strong>
        </div>
      </section>

      {state.error ? <div className="warning-banner">{state.error}</div> : null}

      <div className="dashboard-grid">
        <section className="stack">
          <SectionHeader
            eyebrow="Live board"
            title="实时关注"
            description="浏览器会每 30 秒向本地 API 检查一次比分状态。"
          />
          <div className="match-grid">
            {[...liveMatches, ...finishedMatches.slice(0, 2)].map((match) => (
              <MatchCard key={match.id} match={match} teamsById={teamsById} />
            ))}
          </div>
        </section>

        <aside className="stack">
          <div className="notice">
            <p className="eyebrow">Data refresh</p>
            <strong>最后更新：{formatDateTime(snapshot.lastUpdatedAt)}</strong>
            <p>{snapshot.isMock ? "当前数据来自 MockScoreAdapter。" : "当前数据来自实时数据源。"}</p>
            <button className="secondary-button" type="button" onClick={refresh} disabled={state.isRefreshing}>
              {state.isRefreshing ? "刷新中" : "立即刷新"}
            </button>
          </div>
          <div className="notice">
            <p className="eyebrow">小组领跑</p>
            {leaders.map((standing) => {
              const team = teamsById.get(standing.teamId);
              return (
                <p key={standing.teamId}>
                  {team?.flag} {team?.name} · {standing.points} 分
                </p>
              );
            })}
          </div>
          <div className="notice">
            <p className="eyebrow">即将开赛</p>
            {upcomingMatches.map((match) => (
              <p key={match.id}>
                {teamsById.get(match.homeTeamId)?.code} vs{" "}
                {teamsById.get(match.awayTeamId)?.code}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
