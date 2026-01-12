import { entries } from "mobx";
import type { ASkill, SkillID } from "../data/Skills";
import { SkillView } from "./SkillView";
import { useGameState } from "../GameState";
import { type Resource } from "../data/Resources";

type Props = {
  skills: Record<SkillID, ASkill>;
};

export function SkillList({ skills }: Props) {
  const gameState = useGameState();
  const experience = Array<Resource>(
    "socialExperience",
    "basicExperience",
    "creativeExperience",
    "physicalExperience",
    "technicalExperience",
    "analyticalExperience",
    "organizationalExperience",
  );

  return (
    <>
      {experience.map((resource) => (
        <label className="col-span-2">
          {resource}: {gameState.globalResources[resource]}
          <progress
            className="progress"
            value={gameState.globalResources[resource]}
            max={1000}
          />
        </label>
      ))}
      {entries(skills).map(([id, skill]) => (
        <SkillView key={id} skill={skill} />
      ))}
    </>
  );
}
