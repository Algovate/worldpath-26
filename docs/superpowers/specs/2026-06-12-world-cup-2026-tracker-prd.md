# 2026 World Cup Tracker PRD

Date: 2026-06-12
Status: Draft
Language: Chinese-first

## 1. Product Summary

2026 World Cup Tracker is a match results and prediction app for the 2026 FIFA World Cup. It helps fans view schedules, live or recently updated scores, group standings, knockout brackets, and personal predictions in one place.

The first version should be a single-page interactive prototype with mock data. The product design must keep a clean data boundary so the mock score source can later be replaced by a real match data provider.

## 2. Target Users

- General football fans who want to follow match results and standings.
- Fans who want to predict group qualification and knockout winners.
- Content creators who need a quick visual reference for current tournament status.
- Small communities that want to compare predictions during the tournament.

## 3. Goals

- Let users understand the current tournament state within 30 seconds.
- Let users view match schedules, scores, statuses, and group standings.
- Let users complete a full champion prediction flow.
- Keep actual results and user predictions visually distinct.
- Design the data layer so scores can support real-time updates in a later version.
- Work well on desktop and mobile screens.

## 4. Non-Goals For MVP

- User login.
- Cloud persistence.
- Public prediction leaderboards.
- Paid subscriptions.
- Push notifications.
- Real sports data provider integration.
- Full player statistics.
- Betting, odds, or gambling features.

## 5. Scope

### 5.1 MVP Prototype

The MVP uses local mock data and runs without a backend.

Included:

- Overview dashboard.
- Match schedule and score list.
- Group standings for 12 groups.
- Group qualification prediction.
- Knockout bracket prediction.
- Prediction summary.
- Mock "last updated" and simulated score-refresh states.

Excluded:

- Real-time external data.
- Account-based save and sync.
- Real FIFA schedule guarantee.
- Share images or social posting.

### 5.2 Future Real-Time Version

The future real-time version connects to an external match data source through a backend or serverless API.

Included:

- Near real-time score updates.
- Match clock and status updates.
- Automatic standings recalculation.
- Automatic knockout bracket updates after confirmed results.
- Data-source failure handling.
- Last successful sync timestamp.

## 6. Information Architecture

The app should use four primary sections:

1. Overview
   - Tournament progress.
   - Today and upcoming matches.
   - Live or recently updated matches.
   - Quick entry to predictions.

2. Matches
   - Match list grouped by date and stage.
   - Status filters: scheduled, live, finished.
   - Stage filters: group, round of 32, round of 16, quarter-final, semi-final, third-place match, final.

3. Standings
   - 12 group tables.
   - Team records: played, won, drawn, lost, goals for, goals against, goal difference, points.
   - Qualification indicators.
   - Best third-place ranking area for the 32-team knockout format.

4. Predictions
   - Group ranking prediction.
   - Knockout bracket winner selection.
   - Champion prediction.
   - Prediction summary and completion progress.

## 7. Core User Flows

### 7.1 View Current Results

1. User opens the app.
2. Overview shows active, recent, and upcoming matches.
3. User opens Matches for the complete schedule.
4. User filters by stage or status.
5. User opens Standings to see the table impact.

### 7.2 Complete Champion Prediction

1. User opens Predictions.
2. User selects group rankings.
3. App derives qualified teams for the knockout stage.
4. User picks winners in each knockout match.
5. App updates the next round immediately.
6. App displays champion, runner-up, semi-finalists, and prediction completion.

### 7.3 Compare Results And Prediction

1. User views a finished or live match.
2. App shows actual result separately from predicted winner.
3. If actual results affect standings or knockout qualification, the app reflects the actual tournament state.
4. Prediction state remains editable unless the future product introduces locked prediction deadlines.

## 8. Real-Time Score Requirements

Real-time scores are not required for the MVP, but the product must be designed to support them.

### 8.1 MVP Behavior

- Scores come from local mock data.
- The UI may show a simulated "last updated" timestamp.
- The UI may include a manual refresh button that refreshes local state.
- No claim should be made that mock scores are official or live.

### 8.2 Future Real-Time Behavior

- The system should sync match status and scores from an external data source.
- During live matches, the client should refresh automatically without requiring a page reload.
- Recommended polling interval: 15 to 60 seconds during live matches.
- Background tabs should refresh less frequently.
- Standings and qualification state should update after score changes.
- The app should display the last successful update time.
- If the data source fails, the app should show a non-blocking stale-data warning.

### 8.3 Match Status Values

The app should support these statuses:

- Scheduled.
- Live.
- Half-time.
- Finished.
- Extra time.
- Penalty shootout.
- Postponed.
- Cancelled.

## 9. Data Model

### 9.1 Team

```ts
type Team = {
  id: string
  name: string
  code: string
  flag: string
  confederation: string
  fifaRank?: number
  group: string
}
```

### 9.2 Match

```ts
type Match = {
  id: string
  stage:
    | "group"
    | "round32"
    | "round16"
    | "quarter"
    | "semi"
    | "third"
    | "final"
  group?: string
  date: string
  venue: string
  homeTeamId: string
  awayTeamId: string
  homeScore?: number
  awayScore?: number
  status:
    | "scheduled"
    | "live"
    | "halfTime"
    | "finished"
    | "extraTime"
    | "penalties"
    | "postponed"
    | "cancelled"
  minute?: number
  lastUpdatedAt?: string
}
```

### 9.3 Standing

```ts
type Standing = {
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
```

### 9.4 Prediction

```ts
type Prediction = {
  groupRankings: Record<string, string[]>
  knockoutWinners: Record<string, string>
  championId?: string
  updatedAt: string
}
```

## 10. Data Architecture

The app should separate UI logic from score-source logic.

Use a score adapter interface:

```ts
type ScoreAdapter = {
  getTeams(): Promise<Team[]>
  getMatches(): Promise<Match[]>
  getStandings(): Promise<Record<string, Standing[]>>
}
```

MVP implementation:

- `MockScoreAdapter` reads local static data.
- Optional local refresh mutates or rehydrates mock match state.

Future implementation:

- `LiveScoreAdapter` reads from an internal API.
- Backend normalizes external provider data into the app data model.
- Frontend uses the same adapter contract.

## 11. UX Requirements

- The UI should feel like a focused sports data tool, not a marketing site.
- Use compact, scannable panels for matches and standings.
- Use team flags, names, and short codes for quick recognition.
- Keep actual results and predictions visually separate.
- Show clear empty states for unavailable stages or incomplete predictions.
- Avoid dense explanatory text inside the app.
- Avoid betting-style odds presentation.
- Make the prediction flow direct: click or tap a team to advance it.

## 12. Responsive Requirements

Desktop:

- Overview can show dashboard columns.
- Match list and standings can appear side by side where useful.
- Knockout bracket should use a horizontal or hybrid layout.

Mobile:

- Use tabbed or stacked sections.
- Match cards should remain readable without horizontal scrolling.
- Knockout prediction may use round-by-round vertical navigation.
- Primary tap targets should be large enough for touch interaction.

## 13. Error And Empty States

MVP:

- No matches found for filter.
- Prediction incomplete.
- Mock data last updated timestamp unavailable.

Future real-time version:

- Data source unavailable.
- Score update delayed.
- Match data conflict.
- Provider response missing required fields.

Error states should be visible but non-blocking unless the current view cannot render at all.

## 14. Success Metrics

For MVP validation:

- A user can complete one champion prediction without help.
- A user can identify the leader of any group from the standings view.
- A user can find a specific stage's matches within two interactions.
- The app works without network access.
- Desktop and mobile layouts remain readable.

For future product:

- Live match score freshness stays within the configured update window.
- Data-source failures are visible to users.
- Standings update after score changes without manual recalculation.
- Users return to update or compare predictions.

## 15. Key Assumptions

- 2026 World Cup uses 48 teams and 12 groups.
- Group winners, runners-up, and selected third-place teams advance to a 32-team knockout stage.
- MVP data is representative, not official.
- The first implementation language is Chinese.
- The first deliverable is a local web app prototype.

## 16. Open Questions

- Which real sports data provider should be used later?
- Should predictions lock before matches start?
- Should the app support multiple prediction scenarios per user?
- Should prediction sharing be image-based, link-based, or both?
- Should the product target mobile-first usage or desktop-first analysis?

