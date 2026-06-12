"use client";

import { useMemo, useState } from "react";
import {
  advanceKnockoutWinner,
  buildInitialGroupRankings,
  buildRoundOf32Seeds,
  getPredictionCompletion,
} from "@/lib/tournament/predictions";
import type { Team } from "@/lib/tournament/types";
import { GroupRankingPicker } from "./group-ranking-picker";
import { KnockoutBracket } from "./knockout-bracket";
import { PredictionSummary } from "./prediction-summary";

const roundLabels = ["32 强", "16 强", "8 强", "半决赛", "决赛"];
const roundIds = ["r32", "r16", "qf", "sf", "final"];

type BracketRound = {
  id: string;
  label: string;
  matches: Array<[string | undefined, string | undefined]>;
};

export function PredictionWorkspace({ teams }: { teams: Team[] }) {
  const teamsById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const [groupRankings, setGroupRankings] = useState(() => buildInitialGroupRankings(teams));
  const [knockoutWinners, setKnockoutWinners] = useState<Record<string, string>>({});

  const rounds = useMemo(() => {
    const firstRound = buildRoundOf32Seeds(groupRankings);
    const result: BracketRound[] = [{ id: roundIds[0], label: roundLabels[0], matches: firstRound }];
    let previousWinners = firstRound.map((_, index) => knockoutWinners[`r32-${index}`]);

    for (let roundIndex = 1; roundIndex < roundIds.length; roundIndex += 1) {
      const matches: Array<[string | undefined, string | undefined]> = [];
      for (let index = 0; index < previousWinners.length; index += 2) {
        matches.push([previousWinners[index], previousWinners[index + 1]]);
      }
      result.push({ id: roundIds[roundIndex], label: roundLabels[roundIndex], matches });
      previousWinners = matches.map((_, index) => knockoutWinners[`${roundIds[roundIndex]}-${index}`]);
    }

    return result;
  }, [groupRankings, knockoutWinners]);

  const championId = knockoutWinners["final-0"];
  const champion = championId ? teamsById.get(championId) : undefined;
  const finalTeams = rounds.at(-1)?.matches[0] ?? [];
  const finalistId = finalTeams.find((id) => id && id !== championId);
  const semifinalIds =
    rounds
      .find((round) => round.id === "sf")
      ?.matches.flat()
      .filter((id): id is string => Boolean(id)) ?? [];
  const completion = getPredictionCompletion({
    groupRankings,
    knockoutWinners,
    championId,
    updatedAt: new Date().toISOString(),
  });

  function moveTeam(group: string, teamId: string, direction: -1 | 1) {
    setGroupRankings((current) => {
      const nextGroup = [...current[group]];
      const index = nextGroup.indexOf(teamId);
      const target = index + direction;
      if (target < 0 || target >= nextGroup.length) return current;
      [nextGroup[index], nextGroup[target]] = [nextGroup[target], nextGroup[index]];
      setKnockoutWinners({});
      return { ...current, [group]: nextGroup };
    });
  }

  function pickWinner(matchId: string, winnerId: string) {
    setKnockoutWinners((current) => advanceKnockoutWinner(matchId, winnerId, current));
  }

  return (
    <div className="prediction-layout">
      <div className="stack">
        <GroupRankingPicker groupRankings={groupRankings} teamsById={teamsById} onMove={moveTeam} />
        <KnockoutBracket rounds={rounds} teamsById={teamsById} winners={knockoutWinners} onPick={pickWinner} />
      </div>
      <PredictionSummary
        champion={champion}
        finalist={finalistId ? teamsById.get(finalistId) : undefined}
        semiFinalists={semifinalIds.map((id) => teamsById.get(id)).filter((team): team is Team => Boolean(team))}
        completion={completion}
      />
    </div>
  );
}
