import type { Match, Team } from "@/lib/tournament/types";

export function PredictionComparison({
  groupRankings,
  matches,
  teamsById,
}: {
  groupRankings: Record<string, string[]>;
  matches: Match[];
  teamsById: Map<string, Team>;
}) {
  const finishedGroupMatches = matches.filter(
    (match) =>
      match.stage === "group" &&
      match.status === "finished" &&
      match.homeScore != null &&
      match.awayScore != null,
  );
  const compared = finishedGroupMatches.map((match) => {
    const predictedWinnerId = getPredictedWinner(match, groupRankings);
    const actualWinnerId = getActualWinner(match);
    return {
      match,
      predictedWinnerId,
      actualWinnerId,
      hit:
        actualWinnerId == null
          ? predictedWinnerId == null
          : predictedWinnerId === actualWinnerId,
    };
  });
  const hits = compared.filter((item) => item.hit).length;
  const accuracy = compared.length
    ? Math.round((hits / compared.length) * 100)
    : 0;

  return (
    <section className="prediction-card">
      <div className="comparison-header">
        <div>
          <p className="eyebrow">Actual vs Prediction</p>
          <h3>实际结果对比</h3>
        </div>
        <strong>{accuracy}%</strong>
      </div>

      {compared.length ? (
        <div className="comparison-list">
          {compared.slice(0, 8).map(({ match, predictedWinnerId, actualWinnerId, hit }) => {
            const home = teamsById.get(match.homeTeamId);
            const away = teamsById.get(match.awayTeamId);
            const predicted = predictedWinnerId
              ? teamsById.get(predictedWinnerId)?.code
              : "平局";
            const actual = actualWinnerId
              ? teamsById.get(actualWinnerId)?.code
              : "平局";

            return (
              <div className="comparison-row" key={match.id}>
                <span>
                  {home?.code} {match.homeScore}-{match.awayScore} {away?.code}
                </span>
                <small>预测 {predicted} / 实际 {actual}</small>
                <b className={hit ? "hit" : "miss"}>{hit ? "命中" : "偏差"}</b>
              </div>
            );
          })}
        </div>
      ) : (
        <p>暂无可对比的已结束小组赛。</p>
      )}
    </section>
  );
}

function getActualWinner(match: Match) {
  if (match.homeScore == null || match.awayScore == null) return undefined;
  if (match.homeScore === match.awayScore) return undefined;
  return match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
}

function getPredictedWinner(
  match: Match,
  groupRankings: Record<string, string[]>,
) {
  const group = match.group ? groupRankings[match.group] : undefined;
  if (!group) return undefined;

  const homeRank = group.indexOf(match.homeTeamId);
  const awayRank = group.indexOf(match.awayTeamId);
  if (homeRank === -1 || awayRank === -1 || homeRank === awayRank) return undefined;

  return homeRank < awayRank ? match.homeTeamId : match.awayTeamId;
}
