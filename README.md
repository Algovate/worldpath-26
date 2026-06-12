# 2026 世界杯追踪器

一个用于查看 2026 世界杯赛程、比分、积分榜，并完成冠军路径预测的 Next.js 原型应用。

当前版本使用本地 mock 数据，不代表官方赛程或实时比分。代码已经预留 `ScoreAdapter` 和 API route 边界，后续可以替换为真实赛事数据供应商。

## 功能

- 总览：赛事进度、实时关注、即将开赛、小组领跑。
- 赛程：按阶段和比赛状态筛选比赛。
- 积分：12 个小组积分榜，自动计算胜平负、净胜球和积分。
- 预测：调整小组排名，逐轮选择淘汰赛胜者，生成冠军预测。
- 自动保存：预测结果保存在当前浏览器的 `localStorage`。
- 数据刷新：总览、赛程和积分页会每 30 秒向本地 API 检查一次数据。

## 数据接口

当前 API 返回 mock 数据：

- `GET /api/tournament`
- `GET /api/matches`
- `GET /api/standings`

后续接真实比分时，应实现新的 live score adapter，并保持页面消费的快照结构不变。

## Getting Started

安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 环境变量

复制 `.env.example` 到 `.env.local` 后填写真实数据源配置。

```bash
cp .env.example .env.local
```

不要提交 `.env.local`。Next.js 会加载 `.env*` 文件；只有 `NEXT_PUBLIC_` 前缀的变量会进入浏览器端 bundle。

## 验证

```bash
npm test
npm run lint
npm run build
```

## 部署

可以部署到 Vercel 或其他支持 Next.js App Router 的平台。

上线前确认：

- `npm run build` 通过。
- 真实比分供应商的 API key 只配置在服务端环境变量。
- 页面仍明确区分 mock 数据和真实数据。

## 参考

- [Next.js Environment Variables](https://nextjs.org/docs/pages/guides/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
