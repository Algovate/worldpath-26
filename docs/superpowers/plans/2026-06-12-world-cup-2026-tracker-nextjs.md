# World Cup 2026 Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local Next.js prototype for viewing 2026 World Cup matches, standings, and completing a champion prediction flow.

**Architecture:** Use Next.js App Router with a Chinese-first single product experience split into routes for overview, matches, standings, and predictions. Keep tournament data behind a `ScoreAdapter` interface so MVP mock data can later be replaced by a live score provider without rewriting UI and prediction logic.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, React client components for prediction interactions, local mock data, Vitest or plain TypeScript unit tests for calculation logic.

---

## Scope

This plan implements the MVP prototype described in:

- `docs/superpowers/specs/2026-06-12-world-cup-2026-tracker-prd.md`

Included:

- Next.js project scaffold.
- Local mock teams, matches, standings.
- Score adapter contract.
- Overview, matches, standings, and predictions routes.
- Group qualification prediction.
- Knockout winner selection.
- Mock refresh timestamp and clear non-official data labeling.
- Responsive desktop and mobile layouts.

Excluded:

- Real external sports data API.
- Authentication.
- Database persistence.
- Share images.
- Push notifications.
- Betting or odds features.

## File Structure

Create or modify these files:

- `package.json` - app scripts and dependencies.
- `next.config.ts` - Next.js configuration.
- `tsconfig.json` - TypeScript configuration.
- `postcss.config.mjs` - Tailwind/PostCSS configuration from scaffold.
- `src/app/layout.tsx` - app shell metadata, font setup, global wrapper.
- `src/app/globals.css` - Tailwind theme and base UI styles.
- `src/app/page.tsx` - overview dashboard route.
- `src/app/matches/page.tsx` - match schedule and result route.
- `src/app/standings/page.tsx` - group standings route.
- `src/app/predictions/page.tsx` - prediction center route.
- `src/components/app-shell.tsx` - navigation and responsive shell.
- `src/components/section-header.tsx` - reusable route heading.
- `src/features/matches/match-card.tsx` - match card UI.
- `src/features/matches/match-filters.tsx` - client-side match filters.
- `src/features/standings/standings-table.tsx` - group table UI.
- `src/features/predictions/prediction-workspace.tsx` - client prediction state container.
- `src/features/predictions/group-ranking-picker.tsx` - group ranking selection UI.
- `src/features/predictions/knockout-bracket.tsx` - knockout winner UI.
- `src/features/predictions/prediction-summary.tsx` - champion and completion summary.
- `src/lib/tournament/types.ts` - shared domain types.
- `src/lib/tournament/mock-data.ts` - representative local tournament data.
- `src/lib/tournament/score-adapter.ts` - adapter interface and mock implementation.
- `src/lib/tournament/standings.ts` - standings calculation helpers.
- `src/lib/tournament/predictions.ts` - qualification and bracket helpers.
- `src/lib/tournament/format.ts` - status, date, and score display helpers.
- `src/lib/tournament/standings.test.ts` - standings unit tests.
- `src/lib/tournament/predictions.test.ts` - prediction unit tests.

## Task 1: Scaffold Next.js App

**Files:**

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Scaffold the project**

Run:

```bash
npx create-next-app@latest . --yes --force --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

Expected:

- Next.js files are created in the current directory.
- `npm run dev` and `npm run build` scripts exist.

- [ ] **Step 2: Install test tooling**

Run:

```bash
npm install -D vitest
```

Expected:

- `vitest` is added to `devDependencies`.

- [ ] **Step 3: Add test script**

Modify `package.json`:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Keep existing Next.js scripts.

- [ ] **Step 4: Fix font class placement if needed**

Modify `src/app/layout.tsx` so font variables are applied on `<html>` and body only uses app-level rendering classes.

Expected pattern:

```tsx
<html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
  <body>{children}</body>
</html>
```

- [ ] **Step 5: Run baseline checks**

Run:

```bash
npm run build
npm test
```

Expected:

- Build passes.
- Tests pass or report no tests found before test files are added.

- [ ] **Step 6: Commit**

Run:

```bash
git add -A
git commit -m "chore: scaffold nextjs world cup tracker"
```

Expected:

- Commit succeeds if the project is a git repository.
- If not a git repository, skip commit and continue.

## Task 2: Define Tournament Domain And Mock Data

**Files:**

- Create: `src/lib/tournament/types.ts`
- Create: `src/lib/tournament/mock-data.ts`
- Create: `src/lib/tournament/score-adapter.ts`
- Create: `src/lib/tournament/format.ts`

- [ ] **Step 1: Create domain types**

Create `src/lib/tournament/types.ts`:

```ts
export type Stage =
  | "group"
  | "round32"
  | "round16"
  | "quarter"
  | "semi"
  | "third"
  | "final"

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halfTime"
  | "finished"
  | "extraTime"
  | "penalties"
  | "postponed"
  | "cancelled"

export type Team = {
  id: string
  name: string
  code: string
  flag: string
  confederation: string
  fifaRank?: number
  group: string
}

export type Match = {
  id: string
  stage: Stage
  group?: string
  date: string
  venue: string
  homeTeamId: string
  awayTeamId: string
  homeScore?: number
  awayScore?: number
  status: MatchStatus
  minute?: number
  lastUpdatedAt?: string
}

export type Standing = {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export type Prediction = {
  groupRankings: Record<string, string[]>
  knockoutWinners: Record<string, string>
  championId?: string
  updatedAt: string
}
```

- [ ] **Step 2: Add representative mock teams and matches**

Create `src/lib/tournament/mock-data.ts` with:

- 48 teams across groups `A` through `L`.
- At least 24 representative group matches.
- A mix of `scheduled`, `live`, and `finished` statuses.
- Clear `lastUpdatedAt` fields for live or finished matches.

Expected:

- Data is representative and marked as mock.
- It does not claim to be official FIFA data.

- [ ] **Step 3: Create score adapter**

Create `src/lib/tournament/score-adapter.ts`:

```ts
import { matches, teams } from "./mock-data"
import type { Match, Standing, Team } from "./types"
import { calculateGroupStandings } from "./standings"

export type ScoreAdapter = {
  getTeams(): Promise<Team[]>
  getMatches(): Promise<Match[]>
  getStandings(): Promise<Record<string, Standing[]>>
}

export const mockScoreAdapter: ScoreAdapter = {
  async getTeams() {
    return teams
  },
  async getMatches() {
    return matches
  },
  async getStandings() {
    return calculateGroupStandings(teams, matches)
  },
}
```

- [ ] **Step 4: Create formatting helpers**

Create `src/lib/tournament/format.ts` with:

- `formatMatchStatus(status, minute?)`
- `formatScore(match)`
- `formatStage(stage)`
- `formatDateTime(date)`

- [ ] **Step 5: Run typecheck/build**

Run:

```bash
npm run build
```

Expected:

- Build may fail until `calculateGroupStandings` is implemented in Task 3. If so, confirm the failure is only the missing helper.

## Task 3: Implement Standings Calculation

**Files:**

- Create: `src/lib/tournament/standings.ts`
- Create: `src/lib/tournament/standings.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tournament/standings.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { calculateGroupStandings } from "./standings"
import type { Match, Team } from "./types"

const teams: Team[] = [
  { id: "a", name: "A", code: "AAA", flag: "A", confederation: "X", group: "A" },
  { id: "b", name: "B", code: "BBB", flag: "B", confederation: "X", group: "A" },
]

it("calculates points and goal difference from finished matches", () => {
  const matches: Match[] = [
    {
      id: "m1",
      stage: "group",
      group: "A",
      date: "2026-06-12T12:00:00Z",
      venue: "Test",
      homeTeamId: "a",
      awayTeamId: "b",
      homeScore: 2,
      awayScore: 0,
      status: "finished",
    },
  ]

  const result = calculateGroupStandings(teams, matches)

  expect(result.A[0]).toMatchObject({
    teamId: "a",
    played: 1,
    won: 1,
    points: 3,
    goalDifference: 2,
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- src/lib/tournament/standings.test.ts
```

Expected:

- Fails because `calculateGroupStandings` is missing.

- [ ] **Step 3: Implement standings calculation**

Create `src/lib/tournament/standings.ts`:

```ts
import type { Match, Standing, Team } from "./types"

export function calculateGroupStandings(
  teams: Team[],
  matches: Match[],
): Record<string, Standing[]> {
  const byGroup: Record<string, Standing[]> = {}
  const byTeam = new Map<string, Standing>()

  for (const team of teams) {
    const standing: Standing = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }
    byTeam.set(team.id, standing)
    byGroup[team.group] ??= []
    byGroup[team.group].push(standing)
  }

  for (const match of matches) {
    if (match.stage !== "group" || match.status !== "finished") continue
    if (match.homeScore == null || match.awayScore == null) continue

    const home = byTeam.get(match.homeTeamId)
    const away = byTeam.get(match.awayTeamId)
    if (!home || !away) continue

    applyResult(home, match.homeScore, match.awayScore)
    applyResult(away, match.awayScore, match.homeScore)
  }

  for (const standings of Object.values(byGroup)) {
    standings.sort((a, b) => {
      return (
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.teamId.localeCompare(b.teamId)
      )
    })
  }

  return byGroup
}

function applyResult(standing: Standing, goalsFor: number, goalsAgainst: number) {
  standing.played += 1
  standing.goalsFor += goalsFor
  standing.goalsAgainst += goalsAgainst
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst

  if (goalsFor > goalsAgainst) {
    standing.won += 1
    standing.points += 3
  } else if (goalsFor < goalsAgainst) {
    standing.lost += 1
  } else {
    standing.drawn += 1
    standing.points += 1
  }
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected:

- Standings tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/tournament
git commit -m "feat: add tournament data model and standings"
```

Expected:

- Commit succeeds if git is initialized.

## Task 4: Implement Prediction Helpers

**Files:**

- Create: `src/lib/tournament/predictions.ts`
- Create: `src/lib/tournament/predictions.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/tournament/predictions.test.ts`:

```ts
import { expect, it } from "vitest"
import { buildInitialGroupRankings, getPredictionCompletion } from "./predictions"
import type { Team } from "./types"

const teams: Team[] = [
  { id: "a1", name: "A1", code: "A1", flag: "A", confederation: "X", group: "A" },
  { id: "a2", name: "A2", code: "A2", flag: "A", confederation: "X", group: "A" },
  { id: "b1", name: "B1", code: "B1", flag: "B", confederation: "X", group: "B" },
]

it("builds initial group rankings by group", () => {
  expect(buildInitialGroupRankings(teams)).toEqual({
    A: ["a1", "a2"],
    B: ["b1"],
  })
})

it("calculates prediction completion", () => {
  expect(
    getPredictionCompletion({
      groupRankings: { A: ["a1", "a2"] },
      knockoutWinners: { k1: "a1" },
      championId: "a1",
      updatedAt: "2026-06-12T00:00:00Z",
    }),
  ).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- src/lib/tournament/predictions.test.ts
```

Expected:

- Fails because helpers are missing.

- [ ] **Step 3: Implement prediction helpers**

Create `src/lib/tournament/predictions.ts` with:

- `buildInitialGroupRankings(teams)`
- `getQualifiedTeamIds(groupRankings)`
- `buildRoundOf32Seeds(groupRankings)`
- `advanceKnockoutWinner(matchId, winnerId, winners)`
- `getPredictionCompletion(prediction)`

Keep MVP bracket logic deterministic and simple:

- Top 2 from all groups qualify.
- Best 8 third-place teams qualify using group order for MVP.
- Generate temporary round-of-32 pairings from the 32 qualified team IDs.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected:

- Prediction and standings tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/tournament/predictions.ts src/lib/tournament/predictions.test.ts
git commit -m "feat: add prediction helpers"
```

Expected:

- Commit succeeds if git is initialized.

## Task 5: Build Shared App Shell And Styling

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/section-header.tsx`

- [ ] **Step 1: Add global visual direction**

Modify `src/app/globals.css`:

- Use a dark neutral base.
- Use restrained accent colors for live, finished, and qualification states.
- Avoid a one-hue palette.
- Set stable sizing for tabs, cards, match rows, and bracket controls.

- [ ] **Step 2: Create app shell**

Create `src/components/app-shell.tsx`:

- Top-level app title.
- Primary navigation: `总览`, `赛程`, `积分`, `预测`.
- Mock data badge: `模拟数据`.
- Responsive navigation that wraps or stacks cleanly on mobile.

- [ ] **Step 3: Create section header**

Create `src/components/section-header.tsx`:

- Title.
- Optional subtitle.
- Optional right-side content slot.

- [ ] **Step 4: Wire shell into layout**

Modify `src/app/layout.tsx` to wrap `children` in `AppShell`.

- [ ] **Step 5: Build and inspect**

Run:

```bash
npm run build
```

Expected:

- Build passes.

## Task 6: Build Overview Route

**Files:**

- Modify: `src/app/page.tsx`
- Create or reuse: `src/features/matches/match-card.tsx`

- [ ] **Step 1: Create match card component**

Create `src/features/matches/match-card.tsx`:

- Show status, date/time, venue.
- Show home and away team names, flags, and short codes.
- Show score when available.
- Show minute for live matches.

- [ ] **Step 2: Build overview content**

Modify `src/app/page.tsx`:

- Load teams, matches, and standings from `mockScoreAdapter`.
- Show tournament progress metrics.
- Show live/recent matches.
- Show upcoming matches.
- Show quickest prediction entry link.
- Show last mock update timestamp.

- [ ] **Step 3: Build check**

Run:

```bash
npm run build
```

Expected:

- Overview route builds successfully.

## Task 7: Build Matches Route

**Files:**

- Create: `src/app/matches/page.tsx`
- Create: `src/features/matches/match-filters.tsx`
- Reuse: `src/features/matches/match-card.tsx`

- [ ] **Step 1: Create client filters**

Create `src/features/matches/match-filters.tsx`:

- Client component.
- Filter by stage.
- Filter by status.
- Render filtered `MatchCard` list.

- [ ] **Step 2: Create route**

Create `src/app/matches/page.tsx`:

- Load matches and teams from adapter.
- Render `MatchFilters`.

- [ ] **Step 3: Verify empty state**

Manually confirm a filter combination with no results shows a useful empty state.

- [ ] **Step 4: Build check**

Run:

```bash
npm run build
```

Expected:

- Route builds successfully.

## Task 8: Build Standings Route

**Files:**

- Create: `src/app/standings/page.tsx`
- Create: `src/features/standings/standings-table.tsx`

- [ ] **Step 1: Create standings table**

Create `src/features/standings/standings-table.tsx`:

- Show team rank, flag, name, played, won, drawn, lost, goals for, goals against, goal difference, points.
- Mark top two as direct qualification.
- Mark third place as possible qualification.

- [ ] **Step 2: Create route**

Create `src/app/standings/page.tsx`:

- Load teams and standings from adapter.
- Render all 12 group tables.
- Render best third-place note for MVP.

- [ ] **Step 3: Build check**

Run:

```bash
npm run build
```

Expected:

- Route builds successfully.

## Task 9: Build Prediction Center

**Files:**

- Create: `src/app/predictions/page.tsx`
- Create: `src/features/predictions/prediction-workspace.tsx`
- Create: `src/features/predictions/group-ranking-picker.tsx`
- Create: `src/features/predictions/knockout-bracket.tsx`
- Create: `src/features/predictions/prediction-summary.tsx`

- [ ] **Step 1: Create prediction page**

Create `src/app/predictions/page.tsx`:

- Load teams from adapter.
- Pass teams into `PredictionWorkspace`.

- [ ] **Step 2: Create prediction workspace**

Create `src/features/predictions/prediction-workspace.tsx`:

- Client component.
- Store prediction state with `useState`.
- Initialize group rankings from teams.
- Update champion when bracket is complete.

- [ ] **Step 3: Create group ranking picker**

Create `src/features/predictions/group-ranking-picker.tsx`:

- Display each group.
- Provide up/down controls or select controls to reorder teams.
- Keep controls touch-friendly.

- [ ] **Step 4: Create knockout bracket**

Create `src/features/predictions/knockout-bracket.tsx`:

- Use qualified teams from group rankings.
- Let users choose winners round by round.
- Update later rounds after each choice.
- Keep mobile layout vertical.

- [ ] **Step 5: Create prediction summary**

Create `src/features/predictions/prediction-summary.tsx`:

- Show champion.
- Show finalist and semi-finalists where available.
- Show completion percent.
- Show "预测未完成" empty state.

- [ ] **Step 6: Build check**

Run:

```bash
npm run build
```

Expected:

- Prediction route builds successfully.

## Task 10: Add Mock Refresh State

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/features/matches/match-filters.tsx`
- Optionally create: `src/components/mock-refresh-indicator.tsx`

- [ ] **Step 1: Add refresh indicator**

Show:

- `模拟数据`
- Last updated timestamp.
- A manual refresh button that updates client-side timestamp only.

- [ ] **Step 2: Clarify non-official state**

Add short UI copy near the data badge:

```text
当前为产品原型数据，不代表官方赛程或实时比分。
```

- [ ] **Step 3: Build check**

Run:

```bash
npm run build
```

Expected:

- Build passes.

## Task 11: Responsive And Accessibility Pass

**Files:**

- Modify: affected route and component files.
- Modify: `src/app/globals.css`.

- [ ] **Step 1: Check mobile layout**

Run:

```bash
npm run dev
```

Open the local dev URL and inspect:

- 390px mobile width.
- 768px tablet width.
- 1440px desktop width.

Expected:

- Navigation does not overlap.
- Match cards do not overflow.
- Standings tables remain readable.
- Prediction controls are usable on touch widths.

- [ ] **Step 2: Check keyboard basics**

Verify:

- Links are keyboard reachable.
- Prediction controls are buttons or selects.
- Focus states are visible.

- [ ] **Step 3: Fix layout issues**

Apply small CSS and component fixes as needed.

- [ ] **Step 4: Build check**

Run:

```bash
npm run build
```

Expected:

- Build passes.

## Task 12: Final Verification

**Files:**

- Modify only if verification finds issues.

- [ ] **Step 1: Run all checks**

Run:

```bash
npm test
npm run build
```

Expected:

- Tests pass.
- Production build passes.

- [ ] **Step 2: Run local app**

Run:

```bash
npm run dev
```

Expected:

- App starts on a local URL.
- User can visit overview, matches, standings, and predictions.

- [ ] **Step 3: Smoke test product flows**

Verify:

- User can see live/recent/upcoming matches.
- User can filter matches.
- User can read group standings.
- User can reorder group predictions.
- User can select knockout winners.
- User can reach a champion prediction.

- [ ] **Step 4: Update docs if implementation deviates**

If the shipped behavior differs from the PRD, update:

- `docs/superpowers/specs/2026-06-12-world-cup-2026-tracker-prd.md`
- This plan file.

- [ ] **Step 5: Final commit**

Run:

```bash
git add -A
git commit -m "feat: build world cup tracker prototype"
```

Expected:

- Commit succeeds if git is initialized.

## Implementation Notes

- Prefer Server Components for read-only route loading.
- Use Client Components only where interaction is required: filters, refresh timestamp, prediction state.
- Do not initialize future external service clients at module scope.
- Keep mock data obviously labeled as mock data.
- Do not introduce a backend until real score integration is selected.
- Keep visual design focused on match data and prediction workflows, not a landing page.
