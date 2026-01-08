import type { Dispatch, SetStateAction } from "react";
import { useGameState } from "../GameState";
import { Pause, Play } from "lucide-react";

type HeaderProps = {
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ isRunning, setIsRunning }: HeaderProps) => {
  const gameState = useGameState();
  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="ps-4">
          <a className="text-lg font-bold">Ellingspillet</a>
        </div>
      </div>
      <div className="navbar-center">
        <span className="w-20">{gameState.time.toFixed(2)}</span>
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
        <details className="dropdown dropdown-end">
          <summary className="btn btn-primary">Resources</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 grid min-w-300 grid-cols-8 shadow-sm">
            {Object.entries(gameState.globalResources).map(([key, value]) => (
              <li key={key}>
                <span>
                  {key}
                  <br></br>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </details>

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
};
