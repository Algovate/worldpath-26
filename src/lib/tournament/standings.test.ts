import { describe, expect, it } from "vitest";
import { calculateGroupStandings } from "./standings";
import type { Match, Team } from "./types";

describe("calculateGroupStandings", () => {
  const teams: Team[] = [
    { id: "a", name: "A", code: "AAA", flag: "A", confederation: "X", group: "A" },
    { id: "b", name: "B", code: "BBB", flag: "B", confederation: "X", group: "A" },
  ];

  it("calculates points and goal difference from finished matches", () => {
    const matches: Match[] = [
      {
        id: "m1",
        stage: "group",
        group: "A",
        date: "2026-06-12T12:00:00Z",
        venue: "Test",
        homeTeamId: "a",
        awayTeamId: "b",
        homeScore: 2,
        awayScore: 0,
        status: "finished",
      },
    ];

    const result = calculateGroupStandings(teams, matches);

    expect(result.A[0]).toMatchObject({
      teamId: "a",
      played: 1,
      won: 1,
      points: 3,
      goalDifference: 2,
    });
  });
});
