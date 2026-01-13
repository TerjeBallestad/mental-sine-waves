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
            <div className="flex" key={`${skill.id}-${req.skill}`}>
              <p>{req.skill}</p>
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
        <div>{characterSkill.level}</div>
      </div>
      <p className="mb-2 text-xs">{characterSkill.description}</p>
      <button className="btn" onClick={() => characterSkill.decreaseSkill()}>
        -
      </button>
      <button className="btn" onClick={() => characterSkill.increaseSkill()}>
        +
      </button>
    </div>
  );
});
