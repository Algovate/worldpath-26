import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getTournamentDataSourceStatus,
  getTournamentSnapshot,
  resetTournamentSnapshotCacheForTest,
} from "./snapshot";

describe("tournament snapshot cache", () => {
  beforeEach(() => {
    resetTournamentSnapshotCacheForTest();
    vi.useRealTimers();
    vi.stubEnv("SCORE_PROVIDER", "mock");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");
  });

  it("returns cache metadata after creating a snapshot", async () => {
    const snapshot = await getTournamentSnapshot();
    const status = getTournamentDataSourceStatus();

    expect(snapshot.teams).toHaveLength(48);
    expect(snapshot.cacheTtlSeconds).toBe(15);
    expect(status).toMatchObject({
      cacheAgeSeconds: 0,
      cacheTtlSeconds: 15,
      hasCachedSnapshot: true,
    });
    expect(status.lastSuccessfulSyncAt).toBeTruthy();
  });
});
