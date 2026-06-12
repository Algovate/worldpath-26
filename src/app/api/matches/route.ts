import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getTournamentSnapshot();

  return Response.json({
    teams: snapshot.teams,
    matches: snapshot.matches,
    lastUpdatedAt: snapshot.lastUpdatedAt,
    isMock: snapshot.isMock,
    notice: snapshot.notice,
  });
}
