import { matches, teams } from "./mock-data";
import {
  normalizeLiveProviderPayload,
  type LiveProviderRawPayload,
} from "./live-provider";
import { calculateGroupStandings } from "./standings";
import type { Match, Standing, Team } from "./types";

export type ScoreProvider = "mock" | "live";

export type ScoreAdapter = {
  provider: ScoreProvider;
  isMock: boolean;
  notice: string;
  getTeams(): Promise<Team[]>;
  getMatches(): Promise<Match[]>;
  getStandings(): Promise<Record<string, Standing[]>>;
};

export const mockScoreAdapter: ScoreAdapter = {
  provider: "mock",
  isMock: true,
  notice: "当前为产品原型数据，不代表官方赛程或实时比分。",
  async getTeams() {
    return teams;
  },
  async getMatches() {
    return matches;
  },
  async getStandings() {
    return calculateGroupStandings(teams, matches);
  },
};

export function getScoreAdapter(): ScoreAdapter {
  const provider = normalizeProvider(process.env.SCORE_PROVIDER);

  if (provider === "live") {
    return createLiveScoreAdapter();
  }

  return mockScoreAdapter;
}

export function getScoreProviderStatus() {
  const provider = normalizeProvider(process.env.SCORE_PROVIDER);
  const hasApiKey = Boolean(process.env.SPORTS_DATA_API_KEY);
  const hasApiUrl = Boolean(process.env.SPORTS_DATA_API_URL);
  const isLiveReady = provider === "live" && hasApiKey && hasApiUrl;

  return {
    provider,
    mode: isLiveReady ? "live-ready" : "mock",
    hasApiKey,
    hasApiUrl,
    isMock: !isLiveReady,
    notice:
      provider === "live" && (!hasApiKey || !hasApiUrl)
        ? "SCORE_PROVIDER=live 已设置，但 SPORTS_DATA_API_KEY 或 SPORTS_DATA_API_URL 缺失，当前回退到 mock 数据。"
        : isLiveReady
          ? "实时比分供应商配置已就绪，服务端将从 SPORTS_DATA_API_URL 拉取数据。"
          : mockScoreAdapter.notice,
  };
}

function normalizeProvider(value: string | undefined): ScoreProvider {
  return value === "live" ? "live" : "mock";
}

function createLiveScoreAdapter(): ScoreAdapter {
  const status = getScoreProviderStatus();
  let liveDataPromise: Promise<{
    teams: Team[];
    matches: Match[];
    standings: Record<string, Standing[]>;
  }> | undefined;

  return {
    provider: "live",
    isMock: status.isMock,
    notice: status.notice,
    async getTeams() {
      if (status.isMock) return mockScoreAdapter.getTeams();
      return (await getLiveData()).teams;
    },
    async getMatches() {
      if (status.isMock) return mockScoreAdapter.getMatches();
      return (await getLiveData()).matches;
    },
    async getStandings() {
      if (status.isMock) return mockScoreAdapter.getStandings();
      return (await getLiveData()).standings;
    },
  };

  function getLiveData() {
    liveDataPromise ??= fetchLiveProviderData();
    return liveDataPromise;
  }
}

async function fetchLiveProviderData() {
  const url = process.env.SPORTS_DATA_API_URL;
  const apiKey = process.env.SPORTS_DATA_API_KEY;

  if (!url || !apiKey) {
    return {
      teams: await mockScoreAdapter.getTeams(),
      matches: await mockScoreAdapter.getMatches(),
      standings: await mockScoreAdapter.getStandings(),
    };
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Live score provider failed with ${response.status}`);
  }

  return normalizeLiveProviderPayload(
    (await response.json()) as LiveProviderRawPayload,
  );
}
