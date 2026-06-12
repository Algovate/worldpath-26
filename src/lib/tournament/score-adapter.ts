import { matches, teams } from "./mock-data";
import { calculateGroupStandings } from "./standings";
import type { Match, Standing, Team } from "./types";

export type ScoreAdapter = {
  getTeams(): Promise<Team[]>;
  getMatches(): Promise<Match[]>;
  getStandings(): Promise<Record<string, Standing[]>>;
};

export const mockScoreAdapter: ScoreAdapter = {
  async getTeams() {
    return teams;
  },
  async getMatches() {
    return matches;
  },
  async getStandings() {
    return calculateGroupStandings(teams, matches);
  },
};
