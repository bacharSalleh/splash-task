import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "../store/Player";

export const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const isPlayer = (player: Player | undefined): player is Player => {
  return player !== undefined;
};

export const getCurrentTime24 = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isWinner = (pred: number, result: number) =>
  result && result > pred;

export const Colors = ["#ff4500", "#ff7f50", "#ff1493"];
