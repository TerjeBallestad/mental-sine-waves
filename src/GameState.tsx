import { useReducer, type PropsWithChildren } from "react";
import { characters } from "./data/Characters";
import {
  CharacterContext,
  CharacterSelectContext,
  TimeContext,
  TimeDispatchContext,
  timeReducer,
} from "./GameStateContext";

export function GameStateProvider({ children }: PropsWithChildren) {
  const [character, dispatchCharacter] = useReducer(
    () => characters[0],
    characters[0],
  );
  const [time, dispatchTime] = useReducer(timeReducer, 0);
  return (
    <TimeContext value={time}>
      <TimeDispatchContext value={dispatchTime}>
        <CharacterContext value={character}>
          <CharacterSelectContext value={dispatchCharacter}>
            {children}
          </CharacterSelectContext>
        </CharacterContext>
      </TimeDispatchContext>
    </TimeContext>
  );
}
