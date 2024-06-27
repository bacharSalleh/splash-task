import { useCallback, useRef } from "react";
import ChatPanel from "./components/chatPanel";
import GraphPanel, { GraphPanelRef } from "./components/graphPanel";
import PlayerInfo from "./components/playerInfo";
import PlayerPanel from "./components/playerPanel";
import RankingPanel from "./components/rankingPanel";
import RegisterPanel from "./components/registerPanel";
import { getRandom } from "./helpers/utils";
import { useStore } from "./store/store";

const App = () => {
  const graphRef = useRef<GraphPanelRef>(null!);
  const username = useStore((state) => state.username);
  const [, npcPlayerIds, gameSpeed] = useStore((state) => [
    state.mainPlayerId,
    state.npcPlayerIds,
    state.gameSpeed,
  ]);

  const [setPlayerPrediction, setPlayerPoints, setResult] = useStore(
    (state) => [
      state.setPlayerPrediction,
      state.setPlayerPoints,
      state.setResult,
    ],
  );

  const startGame = useCallback(() => {
    npcPlayerIds.forEach((npcId) => {
      const prediction = Number(getRandom(1, 10).toFixed(2));
      const points = parseInt(getRandom(1, 20).toString()) * 25;

      setPlayerPrediction(npcId, prediction);
      setPlayerPoints(npcId, points);
    });

    const randomTarget = parseFloat(getRandom(1, 10).toFixed(2));

    graphRef.current.play(randomTarget);
    setResult(null);
  }, [npcPlayerIds, setPlayerPoints, setPlayerPrediction, setResult]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center p-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Left Side */}
            {!username && <RegisterPanel />}
            {username && <PlayerPanel startGame={startGame} />}

            {/* Right Side */}
            <div className="col-span-2 flex flex-col gap-4">
              {/* Top Buttons */}
              <PlayerInfo />

              {/* Graph */}
              <GraphPanel speed={gameSpeed} ref={graphRef} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ranking */}
            <RankingPanel />

            {/* Chat */}
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
