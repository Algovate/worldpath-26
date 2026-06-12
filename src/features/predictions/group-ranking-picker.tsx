import type { Team } from "@/lib/tournament/types";

export function GroupRankingPicker({
  groupRankings,
  teamsById,
  onMove,
}: {
  groupRankings: Record<string, string[]>;
  teamsById: Map<string, Team>;
  onMove: (group: string, teamId: string, direction: -1 | 1) => void;
}) {
  return (
    <div className="group-picker-grid">
      {Object.entries(groupRankings).map(([group, teamIds]) => (
        <section className="prediction-card" key={group}>
          <h3>{group} 组排名</h3>
          <ol className="ranking-list">
            {teamIds.map((teamId, index) => {
              const team = teamsById.get(teamId);
              return (
                <li key={teamId}>
                  <span className="rank-index">{index + 1}</span>
                  <span className="flag">{team?.flag}</span>
                  <strong>{team?.name}</strong>
                  <small>{team?.code}</small>
                  <div className="move-actions">
                    <button type="button" aria-label={`${team?.name} 上移`} onClick={() => onMove(group, teamId, -1)} disabled={index === 0}>
                      ↑
                    </button>
                    <button type="button" aria-label={`${team?.name} 下移`} onClick={() => onMove(group, teamId, 1)} disabled={index === teamIds.length - 1}>
                      ↓
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
