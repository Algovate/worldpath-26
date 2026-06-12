import { describe, expect, it } from "vitest";
import { normalizeLiveProviderPayload } from "./live-provider";

describe("normalizeLiveProviderPayload", () => {
  it("normalizes raw provider data into tournament domain data", () => {
    const result = normalizeLiveProviderPayload({
      teams: [
        { id: "a", name: "Alpha", code: "ALP", group: "A" },
        { id: "b", name: "Beta", code: "BET", group: "A" },
      ],
      matches: [
        {
          id: "m1",
          stage: "group",
          group: "A",
          startsAt: "2026-06-12T12:00:00Z",
          venue: "Test",
          homeTeamId: "a",
          awayTeamId: "b",
          homeScore: 1,
          awayScore: 0,
          status: "finished",
        },
      ],
    });

    expect(result.teams[0]).toMatchObject({
      id: "a",
      flag: "□",
      confederation: "UNKNOWN",
    });
    expect(result.matches[0]).toMatchObject({
      date: "2026-06-12T12:00:00Z",
      status: "finished",
    });
    expect(result.standings.A[0]).toMatchObject({
      teamId: "a",
      points: 3,
    });
  });
});
