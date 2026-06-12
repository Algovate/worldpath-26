import { matches, teams } from "./mock-data";
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

  return {
    provider,
    mode: provider === "live" && hasApiKey ? "live-ready" : "mock",
    hasApiKey,
    isMock: provider !== "live" || !hasApiKey,
    notice:
      provider === "live" && !hasApiKey
        ? "SCORE_PROVIDER=live 已设置，但 SPORTS_DATA_API_KEY 缺失，当前回退到 mock 数据。"
        : provider === "live"
          ? "实时比分供应商配置已就绪；当前 live adapter 仍使用 mock 数据骨架。"
          : mockScoreAdapter.notice,
  };
}

function normalizeProvider(value: string | undefined): ScoreProvider {
  return value === "live" ? "live" : "mock";
}

function createLiveScoreAdapter(): ScoreAdapter {
  const status = getScoreProviderStatus();

  return {
    provider: "live",
    isMock: status.isMock,
    notice: status.notice,
    async getTeams() {
      return mockScoreAdapter.getTeams();
    },
    async getMatches() {
      return mockScoreAdapter.getMatches();
    },
    async getStandings() {
      return mockScoreAdapter.getStandings();
    },
  };
}
