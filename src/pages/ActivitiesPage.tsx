import { useGameState } from "../GameState";
import { ActivityList } from "../components/ActivityView";
import { observer } from "mobx-react-observer";

export const ActivitiesPage = observer(function ActivitiesPage() {
  const gameState = useGameState();

  return (
    <div className="page-grid gap-y-6 p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">Activities</h1>
          <p className="text-opacity-70">
            Choose activities to perform. Each activity consumes resources and
            generates rewards based on your character's traits and skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ActivityList activities={gameState.availableActivities} />
      </div>
    </div>
  );
});
