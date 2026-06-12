import { describe, expect, it, vi } from "vitest";
import { getScoreAdapter, getScoreProviderStatus } from "./score-adapter";

describe("score adapter provider selection", () => {
  it("defaults to mock provider", () => {
    vi.stubEnv("SCORE_PROVIDER", "");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");

    expect(getScoreAdapter()).toMatchObject({
      provider: "mock",
      isMock: true,
    });
  });

  it("reports live provider fallback when api key is missing", () => {
    vi.stubEnv("SCORE_PROVIDER", "live");
    vi.stubEnv("SPORTS_DATA_API_KEY", "");

    expect(getScoreProviderStatus()).toMatchObject({
      provider: "live",
      mode: "mock",
      hasApiKey: false,
      isMock: true,
    });
  });
});
