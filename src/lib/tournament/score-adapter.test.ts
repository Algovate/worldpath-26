import { describe, expect, it, vi } from "vitest";
import { getScoreAdapter, getScoreProviderStatus } from "./score-adapter";

describe("score adapter provider selection", () => {
  it("defaults to worldcup26 provider", () => {
    vi.stubEnv("SCORE_PROVIDER", "");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");

    expect(getScoreAdapter()).toMatchObject({
      provider: "worldcup26",
      isMock: false,
    });
  });

  it("uses mock provider when explicitly configured", () => {
    vi.stubEnv("SCORE_PROVIDER", "mock");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");

    expect(getScoreAdapter()).toMatchObject({
      provider: "mock",
      isMock: true,
    });
  });

  it("reports live provider fallback when api key is missing", () => {
    vi.stubEnv("SCORE_PROVIDER", "live");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");
    vi.stubEnv("SPORTS_DATA_API_URL", "");

    expect(getScoreProviderStatus()).toMatchObject({
      provider: "live",
      mode: "mock",
      hasApiKey: false,
      hasApiUrl: false,
      isMock: true,
    });
  });

  it("reports live ready when api key and api url are configured", () => {
    vi.stubEnv("SCORE_PROVIDER", "live");
    vi.stubEnv("SPORTS_DATA_API_KEY", "test-key");
    vi.stubEnv("SPORTS_DATA_API_URL", "https://provider.example/scores");

    expect(getScoreProviderStatus()).toMatchObject({
      provider: "live",
      mode: "live-ready",
      hasApiKey: true,
      hasApiUrl: true,
      isMock: false,
    });
  });
});
