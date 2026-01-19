import { useGameState } from "../GameState";
import { SkillList } from "../components/SkillList";
import { observer } from "mobx-react-observer";

export const SkillsPage = observer(function SkillsPage() {
  const gameState = useGameState();

  return (
    <div className="page-grid gap-y-6 p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">Skills</h1>
          <p className="text-opacity-70">
            View and manage your character's skills. Skills improve through
            practice and affect activity performance.
          </p>
        </div>
      </div>

      <SkillList skills={gameState.availableSkills} />
    </div>
  );
});
