import { useEffect, useState } from "react";
import { getCurrentTime24 } from "../helpers/utils";
import { players, useStore } from "../store/store";

const PlayerInfo = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime24());
  const [mainPlayerId, playerScores] = useStore((state) => [
    state.mainPlayerId,
    state.playerScores,
  ]);

  const player = players.get(mainPlayerId);
  const username = player?.name || "";
  const score = playerScores.get(mainPlayerId) || 0;

  useEffect(() => {
    const timeoutId = setInterval(
      () => setCurrentTime(getCurrentTime24()),
      1000 * 60,
    );

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  return (
    <div className="flex h-12 gap-4">
      <div className="flex h-full flex-1 items-center gap-1 rounded border border-gray-800 p-1">
        <span className="text-center text-xl text-gray-400">🎖️</span>
        <div className="flex-1 text-center font-bold">{score}</div>
      </div>
      
      <div className="flex h-full flex-1 items-center gap-1 rounded border border-gray-800 p-1">
        <span className="text-center text-xl text-gray-400">🧑🏻</span>
        <div className="flex-1 text-center font-bold">{username}</div>
      </div>

      <div className="flex h-full flex-1 items-center gap-1 rounded border border-gray-800 p-1">
        <span className="text-center text-xl text-gray-400">🕝</span>
        <div className="flex-1 text-center font-bold">{currentTime}</div>
      </div>

    
    </div>
  );
};

export default PlayerInfo;
