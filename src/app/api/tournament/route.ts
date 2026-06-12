import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getTournamentSnapshot());
}
