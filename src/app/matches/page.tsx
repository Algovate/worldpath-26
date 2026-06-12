import { SectionHeader } from "@/components/section-header";
import { MatchFilters } from "@/features/matches/match-filters";
import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export default async function MatchesPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <div>
      <SectionHeader
        eyebrow="Matches"
        title="赛程与比分"
        description="按阶段和状态筛选比赛，比分均为原型模拟数据。"
      />
      <MatchFilters
        teams={snapshot.teams}
        matches={snapshot.matches}
        lastUpdatedAt={snapshot.lastUpdatedAt}
        isMock={snapshot.isMock}
      />
    </div>
  );
}
