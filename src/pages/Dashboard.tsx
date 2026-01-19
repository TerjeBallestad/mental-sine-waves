import { useGameState } from "../GameState";
import { CharacterStateList } from "../components/CharacterStateView";
import { ActivityList } from "../components/ActivityView";
import { SkillList } from "../components/SkillList";
import { RewardList } from "../components/RewardView";
import { observer } from "mobx-react-observer";

export const Dashboard = observer(function Dashboard() {
  const gameState = useGameState();
  const character = gameState.selectedCharacter;

  return (
    <div className="page-grid gap-y-6 p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">Dashboard</h1>
          <p className="text-opacity-70">
            Welcome, {character.name}! Manage your character's activities and
            resources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Character State</h2>
            <CharacterStateList state={character.state} />
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Rewards</h2>
            <RewardList recentRewards={character.recentRewards} />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Activities</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActivityList activities={gameState.availableActivities} />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Skills</h2>
          <SkillList skills={gameState.availableSkills} />
        </div>
      </div>
    </div>
  );
});
