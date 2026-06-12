import { getScoreProviderStatus } from "@/lib/tournament/score-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    scoreProvider: getScoreProviderStatus(),
  });
}
