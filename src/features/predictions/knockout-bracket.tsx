import type { Team } from "@/lib/tournament/types";

type Round = {
  id: string;
  label: string;
  matches: Array<[string | undefined, string | undefined]>;
};

export function KnockoutBracket({
  rounds,
  teamsById,
  winners,
  onPick,
}: {
  rounds: Round[];
  teamsById: Map<string, Team>;
  winners: Record<string, string>;
  onPick: (matchId: string, winnerId: string) => void;
}) {
  return (
    <div className="bracket">
      {rounds.map((round) => (
        <section className="bracket-round" key={round.id}>
          <h3>{round.label}</h3>
          {round.matches.map(([homeId, awayId], index) => {
            const matchId = `${round.id}-${index}`;
            return (
              <div className="bracket-match" key={matchId}>
                {[homeId, awayId].map((teamId, slotIndex) => {
                  const team = teamId ? teamsById.get(teamId) : undefined;
                  const selected = teamId && winners[matchId] === teamId;
                  return (
                    <button
                      type="button"
                      key={`${matchId}-${slotIndex}-${teamId ?? "empty"}`}
                      className={selected ? "team-option selected" : "team-option"}
                      disabled={!teamId}
                      onClick={() => teamId && onPick(matchId, teamId)}
                    >
                      <span>{team?.flag ?? "□"}</span>
                      <strong>{team?.name ?? "待定"}</strong>
                      <small>{team?.code ?? ""}</small>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
