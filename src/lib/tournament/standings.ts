import type { Match, Standing, Team } from "./types";

export function calculateGroupStandings(
  teams: Team[],
  matches: Match[],
): Record<string, Standing[]> {
  const byGroup: Record<string, Standing[]> = {};
  const byTeam = new Map<string, Standing>();

  for (const team of teams) {
    const standing: Standing = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
    byTeam.set(team.id, standing);
    byGroup[team.group] ??= [];
    byGroup[team.group].push(standing);
  }

  for (const match of matches) {
    if (match.stage !== "group" || match.status !== "finished") continue;
    if (match.homeScore == null || match.awayScore == null) continue;

    const home = byTeam.get(match.homeTeamId);
    const away = byTeam.get(match.awayTeamId);
    if (!home || !away) continue;

    applyResult(home, match.homeScore, match.awayScore);
    applyResult(away, match.awayScore, match.homeScore);
  }

  for (const standings of Object.values(byGroup)) {
    standings.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.teamId.localeCompare(b.teamId),
    );
  }

  return byGroup;
}

function applyResult(
  standing: Standing,
  goalsFor: number,
  goalsAgainst: number,
) {
  standing.played += 1;
  standing.goalsFor += goalsFor;
  standing.goalsAgainst += goalsAgainst;
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    standing.won += 1;
    standing.points += 3;
  } else if (goalsFor < goalsAgainst) {
    standing.lost += 1;
  } else {
    standing.drawn += 1;
    standing.points += 1;
  }
}
