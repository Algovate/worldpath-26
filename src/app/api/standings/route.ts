import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getTournamentSnapshot();

  return Response.json({
    teams: snapshot.teams,
    standings: snapshot.standings,
    lastUpdatedAt: snapshot.lastUpdatedAt,
    isMock: snapshot.isMock,
    notice: snapshot.notice,
  });
}
