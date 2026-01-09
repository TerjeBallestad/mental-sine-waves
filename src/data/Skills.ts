type SkillCategory =
  | "basic"
  | "analytical"
  | "creative"
  | "social"
  | "organizational"
  | "physical"
  | "technical";
type SkillTier = 1 | 2 | 3 | 4;
type SkillData = {
  skillCategory: SkillCategory;
  skillTier: SkillTier;
};

export class Skill {
  skillCategory: SkillCategory;
  skillTier: SkillTier;
  mastery = 0;

  constructor({ skillCategory, skillTier }: SkillData) {
    this.skillCategory = skillCategory;
    this.skillTier = skillTier;
  }
}
