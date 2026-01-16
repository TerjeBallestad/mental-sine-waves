import { entries } from "mobx";
import {
  SkillCategoryLabels,
  type ASkill,
  type SkillCategory,
  type SkillID,
} from "../data/Skills";
import { SkillView } from "./SkillView";
import { useGameState } from "../GameState";
import { type Resource } from "../data/Resources";
import { useState } from "react";
import clsx from "clsx";

type Props = {
  skills: Record<SkillID, ASkill>;
};

export function SkillList({ skills }: Props) {
  const gameState = useGameState();
  const [selectedTab, setTabSelected] = useState<SkillCategory>("basic");

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
      <div role="tablist" className="tabs col-span-4 justify-center">
        {Object.entries(SkillCategoryLabels).map(([cat, label]) => (
          <a
            role="tab"
            key={cat}
            className={clsx("tab", { "tab-active": selectedTab === cat })}
            onClick={() => setTabSelected(cat as SkillCategory)}
          >
            {label}
          </a>
        ))}
      </div>
      {experience
        .filter((resource) => resource.startsWith(selectedTab))
        .map((resource) => (
          <label key={resource} className="col-span-4">
            <div className="pb-2 capitalize">
              {resource}: {gameState.globalResources[resource]}
            </div>
            <progress
              className="progress progress-secondary mb-4"
              value={gameState.globalResources[resource]}
              max={1000}
            />
          </label>
        ))}
      {entries(skills)
        .filter(([, skill]) => skill.category === selectedTab)
        .map(([id, skill]) => (
          <SkillView key={id} skill={skill} />
        ))}
    </>
  );
}
