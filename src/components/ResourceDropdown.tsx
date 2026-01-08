import { entries } from "mobx";
import { getGameState } from "../GameState";
import { observer } from "mobx-react-observer";

export const ResourceDropdown = observer(function ResourceDropdown() {
  const gameState = getGameState();
  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-primary">Resources</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 grid min-w-300 grid-cols-8 shadow-sm">
        {entries(gameState.globalResources).map(([key, value]) => (
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
  );
});
