export type Stage =
  | "group"
  | "round32"
  | "round16"
  | "quarter"
  | "semi"
  | "third"
  | "final";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halfTime"
  | "finished"
  | "extraTime"
  | "penalties"
  | "postponed"
  | "cancelled";

export type Team = {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  fifaRank?: number;
  group: string;
};

export type Match = {
  id: string;
  stage: Stage;
  group?: string;
  date: string;
  venue: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  minute?: number;
  lastUpdatedAt?: string;
};

export type Standing = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type Prediction = {
  groupRankings: Record<string, string[]>;
  knockoutWinners: Record<string, string>;
  championId?: string;
  updatedAt: string;
};
