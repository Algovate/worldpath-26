import type { Match, MatchStatus, Stage, Standing, Team } from "./types";

const worldCup26BaseUrl = "https://worldcup26.ir";

type WorldCup26Team = {
  id: string;
  name_en: string;
  fifa_code: string;
  iso2: string;
  groups: string;
};

type WorldCup26Game = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
  home_team_label?: string;
  away_team_label?: string;
};

type WorldCup26Group = {
  name: string;
  teams: Array<{
    team_id: string;
    mp: string;
    w: string;
    l: string;
    d: string;
    pts: string;
    gf: string;
    ga: string;
    gd: string;
  }>;
};

type WorldCup26Payload = {
  teams: WorldCup26Team[];
  games: WorldCup26Game[];
  groups: WorldCup26Group[];
};

export async function fetchWorldCup26TournamentData() {
  const [teamsResponse, gamesResponse, groupsResponse] = await Promise.all([
    fetchWorldCup26<{ teams: WorldCup26Team[] }>("/get/teams"),
    fetchWorldCup26<{ games: WorldCup26Game[] }>("/get/games"),
    fetchWorldCup26<{ groups: WorldCup26Group[] }>("/get/groups"),
  ]);

  return normalizeWorldCup26Payload({
    teams: teamsResponse.teams,
    games: gamesResponse.games,
    groups: groupsResponse.groups,
  });
}

export function normalizeWorldCup26Payload(payload: WorldCup26Payload) {
  const teams = payload.teams.map<Team>((team) => ({
    id: team.id,
    name: team.name_en,
    code: team.fifa_code,
    flag: toFlagEmoji(team.iso2),
    confederation: "UNKNOWN",
    group: team.groups,
  }));
  const matches = payload.games.map<Match>((game) => ({
    id: `wc26-${game.id}`,
    stage: normalizeStage(game.type),
    group: game.group,
    date: normalizeDate(game.local_date),
    venue: `Stadium ${game.stadium_id}`,
    homeTeamId: game.home_team_id === "0" ? game.home_team_label ?? "TBD" : game.home_team_id,
    awayTeamId: game.away_team_id === "0" ? game.away_team_label ?? "TBD" : game.away_team_id,
    homeScore: Number(game.home_score),
    awayScore: Number(game.away_score),
    status: normalizeStatus(game.finished, game.time_elapsed),
    minute: normalizeMinute(game.time_elapsed),
    lastUpdatedAt: new Date().toISOString(),
  }));
  const standings = Object.fromEntries(
    payload.groups.map((group) => [
      group.name,
      group.teams.map<Standing>((team) => ({
        teamId: team.team_id,
        played: Number(team.mp),
        won: Number(team.w),
        drawn: Number(team.d),
        lost: Number(team.l),
        goalsFor: Number(team.gf),
        goalsAgainst: Number(team.ga),
        goalDifference: Number(team.gd),
        points: Number(team.pts),
      })),
    ]),
  );

  return { teams, matches, standings };
}

async function fetchWorldCup26<T>(path: string): Promise<T> {
  const response = await fetch(`${worldCup26BaseUrl}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`WorldCup26 API failed ${path} with ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeStage(type: string): Stage {
  const value = type.toLowerCase();
  if (value === "r32") return "round32";
  if (value === "r16") return "round16";
  if (value === "qf") return "quarter";
  if (value === "sf") return "semi";
  if (value === "third") return "third";
  if (value === "final") return "final";
  return "group";
}

function normalizeStatus(finished: string, timeElapsed: string): MatchStatus {
  if (finished === "TRUE") return "finished";
  if (timeElapsed === "notstarted") return "scheduled";
  if (timeElapsed === "finished") return "finished";
  return "live";
}

function normalizeMinute(timeElapsed: string) {
  const minute = Number(timeElapsed);
  return Number.isFinite(minute) ? minute : undefined;
}

function normalizeDate(value: string) {
  const [date, time] = value.split(" ");
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}:00`;
}

function toFlagEmoji(value: string) {
  if (value === "ENG") return "🏴";
  if (value === "SCO") return "🏴";
  if (value.length !== 2) return "□";

  return value
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}
