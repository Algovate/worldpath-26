import { mockScoreAdapter } from "./score-adapter";
import type { Match, Standing, Team } from "./types";

export type TournamentSnapshot = {
  teams: Team[];
  matches: Match[];
  standings: Record<string, Standing[]>;
  lastUpdatedAt: string;
  isMock: boolean;
  notice: string;
};

export async function getTournamentSnapshot(): Promise<TournamentSnapshot> {
  const [teams, matches, standings] = await Promise.all([
    mockScoreAdapter.getTeams(),
    mockScoreAdapter.getMatches(),
    mockScoreAdapter.getStandings(),
  ]);

  return {
    teams,
    matches,
    standings,
    lastUpdatedAt: new Date().toISOString(),
    isMock: true,
    notice: "当前为产品原型数据，不代表官方赛程或实时比分。",
  };
}
