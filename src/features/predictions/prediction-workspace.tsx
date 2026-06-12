"use client";

import { useEffect, useMemo, useState } from "react";
import {
  advanceKnockoutWinner,
  buildInitialGroupRankings,
  buildRoundOf32Seeds,
  getPredictionCompletion,
} from "@/lib/tournament/predictions";
import type { Match, Team } from "@/lib/tournament/types";
import { GroupRankingPicker } from "./group-ranking-picker";
import { KnockoutBracket } from "./knockout-bracket";
import { PredictionComparison } from "./prediction-comparison";
import { PredictionSummary } from "./prediction-summary";

const roundLabels = ["32 强", "16 强", "8 强", "半决赛", "决赛"];
const roundIds = ["r32", "r16", "qf", "sf", "final"];
const storageKey = "worldcup-2026-prediction";

type BracketRound = {
  id: string;
  label: string;
  matches: Array<[string | undefined, string | undefined]>;
};

export function PredictionWorkspace({
  teams,
  matches,
}: {
  teams: Team[];
  matches: Match[];
}) {
  const teamsById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const initialGroupRankings = useMemo(() => buildInitialGroupRankings(teams), [teams]);
  const [groupRankings, setGroupRankings] = useState(initialGroupRankings);
  const [knockoutWinners, setKnockoutWinners] = useState<Record<string, string>>({});
  const [hasLoadedStoredPrediction, setHasLoadedStoredPrediction] = useState(false);
  const [savedAt, setSavedAt] = useState<string>();

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
          setHasLoadedStoredPrediction(true);
          return;
        }
        const saved = JSON.parse(raw) as {
          groupRankings?: Record<string, string[]>;
          knockoutWinners?: Record<string, string>;
          updatedAt?: string;
        };
        if (saved.groupRankings) setGroupRankings(saved.groupRankings);
        if (saved.knockoutWinners) setKnockoutWinners(saved.knockoutWinners);
        setSavedAt(saved.updatedAt);
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setHasLoadedStoredPrediction(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredPrediction) return;
    const updatedAt = new Date().toISOString();
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ groupRankings, knockoutWinners, championId, updatedAt }),
    );
  }, [championId, groupRankings, hasLoadedStoredPrediction, knockoutWinners]);

  function moveTeam(group: string, teamId: string, direction: -1 | 1) {
    setGroupRankings((current) => {
      const nextGroup = [...current[group]];
      const index = nextGroup.indexOf(teamId);
      const target = index + direction;
      if (target < 0 || target >= nextGroup.length) return current;
      [nextGroup[index], nextGroup[target]] = [nextGroup[target], nextGroup[index]];
      setKnockoutWinners({});
      setSavedAt(new Date().toISOString());
      return { ...current, [group]: nextGroup };
    });
  }

  function pickWinner(matchId: string, winnerId: string) {
    setKnockoutWinners((current) => advanceKnockoutWinner(matchId, winnerId, current));
    setSavedAt(new Date().toISOString());
  }

  function autoPickFavorites() {
    const nextWinners: Record<string, string> = {};
    let pairings = buildRoundOf32Seeds(groupRankings);

    for (const roundId of roundIds) {
      const roundWinners = pairings.map(([homeId, awayId], index) => {
        const winnerId = pickStrongerTeam(homeId, awayId, teamsById);
        nextWinners[`${roundId}-${index}`] = winnerId;
        return winnerId;
      });

      pairings = [];
      for (let index = 0; index < roundWinners.length; index += 2) {
        pairings.push([roundWinners[index], roundWinners[index + 1]]);
      }
    }

    setKnockoutWinners(nextWinners);
    setSavedAt(new Date().toISOString());
  }

  function resetPrediction() {
    setGroupRankings(initialGroupRankings);
    setKnockoutWinners({});
    window.localStorage.removeItem(storageKey);
    setSavedAt(new Date().toISOString());
  }

  return (
    <div className="prediction-layout">
      <div className="stack">
        <div className="refresh-row">
          <span>
            {savedAt
              ? `预测已保存：${new Intl.DateTimeFormat("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(new Date(savedAt))}`
              : "预测会自动保存在当前浏览器。"}
          </span>
          <button className="secondary-button" type="button" onClick={resetPrediction}>
            重置预测
          </button>
          <button className="secondary-button" type="button" onClick={autoPickFavorites}>
            热门路径
          </button>
        </div>
        <GroupRankingPicker groupRankings={groupRankings} teamsById={teamsById} onMove={moveTeam} />
        <PredictionComparison
          groupRankings={groupRankings}
          matches={matches}
          teamsById={teamsById}
        />
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

function pickStrongerTeam(
  homeId: string | undefined,
  awayId: string | undefined,
  teamsById: Map<string, Team>,
) {
  if (!homeId && !awayId) return "";
  if (!homeId) return awayId ?? "";
  if (!awayId) return homeId;

  const homeRank = teamsById.get(homeId)?.fifaRank ?? 999;
  const awayRank = teamsById.get(awayId)?.fifaRank ?? 999;

  return homeRank <= awayRank ? homeId : awayId;
}
