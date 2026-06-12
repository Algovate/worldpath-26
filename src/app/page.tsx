import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { MatchCard } from "@/features/matches/match-card";
import { mockScoreAdapter } from "@/lib/tournament/score-adapter";

export default async function Home() {
  const [teams, matches, standings] = await Promise.all([
    mockScoreAdapter.getTeams(),
    mockScoreAdapter.getMatches(),
    mockScoreAdapter.getStandings(),
  ]);
  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const liveMatches = matches.filter((match) => match.status === "live" || match.status === "halfTime");
  const finishedMatches = matches.filter((match) => match.status === "finished");
  const upcomingMatches = matches.filter((match) => match.status === "scheduled").slice(0, 4);
  const leaders = Object.values(standings)
    .map((group) => group[0])
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="stack">
      <SectionHeader
        eyebrow="World Cup 2026"
        title="成绩、积分和冠军预测工作台"
        description="当前为产品原型数据，不代表官方赛程或实时比分。"
        action={<Link className="data-pill" href="/predictions">开始预测</Link>}
      />

      <section className="stats-grid">
        <div className="stat-card"><span>球队</span><strong>{teams.length}</strong></div>
        <div className="stat-card"><span>小组</span><strong>12</strong></div>
        <div className="stat-card"><span>进行中</span><strong>{liveMatches.length}</strong></div>
        <div className="stat-card"><span>已结束</span><strong>{finishedMatches.length}</strong></div>
      </section>

      <div className="dashboard-grid">
        <section className="stack">
          <SectionHeader eyebrow="Live board" title="实时关注" description="模拟刷新状态会在后续接入真实数据源。" />
          <div className="match-grid">
            {[...liveMatches, ...finishedMatches.slice(0, 2)].map((match) => (
              <MatchCard key={match.id} match={match} teamsById={teamsById} />
            ))}
          </div>
        </section>

        <aside className="stack">
          <div className="notice">
            <p className="eyebrow">Mock update</p>
            <strong>最后更新：2026-06-12 10:24</strong>
            <p>首版使用本地模拟比分，数据层已预留真实实时比分适配器。</p>
          </div>
          <div className="notice">
            <p className="eyebrow">小组领跑</p>
            {leaders.map((standing) => {
              const team = teamsById.get(standing.teamId);
              return <p key={standing.teamId}>{team?.flag} {team?.name} · {standing.points} 分</p>;
            })}
          </div>
          <div className="notice">
            <p className="eyebrow">即将开赛</p>
            {upcomingMatches.map((match) => (
              <p key={match.id}>{teamsById.get(match.homeTeamId)?.code} vs {teamsById.get(match.awayTeamId)?.code}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
