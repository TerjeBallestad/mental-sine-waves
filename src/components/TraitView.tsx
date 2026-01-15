import { entries } from "mobx";
import type { CharacterTraits } from "../data/Characters";
import { keyToName } from "../functions/FunctionLibrary";

type TraitListProps = {
  traits: CharacterTraits;
};

export function TraitList({ traits }: TraitListProps) {
  return (
    <ul className="grid grid-cols-5 gap-4">
      {entries(traits).map(([key, value]) => (
        <TraitView key={key} name={key} value={value} />
      ))}
    </ul>
  );
}

type TraitViewProps = {
  name: string;
  value: number;
};
function TraitView({ name, value }: TraitViewProps) {
  return (
    <li className="bg-base-100 flex flex-col items-center gap-2 rounded p-2 shadow-lg">
      <div
        className="radial-progress text-accent"
        style={{ "--value": value } as React.CSSProperties}
        aria-valuenow={value}
        role="progressbar"
      >
        <span className="font-semibold">{value}</span>
      </div>
      <span className="capitalize">{keyToName(name)}</span>
    </li>
  );
}
