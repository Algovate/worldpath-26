import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PredictionComparison } from "./prediction-comparison";
import type { Match, Team } from "@/lib/tournament/types";

describe("PredictionComparison", () => {
  it("renders actual result comparison accuracy", () => {
    const teams: Team[] = [
      { id: "a", name: "Alpha", code: "ALP", flag: "A", confederation: "X", group: "A" },
      { id: "b", name: "Beta", code: "BET", flag: "B", confederation: "X", group: "A" },
    ];
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
    const html = renderToStaticMarkup(
      <PredictionComparison
        groupRankings={{ A: ["a", "b"] }}
        matches={matches}
        teamsById={new Map(teams.map((team) => [team.id, team]))}
      />,
    );

    expect(html).toContain("100%");
    expect(html).toContain("命中");
  });
});
