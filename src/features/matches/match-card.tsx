import { formatDateTime, formatMatchStatus, formatScore, formatStage } from "@/lib/tournament/format";
import type { Match, Team } from "@/lib/tournament/types";

type MatchCardProps = {
  match: Match;
  teamsById: Map<string, Team>;
};

export function MatchCard({ match, teamsById }: MatchCardProps) {
  const home = teamsById.get(match.homeTeamId);
  const away = teamsById.get(match.awayTeamId);
  const isLive = match.status === "live" || match.status === "extraTime";

  return (
    <article className="match-card">
      <div className="match-meta">
        <span className={isLive ? "status-live" : "status-default"}>
          {formatMatchStatus(match.status, match.minute)}
        </span>
        <span>{formatStage(match.stage)}{match.group ? ` · ${match.group} 组` : ""}</span>
        <span>{formatDateTime(match.date)}</span>
      </div>
      <div className="match-line">
        <TeamInline team={home} align="right" />
        <strong className="score">{formatScore(match)}</strong>
        <TeamInline team={away} />
      </div>
      <div className="venue">{match.venue}</div>
    </article>
  );
}

function TeamInline({
  team,
  align = "left",
}: {
  team?: Team;
  align?: "left" | "right";
}) {
  return (
    <span className={`team-inline ${align === "right" ? "team-right" : ""}`}>
      <span className="flag">{team?.flag ?? "□"}</span>
      <span>{team?.name ?? "待定"}</span>
      <small>{team?.code ?? "TBD"}</small>
    </span>
  );
}
