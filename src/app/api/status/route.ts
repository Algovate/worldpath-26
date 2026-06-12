import { getScoreProviderStatus } from "@/lib/tournament/score-adapter";
import {
  getTournamentDataSourceStatus,
  getTournamentSnapshot,
} from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getStatusPayload());
}

export async function getStatusPayload() {
  await getTournamentSnapshot();

  return {
    ok: true,
    checkedAt: new Date().toISOString(),
    scoreProvider: getScoreProviderStatus(),
    dataSource: getTournamentDataSourceStatus(),
  };
}
