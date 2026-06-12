# WorldPath 26

WorldPath 26 是一个 2026 世界杯成绩查看与冠军路径预测应用。它把实时赛程、比分、积分榜和个人预测放在同一个工作台里，适合快速查看赛事状态，也适合在小组赛和淘汰赛之间推演冠军路径。

当前版本是基于 Next.js App Router 的本地原型，默认使用 `worldcup26.ir` 公开 World Cup 2026 live data。应用仍保留 mock 数据和通用 live provider 接口，便于后续替换为商业比分供应商或自建数据中转服务。

## Features

- 总览：查看球队数量、进行中比赛、已结束比赛、小组领跑和即将开赛。
- 赛程：按阶段、状态筛选比赛，展示实时比分、比赛分钟和场地信息。
- 积分：展示 12 个小组积分榜，包括胜平负、进失球、净胜球和积分。
- 预测：调整小组排名，选择淘汰赛胜者，生成冠军、亚军和四强路径。
- 对比：将已结束小组赛的真实结果与个人预测结果并排展示。
- 自动保存：预测结果写入当前浏览器 `localStorage`。
- 数据状态：通过 `/data` 查看 provider、缓存、同步时间、错误状态和 API 入口。

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest

## Live Data

默认数据源：

```env
SCORE_PROVIDER=worldcup26
```

`worldcup26` provider 会在服务端请求：

- `https://worldcup26.ir/get/teams`
- `https://worldcup26.ir/get/games`
- `https://worldcup26.ir/get/groups`

这些响应会被标准化为应用内部的 `TournamentSnapshot`，页面只消费统一后的数据结构，不直接依赖供应商字段。

支持的数据模式：

| Provider | 用途 | 环境变量 |
| --- | --- | --- |
| `worldcup26` | 默认公开 live data | 无需 API key |
| `mock` | 本地原型和离线回退 | `SCORE_PROVIDER=mock` |
| `live` | 自定义商业供应商或中转服务 | `SPORTS_DATA_API_URL`、`SPORTS_DATA_API_KEY` |

如果设置 `SCORE_PROVIDER=live` 但缺少 URL 或 API key，服务端会明确回退到 mock 数据，不会把 mock 伪装成实时比分。

## API Routes

- `GET /api/tournament`：完整赛事快照，包括 teams、matches、standings 和数据源状态。
- `GET /api/matches`：比赛列表。
- `GET /api/standings`：小组积分榜。
- `GET /api/status`：当前数据源、缓存和配置状态。

所有外部数据请求都在服务端完成，浏览器不会直接调用比分供应商。

## Getting Started

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

可选：复制环境变量模板。

```bash
cp .env.example .env.local
```

不要提交 `.env.local`。只有 `NEXT_PUBLIC_` 前缀的环境变量会进入浏览器端 bundle。

## Scripts

```bash
npm run dev      # start local dev server
npm run test     # run Vitest tests
npm run lint     # run ESLint
npm run build    # build production app
npm run check    # test + lint + build
```

## Project Structure

```text
src/app/                    App Router pages and API routes
src/components/             Shared shell and UI primitives
src/features/               Page-level feature components
src/lib/tournament/           Tournament types, adapters, prediction and standings logic
src/lib/tournament/providers/ Live data provider normalization
docs/product/prd.md           Product requirements
docs/architecture/live-data.md Live data provider notes
```

## Provider Integration

要接入其他比分 API：

1. 设置 `SCORE_PROVIDER=live`。
2. 配置 `SPORTS_DATA_API_URL` 和 `SPORTS_DATA_API_KEY`。
3. 在 `src/lib/tournament/providers/live-provider.ts` 中对齐供应商原始字段。
4. 保持输出结构为 `Team`、`Match`、`Standing`。
5. 通过 `/data` 和 `/api/status` 验证 provider、缓存和错误状态。

核心边界：

- `src/lib/tournament/score-adapter.ts`
- `src/lib/tournament/providers/worldcup26-provider.ts`
- `src/lib/tournament/providers/live-provider.ts`
- `src/lib/tournament/snapshot.ts`

## Verification

当前基线检查：

```bash
npm run check
```

这会运行单元测试、lint 和 Next.js production build。

## Deployment Notes

可以部署到 Vercel 或其他支持 Next.js App Router 的平台。

上线前确认：

- `npm run check` 通过。
- 真实比分供应商密钥只存在服务端环境变量。
- UI 仍清晰标识 live、mock 或 fallback 状态。
- 商业使用前确认数据源的展示授权、稳定性、延迟和限流。

## References

- [Documentation index](docs/README.md)
- [Product PRD](docs/product/prd.md)
- [Live data provider notes](docs/architecture/live-data.md)
- [WorldCup26 public API](https://worldcup26.ir/?lang=en)
- [WorldCup26 API repository](https://github.com/rezarahiminia/worldcup2026)
