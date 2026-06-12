import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { formatDateTime } from "@/lib/tournament/format";
import { getScoreProviderStatus } from "@/lib/tournament/score-adapter";
import {
  getTournamentDataSourceStatus,
  getTournamentSnapshot,
} from "@/lib/tournament/snapshot";

export const dynamic = "force-dynamic";

const apiLinks = [
  { href: "/api/status", label: "Status" },
  { href: "/api/tournament", label: "Tournament" },
  { href: "/api/matches", label: "Matches" },
  { href: "/api/standings", label: "Standings" },
];

export default async function DataPage() {
  const snapshot = await getTournamentSnapshot();
  const providerStatus = getScoreProviderStatus();
  const dataSourceStatus = getTournamentDataSourceStatus();

  return (
    <div className="stack">
      <SectionHeader
        eyebrow="Data"
        title="数据源状态"
        description="检查当前比分数据源、缓存和 API 健康状态。"
      />

      <section className="data-grid">
        <article className="notice">
          <p className="eyebrow">Provider</p>
          <h2>{providerStatus.provider}</h2>
          <dl className="status-list">
            <div>
              <dt>模式</dt>
              <dd>{providerStatus.mode}</dd>
            </div>
            <div>
              <dt>API Key</dt>
              <dd>{providerStatus.hasApiKey ? "已配置" : "未配置"}</dd>
            </div>
            <div>
              <dt>Mock</dt>
              <dd>{providerStatus.isMock ? "是" : "否"}</dd>
            </div>
          </dl>
          <p>{providerStatus.notice}</p>
        </article>

        <article className="notice">
          <p className="eyebrow">Cache</p>
          <h2>{dataSourceStatus.cacheAgeSeconds ?? 0}s</h2>
          <dl className="status-list">
            <div>
              <dt>TTL</dt>
              <dd>{dataSourceStatus.cacheTtlSeconds}s</dd>
            </div>
            <div>
              <dt>缓存</dt>
              <dd>{dataSourceStatus.hasCachedSnapshot ? "可用" : "未生成"}</dd>
            </div>
            <div>
              <dt>最后同步</dt>
              <dd>
                {dataSourceStatus.lastSuccessfulSyncAt
                  ? formatDateTime(dataSourceStatus.lastSuccessfulSyncAt)
                  : "无"}
              </dd>
            </div>
          </dl>
          <p>{dataSourceStatus.lastError ?? "当前没有数据源错误。"}</p>
        </article>

        <article className="notice">
          <p className="eyebrow">Snapshot</p>
          <h2>{snapshot.teams.length} 队</h2>
          <dl className="status-list">
            <div>
              <dt>比赛</dt>
              <dd>{snapshot.matches.length}</dd>
            </div>
            <div>
              <dt>小组</dt>
              <dd>{Object.keys(snapshot.standings).length}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{snapshot.provider}</dd>
            </div>
          </dl>
          <p>最后更新：{formatDateTime(snapshot.lastUpdatedAt)}</p>
        </article>
      </section>

      <section className="notice">
        <p className="eyebrow">API</p>
        <div className="api-link-row">
          {apiLinks.map((link) => (
            <Link className="secondary-button" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
