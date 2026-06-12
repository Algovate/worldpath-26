import { SectionHeader } from "@/components/section-header";
import { StandingsBoard } from "@/features/standings/standings-board";
import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export default async function StandingsPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <div>
      <SectionHeader
        eyebrow="Tables"
        title="小组积分榜"
        description="前两名直通 32 强，第三名进入最佳第三排名池。"
      />
      <StandingsBoard
        initialData={{
          teams: snapshot.teams,
          standings: snapshot.standings,
          lastUpdatedAt: snapshot.lastUpdatedAt,
          isMock: snapshot.isMock,
          notice: snapshot.notice,
        }}
      />
    </div>
  );
}
