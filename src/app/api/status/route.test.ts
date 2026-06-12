import { describe, expect, it, vi } from "vitest";
import { getScoreProviderStatus } from "../../../lib/tournament/score-adapter";
import {
  getTournamentDataSourceStatus,
  getTournamentSnapshot,
  resetTournamentSnapshotCacheForTest,
} from "../../../lib/tournament/snapshot";

describe("GET /api/status", () => {
  it("returns score provider and data source status", async () => {
    resetTournamentSnapshotCacheForTest();
    vi.stubEnv("SCORE_PROVIDER", "mock");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");

    await getTournamentSnapshot();
    const payload = {
      ok: true,
      checkedAt: new Date().toISOString(),
      scoreProvider: getScoreProviderStatus(),
      dataSource: getTournamentDataSourceStatus(),
    };

    expect(payload).toMatchObject({
      ok: true,
      scoreProvider: {
        provider: "mock",
        mode: "mock",
        isMock: true,
      },
      dataSource: {
        cacheTtlSeconds: 15,
        hasCachedSnapshot: true,
      },
    });
    expect(payload.checkedAt).toBeTruthy();
  });
});
