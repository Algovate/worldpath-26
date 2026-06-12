import type { Team } from "@/lib/tournament/types";

export function PredictionSummary({
  champion,
  finalist,
  semiFinalists,
  completion,
}: {
  champion?: Team;
  finalist?: Team;
  semiFinalists: Team[];
  completion: number;
}) {
  return (
    <aside className="summary-card">
      <p className="eyebrow">预测摘要</p>
      <h2>{champion ? `${champion.flag} ${champion.name}` : "冠军未产生"}</h2>
      <div className="progress">
        <span style={{ width: `${completion}%` }} />
      </div>
      <p>完成度 {completion}%</p>
      <dl>
        <div>
          <dt>亚军</dt>
          <dd>{finalist ? `${finalist.flag} ${finalist.name}` : "待定"}</dd>
        </div>
        <div>
          <dt>四强</dt>
          <dd>{semiFinalists.length ? semiFinalists.map((team) => team.code).join(" / ") : "待定"}</dd>
        </div>
      </dl>
    </aside>
  );
}
