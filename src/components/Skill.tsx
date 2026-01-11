import type { ASkill } from "../data/Skills";

type Props = {
  skill: ASkill;
};

export function SkillView({ skill }: Props) {
  return (
    <div>
      <h3>{skill.name}</h3>
      <button className="btn">+</button>
      <button className="btn">-</button>
    </div>
  );
}
