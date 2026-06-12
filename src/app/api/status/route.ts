import { getScoreProviderStatus } from "@/lib/tournament/score-adapter";
import {
  getTournamentDataSourceStatus,
  getTournamentSnapshot,
} from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  await getTournamentSnapshot();

  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    scoreProvider: getScoreProviderStatus(),
    dataSource: getTournamentDataSourceStatus(),
  });
}
