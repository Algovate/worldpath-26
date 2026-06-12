import type { Prediction, Team } from "./types";

export function buildInitialGroupRankings(
  teams: Team[],
): Record<string, string[]> {
  return teams.reduce<Record<string, string[]>>((groups, team) => {
    groups[team.group] ??= [];
    groups[team.group].push(team.id);
    groups[team.group].sort((a, b) => {
      const teamA = teams.find((item) => item.id === a);
      const teamB = teams.find((item) => item.id === b);
      return (teamA?.fifaRank ?? 999) - (teamB?.fifaRank ?? 999);
    });
    return groups;
  }, {});
}

export function getQualifiedTeamIds(
  groupRankings: Record<string, string[]>,
): string[] {
  const groups = Object.keys(groupRankings).sort();
  const topTwo = groups.flatMap((group) => groupRankings[group].slice(0, 2));
  const thirdPlace = groups
    .map((group) => groupRankings[group][2])
    .filter(Boolean)
    .slice(0, 8);
  return [...topTwo, ...thirdPlace];
}

export function buildRoundOf32Seeds(
  groupRankings: Record<string, string[]>,
): [string, string][] {
  const ids = getQualifiedTeamIds(groupRankings);
  const pairings: [string, string][] = [];
  for (let index = 0; index < ids.length / 2; index += 1) {
    pairings.push([ids[index], ids[ids.length - 1 - index]]);
  }
  return pairings;
}

export function advanceKnockoutWinner(
  matchId: string,
  winnerId: string,
  winners: Record<string, string>,
) {
  return {
    ...winners,
    [matchId]: winnerId,
  };
}

export function getPredictionCompletion(prediction: Prediction): number {
  const groupSlots = Object.values(prediction.groupRankings).reduce(
    (total, ids) => total + ids.length,
    0,
  );
  const winnerSlots = Object.keys(prediction.knockoutWinners).length;
  const championSlot = prediction.championId ? 1 : 0;
  return Math.min(100, Math.round(((groupSlots + winnerSlots + championSlot) / 80) * 100));
}
