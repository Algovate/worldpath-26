# WorldPath 26 PRD

Date: 2026-06-12
Status: Current prototype baseline
Language: Chinese-first

## Product Summary

WorldPath 26 is a 2026 FIFA World Cup results and prediction app. It helps fans view schedules, live or recently updated scores, group standings, and personal champion-path predictions in one place.

The current prototype runs on Next.js App Router and uses `worldcup26.ir` as the default public live data source. The app keeps data provider code behind server-side adapters so future commercial providers can be integrated without rewriting the UI.

## Target Users

- Football fans who want a fast match, score, and standings dashboard.
- Fans who want to predict group qualification and knockout winners.
- Content creators who need a compact visual reference for current tournament state.
- Small communities that want to compare prediction paths during the tournament.

## Goals

- Let users understand the current tournament state within 30 seconds.
- Show match schedules, scores, statuses, and group standings.
- Support a complete champion prediction flow from group ranking to final winner.
- Keep actual results and personal predictions visually distinct.
- Make live, mock, and fallback data states explicit.
- Work well on desktop and mobile screens.

## Non-Goals

- User login.
- Cloud persistence.
- Public prediction leaderboards.
- Paid subscriptions.
- Push notifications.
- Full player statistics.
- Betting, odds, or gambling features.

## Core Scope

Included:

- Overview dashboard.
- Match schedule and score list.
- Group standings for 12 groups.
- Group qualification prediction.
- Knockout bracket prediction.
- Prediction summary.
- Prediction vs actual comparison for finished group matches.
- Data source status page.
- Server-side live data provider boundary.

Excluded:

- Account-based save and sync.
- Social sharing flows.
- Admin tools for manual score correction.
- Commercial data provider contract management.

## Data Requirements

The app consumes a normalized `TournamentSnapshot`:

- `teams`: 48 teams with id, name, code, flag, confederation, and group.
- `matches`: 104 matches with stage, date, status, teams, score, minute, venue, and update time.
- `standings`: grouped standings with played, won, drawn, lost, goals, goal difference, and points.
- `provider` metadata: provider name, mock flag, cache age, sync time, and error state.

Supported providers:

- `worldcup26`: default public live data provider.
- `mock`: local fallback data.
- `live`: generic server-side integration for future custom providers.

## Key Routes

- `/`: overview dashboard.
- `/matches`: schedule and score list.
- `/standings`: group standings.
- `/predictions`: prediction workspace.
- `/data`: provider and cache status.

## API Surface

- `GET /api/tournament`
- `GET /api/matches`
- `GET /api/standings`
- `GET /api/status`

All external provider requests must run on the server. Browser code must consume app-owned API routes or server-rendered data only.

## Success Criteria

- The app loads with live data when `SCORE_PROVIDER` is unset or set to `worldcup26`.
- The app clearly reports fallback mode when live provider configuration is incomplete.
- Prediction state persists in `localStorage` and resets safely if team ids change.
- `npm run check` passes.
