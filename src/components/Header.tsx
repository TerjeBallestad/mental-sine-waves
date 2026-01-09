import type { Dispatch, SetStateAction } from "react";
import { useGameState } from "../GameState";
import { Pause, Play } from "lucide-react";
import { ResourceDropdown } from "./ResourceDropdown";

type HeaderProps = {
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
};

export function Header({ isRunning, setIsRunning }: HeaderProps) {
  const gameState = useGameState();
  console.log(gameState.globalResources, "📖");

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="ps-4">
          <a className="text-lg font-bold">Ellingspillet</a>
        </div>
      </div>
      <div className="navbar-center">
        <span className="w-20">{gameState.time.toFixed(2)}</span>
        <span className="w-20">{gameState.dateTime.day}</span>
        <span className="w-20">{gameState.dateTime.time.toFixed(2)}</span>

        <button className="btn w-30" onClick={() => setIsRunning((r) => !r)}>
          {isRunning ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
      <div className="navbar-end gap-6">
        <ResourceDropdown />

        <div className="flex items-stretch">
          <select
            defaultValue={0}
            className="select w-50"
            onChange={(event) => {
              gameState.selectCharacter(
                gameState.characters[Number(event.target.value)],
              );
            }}
          >
            {gameState.characters.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
