import { describe, expect, it } from "vitest";
import { normalizeWorldCup26Payload } from "./worldcup26-provider";

describe("normalizeWorldCup26Payload", () => {
  it("normalizes worldcup26 teams, games, and groups", () => {
    const result = normalizeWorldCup26Payload({
      teams: [
        {
          id: "1",
          name_en: "Mexico",
          fifa_code: "MEX",
          iso2: "MX",
          groups: "A",
        },
        {
          id: "2",
          name_en: "South Africa",
          fifa_code: "RSA",
          iso2: "ZA",
          groups: "A",
        },
      ],
      games: [
        {
          id: "1",
          home_team_id: "1",
          away_team_id: "2",
          home_score: "2",
          away_score: "0",
          group: "A",
          local_date: "06/11/2026 13:00",
          stadium_id: "1",
          finished: "TRUE",
          time_elapsed: "finished",
          type: "group",
        },
      ],
      groups: [
        {
          name: "A",
          teams: [
            {
              team_id: "1",
              mp: "1",
              w: "1",
              l: "0",
              d: "0",
              pts: "3",
              gf: "2",
              ga: "0",
              gd: "2",
            },
          ],
        },
      ],
    });

    expect(result.teams[0]).toMatchObject({
      id: "1",
      name: "Mexico",
      code: "MEX",
      flag: "🇲🇽",
      group: "A",
    });
    expect(result.matches[0]).toMatchObject({
      id: "wc26-1",
      stage: "group",
      status: "finished",
      homeScore: 2,
      awayScore: 0,
    });
    expect(result.standings.A[0]).toMatchObject({
      teamId: "1",
      played: 1,
      points: 3,
    });
  });
});
