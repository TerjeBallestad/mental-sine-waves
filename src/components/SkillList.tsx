import { entries } from "mobx";
import type { ASkill, SkillID } from "../data/Skills";
import { SkillView } from "./Skill";

type Props = {
  skills: Record<SkillID, ASkill>;
};

export function SkillList({ skills }: Props) {
  return entries(skills).map(([id, skill]) => (
    <SkillView key={id} skill={skill} />
  ));
}
