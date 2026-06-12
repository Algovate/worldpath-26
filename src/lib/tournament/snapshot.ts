import { getScoreAdapter } from "./score-adapter";
import type { Match, Standing, Team } from "./types";

export type TournamentSnapshot = {
  teams: Team[];
  matches: Match[];
  standings: Record<string, Standing[]>;
  lastUpdatedAt: string;
  isMock: boolean;
  provider: string;
  notice: string;
};

export async function getTournamentSnapshot(): Promise<TournamentSnapshot> {
  const adapter = getScoreAdapter();
  const [teams, matches, standings] = await Promise.all([
    adapter.getTeams(),
    adapter.getMatches(),
    adapter.getStandings(),
  ]);

  return {
    teams,
    matches,
    standings,
    lastUpdatedAt: new Date().toISOString(),
    isMock: adapter.isMock,
    provider: adapter.provider,
    notice: adapter.notice,
  };
}
