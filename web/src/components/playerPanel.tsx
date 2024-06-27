/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { players, useStore } from "../store/store";
import { cn, isPlayer, isWinner } from "../helpers/utils";

const PlayerPanel = ({ startGame }: { startGame: () => void }) => {
  const [rangeValue, setRangeValue] = useState(1);
  const [points, setPoints] = useState(50);
  const [multiplier, setMultiplier] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null!);
  const thumbContentRef = useRef<HTMLDivElement>(null!);

  const [
    mainPlayerId,
    npcPlayerIds,
    setPlayerPoints,
    setGameSpeed,
    setPlayerPrediction,
    playerPoints,
    playersPredictions,
    result,
  ] = useStore((state) => [
    state.mainPlayerId,
    state.npcPlayerIds,
    state.setPlayerPoints,
    state.setGameSpeed,
    state.setPlayerPrediction,
    state.playerPoints,
    state.playersPredictions,
    state.result,
  ]);

  const mainPlayer = players.get(mainPlayerId);
  const npcPlayers = Array.from(npcPlayerIds.values())
    .map((id) => players.get(id))
    .filter(isPlayer);

  useEffect(() => {
    if (mainPlayerId) setPlayerPoints(mainPlayerId, points);
  }, [mainPlayerId, points, setPlayerPoints]);

  useEffect(() => {
    if (mainPlayerId) setPlayerPrediction(mainPlayerId, multiplier);
  }, [mainPlayerId, multiplier, setPlayerPrediction]);

  useEffect(() => {
    setGameSpeed(rangeValue);
  }, [rangeValue, setGameSpeed]);

  const sliderBgPct = (range: number) => {
    const min = 1;
    const max = 5;
    const normalize = (range - min) / (max - min);
    const rangePct = normalize * 100;
    return rangePct;
  };

  const sliderThumbTranslate = (
    rangePct: number,
    container: HTMLDivElement,
  ) => {
    if (!container) return 0;
    const margin = getComputedStyle(container).margin;
    const width = container.getBoundingClientRect().width - parseFloat(margin);
    return (rangePct / 100) * width;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Buttons */}
      <div className="flex h-12 gap-4">
        <div className="flex h-full flex-1 flex-col gap-1 rounded border border-gray-800 p-1">
          <span className="text-center text-xs text-gray-400">Points</span>
          <div className="flex gap-1">
            <button className="rounded border border-gray-800 hover:bg-gray-800 active:bg-gray-900">
              <ChevronDown
                size={16}
                color="gray"
                onClick={() => {
                  setPoints(Math.max(points - 25, 50));
                }}
              />
            </button>
            <input
              type="number"
              step={25}
              className="hide-arrows inline-block w-0 flex-grow rounded bg-gray-950 text-center text-sm text-white"
              value={points}
            />
            <button className="rounded border border-gray-800 hover:bg-gray-800 active:bg-gray-900">
              <ChevronUp
                size={16}
                color="gray"
                onClick={() => {
                  setPoints(points + 25);
                }}
              />
            </button>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col gap-1 rounded border border-gray-800 p-1">
          <span className="text-center text-xs text-gray-400">Multiplier</span>
          <div className="flex gap-1">
            <button className="rounded border border-gray-800 hover:bg-gray-800 active:bg-gray-900">
              <ChevronDown
                size={16}
                color="gray"
                onClick={() => {
                  setMultiplier(Math.max(multiplier - 0.25, 1));
                }}
              />
            </button>
            <input
              type="number"
              className="hide-arrows inline-block w-0 flex-grow rounded bg-gray-950 text-center text-sm text-white"
              value={multiplier}
              onChange={(e) => {
                const value = e.target.value;
                const [decimalNum, fractionNum] = value.split(".");
                if (fractionNum && fractionNum.length > 2) {
                  const newFractionNum = fractionNum.slice(0, 2);
                  return setMultiplier(
                    Math.min(10, Number(`${decimalNum}.${newFractionNum}`)),
                  );
                }

                setMultiplier(Math.min(10, Math.max(Number(value), 1)));
              }}
            />
            <button className="rounded border border-gray-800 hover:bg-gray-800 active:bg-gray-900">
              <ChevronUp
                size={16}
                color="gray"
                onClick={() => {
                  setMultiplier(Math.min(multiplier + 0.25, 10));
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Start Game */}
      <button
        className={cn(
          "rounded p-2",
          result !== null &&
            "bg-gradient-to-r from-pink-700 to-orange-600 hover:from-pink-600 hover:to-orange-500",
          result === null && "bg-gray-800 hover:bg-gray-800",
        )}
        onClick={() => {
          if (result === null) return;
          startGame();
        }}
      >
        {result === null ? "Started" : "Start"}
      </button>

      {/* Current Round */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-lg">🏆</span>
          <h1>Current Round</h1>
        </div>
        <div className="overflow-hidden rounded border border-gray-700">
          <table className="w-full">
            <thead className="text-xs">
              <tr>
                <th className="pl-4 text-gray-500" align="left">
                  Name
                </th>
                <th className="text-gray-500">Points</th>
                <th className="text-gray-500">Multiplier</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(() => {
                const id = mainPlayer?.id;
                const pred = playersPredictions.get(id || "");
                const points = playerPoints.get(id || "") || 0;
                
                if (!id) {
                  return <></>;
                }

                if (typeof result === "number") {
                  if (pred === undefined) return <></>;

                  return (
                    <tr
                      className={cn(
                        "bg-gray-500",
                        isWinner(pred, result)
                          ? "text-green-400"
                          : "text-red-400",
                      )}
                      key={mainPlayer.id}
                    >
                      <td className="py-2 pl-4">You</td>
                      <td align="center">
                        {isWinner(pred, result)
                          ? parseInt((pred * points).toString())
                          : 0}
                      </td>
                      <td align="center">{pred}</td>
                    </tr>
                  );
                }

                return (
                  <tr className="bg-gray-500" key={mainPlayer.id}>
                    <td className="py-2 pl-4">You</td>
                    <td align="center">{points || "-"}</td>
                    <td align="center">{pred || "-"}</td>
                  </tr>
                );
              })()}

              {Array.from(npcPlayers.values()).map((npcPlayer) => {
                const id = npcPlayer.id;
                const pred = playersPredictions.get(id || "");
                const points = playerPoints.get(id || "") || 0;

                if (!id) {
                  return <></>;
                }

                if (typeof result === "number") {
                  if (pred === undefined) return <></>;

                  return (
                    <tr
                      className={cn(
                        "odd:bg-gray-800 even:bg-gray-700",
                        isWinner(pred, result)
                          ? "text-green-400"
                          : "text-red-400",
                      )}
                      key={npcPlayer.id}
                    >
                      <td className="py-2 pl-4">{npcPlayer.name}</td>
                      <td align="center">
                        {isWinner(pred, result)
                          ? parseInt((pred * points).toString())
                          : 0}
                      </td>
                      <td align="center">{pred}</td>
                    </tr>
                  );
                }

                return (
                  <tr
                    className={cn("odd:bg-gray-800 even:bg-gray-700")}
                    key={npcPlayer.id}
                  >
                    <td className="py-2 pl-4">{npcPlayer.name}</td>
                    <td align="center">{points || "-"}</td>
                    <td align="center">{pred || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-lg">🕛</span>
          <h1>Speed</h1>
        </div>
        <div className="rounded border border-gray-700 bg-gray-800 p-2">
          <div className="relative">
            <div className="relative w-full" ref={sliderRef}>
              <input
                type="range"
                max={5}
                min={1}
                step={0.1}
                className="range w-full"
                value={rangeValue}
                onChange={(e) => {
                  setRangeValue(Number(e.target.value));
                }}
                style={
                  {
                    "--value": sliderBgPct(rangeValue),
                  } as any
                }
              />
              <div
                className="pointer-events-none absolute left-0 right-0 top-1/2 ml-[2.5px] mr-[12.5px] h-5 -translate-y-1/2"
                ref={thumbContentRef}
              >
                <span
                  className="pointer-events-none absolute left-0 top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full border border-white"
                  style={{
                    transform: `translateX(calc(${sliderThumbTranslate(sliderBgPct(rangeValue), thumbContentRef.current)}px))`,
                  }}
                ></span>
              </div>
            </div>
            <div className="flex w-full justify-between py-1 text-xs">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`${rangeValue >= index + 1 ? "text-orange-500" : "text-gray-500"}`}
                >
                  {index + 1}x
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;
