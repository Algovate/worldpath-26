import { calculateGroupStandings } from "../standings";
import type { Match, MatchStatus, Standing, Team } from "../types";

export type LiveProviderRawTeam = {
  id: string;
  name: string;
  code: string;
  flag?: string;
  confederation?: string;
  fifaRank?: number;
  group: string;
};

export type LiveProviderRawMatch = {
  id: string;
  stage: Match["stage"];
  group?: string;
  startsAt: string;
  venue: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus | string;
  minute?: number;
  updatedAt?: string;
};

export type LiveProviderRawPayload = {
  teams: LiveProviderRawTeam[];
  matches: LiveProviderRawMatch[];
};

export type NormalizedTournamentData = {
  teams: Team[];
  matches: Match[];
  standings: Record<string, Standing[]>;
};

export function normalizeLiveProviderPayload(
  payload: LiveProviderRawPayload,
): NormalizedTournamentData {
  const teams = payload.teams.map<Team>((team) => ({
    id: team.id,
    name: team.name,
    code: team.code,
    flag: team.flag ?? "□",
    confederation: team.confederation ?? "UNKNOWN",
    fifaRank: team.fifaRank,
    group: team.group,
  }));

  const matches = payload.matches.map<Match>((match) => ({
    id: match.id,
    stage: match.stage,
    group: match.group,
    date: match.startsAt,
    venue: match.venue,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: normalizeStatus(match.status),
    minute: match.minute,
    lastUpdatedAt: match.updatedAt,
  }));

  return {
    teams,
    matches,
    standings: calculateGroupStandings(teams, matches),
  };
}

function normalizeStatus(status: MatchStatus | string): MatchStatus {
  const supported: MatchStatus[] = [
    "scheduled",
    "live",
    "halfTime",
    "finished",
    "extraTime",
    "penalties",
    "postponed",
    "cancelled",
  ];

  return supported.includes(status as MatchStatus)
    ? (status as MatchStatus)
    : "scheduled";
}
