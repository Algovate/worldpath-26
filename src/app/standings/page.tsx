import { SectionHeader } from "@/components/section-header";
import { StandingsTable } from "@/features/standings/standings-table";
import { mockScoreAdapter } from "@/lib/tournament/score-adapter";

export default async function StandingsPage() {
  const [teams, standings] = await Promise.all([
    mockScoreAdapter.getTeams(),
    mockScoreAdapter.getStandings(),
  ]);
  const teamsById = new Map(teams.map((team) => [team.id, team]));

  return (
    <div>
      <SectionHeader
        eyebrow="Tables"
        title="小组积分榜"
        description="前两名直通 32 强，第三名进入最佳第三排名池。"
      />
      <div className="standings-grid">
        {Object.entries(standings).map(([group, table]) => (
          <StandingsTable key={group} group={group} standings={table} teamsById={teamsById} />
        ))}
      </div>
    </div>
  );
}
