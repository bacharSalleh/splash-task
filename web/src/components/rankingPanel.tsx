import { cn } from "../helpers/utils";
import { players, useStore } from "../store/store";

const RankingPanel = () => {
  const [playerScores, mainPlayerId] = useStore((state) => [
    state.playerScores,
    state.mainPlayerId,
  ]);

  const sortedRanks = Array.from(playerScores).sort(
    (playerScore1, playerScore2) => playerScore2[1] - playerScore1[1],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-lg">🧮</span>
        <h1>Ranking</h1>
      </div>
      <div className="flex-1 overflow-hidden rounded border border-gray-700">
        <table className="h-full w-full">
          <thead className="text-xs">
            <tr className="[&_th]:py-3">
              <th className="pl-6 text-gray-500" align="left">
                No.
              </th>
              <th className="text-gray-500">Name</th>
              <th className="text-gray-500">Score</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedRanks.map((playerScore, index) => {
              const [id, score] = playerScore;
              const player = players.get(id);
              const name = player?.name;
              const isMe = id === mainPlayerId;

              return (
                <tr
                  className={cn(
                    isMe ? "bg-gray-500" : "odd:bg-gray-700 even:bg-gray-800",
                  )}
                >
                  <td className="py-2 pl-6">{index + 1}</td>
                  <td align="center">{isMe ? "You" : name}</td>
                  <td align="center">{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingPanel;
