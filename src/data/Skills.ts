type SkillCategory = "basic" | "analytical" | "creative" | "social";
type SkillTier = 1 | 2 | 3 | 4;
type SkillData = {
  skillCategory: SkillCategory;
  skillTier: SkillTier;
};

export class Skill {
  skillCategory: SkillCategory;
  skillTier: SkillTier;

  constructor({ skillCategory, skillTier }: SkillData) {
    this.skillCategory = skillCategory;
    this.skillTier = skillTier;
  }
}
