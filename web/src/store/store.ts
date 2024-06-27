import { create } from "zustand";
import { Player } from "./Player";
import { isWinner } from "../helpers/utils";

export type Message = {
  id: number;
  sender: string;
  senderId: string;
  content: string;
};

type AppState = {
  username: string;
  setUsername: (newUsername: string) => void;

  messages: Map<number, Message>;
  addMessage: (message: Message) => void;

  mainPlayerId: string;
  setMainPlayerId: (id: string) => void;

  npcPlayerIds: Set<string>;
  setNpcPlayerId: (id: string) => void;

  playersPredictions: Map<string, number>;
  setPlayerPrediction: (id: string, pred: number) => void;

  gameSpeed: number;
  setGameSpeed: (speed: number) => void;

  playerScores: Map<string, number>;
  setPlayerScore: (id: string, score: number) => void;

  playerPoints: Map<string, number>;
  setPlayerPoints: (id: string, points: number) => void;

  result: number | undefined | null;
  setResult: (result: number | undefined | null) => void;
};

export const useStore = create<AppState>((set) => ({
  username: "",
  setUsername: (newUsername) => {
    initApp(newUsername);
    return set(() => ({ username: newUsername }));
  },

  messages: new Map(),
  addMessage: (message) => {
    return set((state) => {
      if (!state.messages.has(message.id)) {
        const newMessages = new Map(state.messages);
        newMessages.set(message.id, message);
        return { messages: newMessages };
      }
      return state;
    });
  },

  mainPlayerId: "",
  setMainPlayerId: (id) => set(() => ({ mainPlayerId: id })),

  npcPlayerIds: new Set(),
  setNpcPlayerId: (id) =>
    set((state) => {
      const newNpcPlayerIds = new Set(state.npcPlayerIds);
      newNpcPlayerIds.add(id);
      return {
        npcPlayerIds: newNpcPlayerIds,
      };
    }),

  playersPredictions: new Map(),
  setPlayerPrediction: (id, pred) =>
    set((state) => {
      const newPredictions = new Map(state.playersPredictions);
      newPredictions.set(id, pred);
      return { playersPredictions: newPredictions };
    }),

  gameSpeed: 1,
  setGameSpeed: (speed) => set(() => ({ gameSpeed: speed })),

  playerPoints: new Map(),
  setPlayerPoints: (id, points) =>
    set((state) => {
      const newPlayerPoints = new Map(state.playerPoints);
      newPlayerPoints.set(id, points);
      return {
        playerPoints: newPlayerPoints,
      };
    }),

  playerScores: new Map(),
  setPlayerScore: (id, score) =>
    set((state) => {
      const newPlayerScores = new Map(state.playerScores);
      newPlayerScores.set(id, score);
      return {
        playerScores: newPlayerScores,
      };
    }),

  result: undefined,
  setResult: (result) =>
    set((state) => {
      if (typeof result === "number") {
        const newPlayerScores = new Map(state.playerScores);
        Array.from(players.values()).forEach((player) => {
          const id = player.id;
          if (!id) return;
          const pred = state.playersPredictions.get(id);
          if (pred === undefined) return;
          const points = state.playerPoints.get(id) || 0;

          if (isWinner(pred, result)) {
            const oldScore = newPlayerScores.get(id) || 0;
            newPlayerScores.set(
              id,
              parseInt((oldScore + pred * points).toString()),
            );
          }
        });

        return {
          result,
          playerScores: newPlayerScores,
        };
      }

      return { result };
    }),
}));

export const players: Map<string, Player> = new Map();

const initApp = (username: string) => {
  players.clear();

  new Player({
    name: username,
    npc: false,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setMainPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });

  new Player({
    name: "cpu 1",
    npc: true,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setNpcPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });

  new Player({
    name: "cpu 2",
    npc: true,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setNpcPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });

  new Player({
    name: "cpu 3",
    npc: true,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setNpcPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });

  new Player({
    name: "cpu 4",
    npc: true,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setNpcPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });

  new Player({
    name: "cpu 5",
    npc: true,
    onConnection: (id: string, player: Player) => {
      players.set(id, player);
      useStore.getState().setNpcPlayerId(id);
      useStore.getState().playerScores.set(id, 0);
    },
  });
};
