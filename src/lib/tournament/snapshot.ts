import { getScoreAdapter } from "./score-adapter";
import type { Match, Standing, Team } from "./types";

export const snapshotCacheTtlMs = 15_000;

export type TournamentSnapshot = {
  teams: Team[];
  matches: Match[];
  standings: Record<string, Standing[]>;
  lastUpdatedAt: string;
  lastSuccessfulSyncAt: string;
  lastError?: string;
  cacheAgeSeconds: number;
  cacheTtlSeconds: number;
  isMock: boolean;
  provider: string;
  notice: string;
};

let cachedSnapshot:
  | {
      snapshot: TournamentSnapshot;
      cachedAt: number;
    }
  | undefined;
let lastSuccessfulSyncAt: string | undefined;
let lastError: string | undefined;

export async function getTournamentSnapshot(): Promise<TournamentSnapshot> {
  const now = Date.now();

  if (cachedSnapshot && now - cachedSnapshot.cachedAt < snapshotCacheTtlMs) {
    return withCacheMetadata(cachedSnapshot.snapshot, now);
  }

  try {
    const snapshot = await createTournamentSnapshot();
    cachedSnapshot = {
      snapshot,
      cachedAt: now,
    };
    lastSuccessfulSyncAt = snapshot.lastSuccessfulSyncAt;
    lastError = undefined;
    return withCacheMetadata(snapshot, now);
  } catch (error) {
    lastError = error instanceof Error ? error.message : "Unknown data source error";
    if (cachedSnapshot) {
      return withCacheMetadata(
        { ...cachedSnapshot.snapshot, lastError },
        now,
      );
    }
    throw error;
  }
}

export function getTournamentDataSourceStatus() {
  const now = Date.now();
  const cacheAgeSeconds = cachedSnapshot
    ? Math.max(0, Math.round((now - cachedSnapshot.cachedAt) / 1000))
    : null;

  return {
    lastSuccessfulSyncAt,
    lastError,
    cacheAgeSeconds,
    cacheTtlSeconds: snapshotCacheTtlMs / 1000,
    hasCachedSnapshot: Boolean(cachedSnapshot),
  };
}

export function resetTournamentSnapshotCacheForTest() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("resetTournamentSnapshotCacheForTest can only run in tests");
  }

  cachedSnapshot = undefined;
  lastSuccessfulSyncAt = undefined;
  lastError = undefined;
}

async function createTournamentSnapshot(): Promise<TournamentSnapshot> {
  const adapter = getScoreAdapter();
  const [teams, matches, standings] = await Promise.all([
    adapter.getTeams(),
    adapter.getMatches(),
    adapter.getStandings(),
  ]);
  const syncedAt = new Date().toISOString();

  return {
    teams,
    matches,
    standings,
    lastUpdatedAt: syncedAt,
    lastSuccessfulSyncAt: syncedAt,
    lastError: undefined,
    cacheAgeSeconds: 0,
    cacheTtlSeconds: snapshotCacheTtlMs / 1000,
    isMock: adapter.isMock,
    provider: adapter.provider,
    notice: adapter.notice,
  };
}

function withCacheMetadata(snapshot: TournamentSnapshot, now: number) {
  const cacheAgeSeconds = cachedSnapshot
    ? Math.max(0, Math.round((now - cachedSnapshot.cachedAt) / 1000))
    : 0;

  return {
    ...snapshot,
    lastSuccessfulSyncAt: lastSuccessfulSyncAt ?? snapshot.lastSuccessfulSyncAt,
    lastError,
    cacheAgeSeconds,
    cacheTtlSeconds: snapshotCacheTtlMs / 1000,
  };
}
