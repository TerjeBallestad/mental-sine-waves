import clsx from "clsx";
import { keyToName } from "../functions/FunctionLibrary";
import type { CharacterState } from "../data/Characters";
import { entries } from "mobx";

type StateViewProps = {
  name: string;
  value: number;
};

type StateListProps = {
  state: CharacterState;
};

export function CharacterStateList({ state }: StateListProps) {
  return (
    <ul className="list">
      {entries(state).map(([key, value]) => (
        <CharacterStateView key={key} name={key} value={value} />
      ))}
    </ul>
  );
}

export function CharacterStateView({ name, value }: StateViewProps) {
  return (
    <li className="list-row flex flex-col">
      <div className="flex justify-between">
        <span className="capitalize">{keyToName(name)}</span>
        <span className="font-semibold">{Math.round(value)}</span>
      </div>

      <progress
        className={clsx("progress w-full", {
          "progress-success": value > 60,
          "progress-warning": value <= 60 && value > 20,
          "progress-error": value <= 20,
        })}
        value={value}
        max="100"
      ></progress>
    </li>
  );
}
