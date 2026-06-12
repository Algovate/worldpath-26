import { expect, it } from "vitest";
import {
  buildInitialGroupRankings,
  buildRoundOf32Seeds,
  getPredictionCompletion,
} from "./predictions";
import type { Team } from "./types";

const teams: Team[] = [
  { id: "a1", name: "A1", code: "A1", flag: "A", confederation: "X", fifaRank: 2, group: "A" },
  { id: "a2", name: "A2", code: "A2", flag: "A", confederation: "X", fifaRank: 1, group: "A" },
  { id: "b1", name: "B1", code: "B1", flag: "B", confederation: "X", group: "B" },
];

it("builds initial group rankings by group and rank", () => {
  expect(buildInitialGroupRankings(teams)).toEqual({
    A: ["a2", "a1"],
    B: ["b1"],
  });
});

it("calculates prediction completion", () => {
  expect(
    getPredictionCompletion({
      groupRankings: { A: ["a1", "a2"] },
      knockoutWinners: { k1: "a1" },
      championId: "a1",
      updatedAt: "2026-06-12T00:00:00Z",
    }),
  ).toBeGreaterThan(0);
});

it("builds knockout pairings from qualified teams", () => {
  const rankings = {
    A: ["a1", "a2", "a3"],
    B: ["b1", "b2", "b3"],
    C: ["c1", "c2", "c3"],
    D: ["d1", "d2", "d3"],
    E: ["e1", "e2", "e3"],
    F: ["f1", "f2", "f3"],
    G: ["g1", "g2", "g3"],
    H: ["h1", "h2", "h3"],
    I: ["i1", "i2", "i3"],
    J: ["j1", "j2", "j3"],
    K: ["k1", "k2", "k3"],
    L: ["l1", "l2", "l3"],
  };

  expect(buildRoundOf32Seeds(rankings)).toHaveLength(16);
});
