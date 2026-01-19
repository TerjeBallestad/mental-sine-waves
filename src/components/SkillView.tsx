import { observer } from "mobx-react-observer";
import type { ASkill } from "../data/Skills";
import { useGameState } from "../GameState";
import clsx from "clsx";

type Props = {
  skill: ASkill;
};

export const SkillView = observer(function SkillView({ skill }: Props) {
  const gameState = useGameState();
  const character = gameState.selectedCharacter;
  const characterSkill = character.getSkill(skill);

  if (!characterSkill) {
    return (
      <div
        className={clsx("border-t", {
          "border-neutral": skill.tier === 1,
          "border-success": skill.tier === 2,
          "border-info": skill.tier === 3,
          "border-secondary": skill.tier === 4,
        })}
      >
        <h3 className="mb-1">{skill.name}</h3>
        <p className="mb-2 text-xs">{skill.description}</p>
        <button
          className="btn btn-secondary"
          disabled={!character.canLearnSkill(skill)}
          onClick={() => character.grantSkill(skill)}
        >
          Learn
        </button>
        <div>
          {skill.requirements.map((req) => (
            <div className="flex" key={`${skill.id}-${req.id}`}>
              <p>{req.id}</p>
              <p>{req.level}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      className={clsx("border-t", {
        "border-neutral": characterSkill.tier === 1,
        "border-success": characterSkill.tier === 2,
        "border-info": characterSkill.tier === 3,
        "border-secondary": characterSkill.tier === 4,
      })}
    >
      <div className="flex justify-between">
        <h3 className="mb-1">{characterSkill.name}</h3>
        <div className="badge badge-primary">Level {characterSkill.level}</div>
      </div>
      <p className="mb-2 text-xs">{characterSkill.description}</p>

      {/* Experience Progress */}
      {characterSkill.level < 10 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Experience: {Math.floor(characterSkill.experience)}</span>
            <span>
              {characterSkill.getExperienceForNextLevel()} to next level
            </span>
          </div>
          <progress
            className="progress progress-primary h-2"
            value={characterSkill.getProgressToNextLevel()}
            max={100}
          />
        </div>
      )}

      {/* Manual level controls (for testing) */}
      <div className="flex gap-2">
        <button
          className="btn btn-sm"
          onClick={() => characterSkill.decreaseSkill()}
        >
          -
        </button>
        <button
          className="btn btn-sm"
          onClick={() => characterSkill.increaseSkill()}
        >
          +
        </button>
      </div>
    </div>
  );
});
