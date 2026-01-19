import { useGameState } from "../GameState";
import { ResourceDropdown } from "../components/ResourceDropdown";
import { observer } from "mobx-react-observer";

export const ResourcesPage = observer(function ResourcesPage() {
  const gameState = useGameState();

  return (
    <div className="page-grid gap-y-6 p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">Resources</h1>
          <p className="text-opacity-70">
            View all resources you've collected through activities.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <ResourceDropdown />
        </div>
      </div>
    </div>
  );
});
