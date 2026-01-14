import { entries } from "mobx";
import type { CharacterState } from "../data/Characters";
import { CharacterStateView } from "./CharacterStateView";

type Props = {
  state: CharacterState;
};

export function CharacterStateList({ state }: Props) {
  return (
    <ul className="list">
      {entries(state).map(([key, value]) => (
        <CharacterStateView key={key} name={key} value={value} />
      ))}
    </ul>
  );
}
