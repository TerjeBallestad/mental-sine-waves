import { createContext, type Dispatch } from "react";
import { characters, type Character } from "./data/Characters";

export type TimeAction = { time: number; type: "added" | "subtracted" };

export const timeReducer = (current: number, action: TimeAction): number => {
  switch (action.type) {
    case "added":
      return current + action.time;
    case "subtracted":
      return current - action.time;
    default:
      return current;
  }
};

export const TimeContext = createContext<number>(0);
export const TimeDispatchContext = createContext<Dispatch<TimeAction>>(() => {
  console.error("no time dispatch provided");
});

export const CharacterContext = createContext<Character>(characters[0]);
export const CharacterSelectContext = createContext<Dispatch<unknown>>(() => {
  console.error("no dispatch provided");
});
