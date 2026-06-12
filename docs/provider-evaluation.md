# Live Score Provider Evaluation

Date: 2026-06-12

## Recommendation

Use `worldcup26.ir` as the default live data provider for the current prototype. It exposes 2026 World Cup teams, games, groups, standings, and live scores without an API key, which makes it the fastest path for a public demo.

Keep the generic `SPORTS_DATA_API_URL` integration as the paid-provider escape hatch. For a production commercial launch, evaluate Sportmonks and API-FOOTBALL first because both publish World Cup-oriented material and have football-specific live score/standings coverage.

## Candidates

### worldcup26.ir

- Current default provider in the app via `SCORE_PROVIDER=worldcup26`.
- Public API endpoints used by the app:
  - `https://worldcup26.ir/get/teams`
  - `https://worldcup26.ir/get/games`
  - `https://worldcup26.ir/get/groups`
- No API key is required for read access.
- Good fit for the current demo because it already returns 48 teams, 104 matches, groups, standings, and score fields.
- Main risk: it is not a contracted commercial data provider, so uptime, latency, schema stability, and display rights still need validation before a production launch.

### Sportmonks

- Has a World Cup API page describing schedules, live scores, standings, squads, and tournament data for World Cup 2026.
- Developer documentation is available for Football API v3.
- Good fit when the product needs dedicated World Cup coverage and commercial support.

### API-FOOTBALL / API-SPORTS

- Football-specific API with endpoints for fixtures, standings, teams, events, lineups, statistics, and livescore.
- Their World Cup 2026 guide documents a standings request using `league=1&season=2026`.
- Good fit for fast integration if the API response shape and rate limits fit the product.

### Sportradar

- Strong enterprise/B2B option with broad soccer coverage and tiered competition coverage.
- Documentation notes that APIs are B2B services and should not be called directly from client applications.
- Good fit for commercial production with enterprise requirements.

### football-data.org

- General football API with v4 documentation, match resources, competition resources, live scores, fixtures, tables, squads, lineups, and substitutions.
- Good fit for simpler or lower-cost football data use cases, pending World Cup 2026 coverage confirmation for required fields.

## Integration Contract

The application should keep consuming `TournamentSnapshot`. Provider-specific code should live behind:

- `src/lib/tournament/score-adapter.ts`
- `src/lib/tournament/live-provider.ts`

External provider responses should be normalized to:

- `Team`
- `Match`
- `Standing`

The browser must never call the provider directly. All provider requests should go through server-side Route Handlers or server utilities.

## Decision Still Needed

- Confirm pricing and rate limits.
- Confirm live update latency during active matches.
- Confirm World Cup 2026 competition IDs.
- Confirm whether standings, squads, event timelines, and knockout brackets are available in the selected plan.
- Confirm commercial terms for public display.

## Sources

- `worldcup26.ir`: https://worldcup26.ir/?lang=en
- `worldcup26` API repository: https://github.com/rezarahiminia/worldcup2026
