import type { Standing, Team } from "@/lib/tournament/types";

export function StandingsTable({
  group,
  standings,
  teamsById,
}: {
  group: string;
  standings: Standing[];
  teamsById: Map<string, Team>;
}) {
  return (
    <section className="table-card">
      <header>
        <h2>{group} 组</h2>
        <span>前二直通，第三待定</span>
      </header>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>球队</th>
              <th>赛</th>
              <th>胜</th>
              <th>平</th>
              <th>负</th>
              <th>净</th>
              <th>分</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => {
              const team = teamsById.get(standing.teamId);
              return (
                <tr key={standing.teamId}>
                  <td>
                    <span className={index < 2 ? "rank direct" : index === 2 ? "rank possible" : "rank"}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="team-cell">
                    <span>{team?.flag}</span>
                    <strong>{team?.name}</strong>
                    <small>{team?.code}</small>
                  </td>
                  <td>{standing.played}</td>
                  <td>{standing.won}</td>
                  <td>{standing.drawn}</td>
                  <td>{standing.lost}</td>
                  <td>{standing.goalDifference}</td>
                  <td>
                    <strong>{standing.points}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
