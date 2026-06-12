import { SectionHeader } from "@/components/section-header";
import { MatchFilters } from "@/features/matches/match-filters";
import { mockScoreAdapter } from "@/lib/tournament/score-adapter";

export default async function MatchesPage() {
  const [teams, matches] = await Promise.all([
    mockScoreAdapter.getTeams(),
    mockScoreAdapter.getMatches(),
  ]);

  return (
    <div>
      <SectionHeader
        eyebrow="Matches"
        title="赛程与比分"
        description="按阶段和状态筛选比赛，比分均为原型模拟数据。"
      />
      <MatchFilters teams={teams} matches={matches} />
    </div>
  );
}
