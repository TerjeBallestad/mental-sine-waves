import { makeAutoObservable } from "mobx";
import type { CharacterTraits } from "./Characters";
import type { Resource, ResourceData } from "./Resources";
import type { SkillRequirement } from "./Skills";

export type ActivityData = {
  id: string;
  label: string;
  color: string;
  mentalSignature: CharacterTraits;
  interestBonus: string[];
  description?: string;
  baseDifficulty: number; // 1-10
  reward: Partial<Record<Resource, ResourceData>>;
  requiredSkills: SkillRequirement[];
  recomendedSkills: SkillRequirement[];
};

export class AActivity implements ActivityData {
  id: string;
  label: string;
  color: string;
  timeToComplete = 1; // hour
  mentalSignature: CharacterTraits;
  interestBonus: string[];
  description?: string;
  reward: Partial<Record<Resource, ResourceData>>;
  baseDifficulty: number;
  requiredSkills: SkillRequirement[];
  recomendedSkills: SkillRequirement[];
  rewardInterval = 0.05; // 3 minutes
  mastery = 0; // determines mental adaption
  previousIntervalTime = 0;

  get intervalTime() {
    if (typeof this.timeToComplete === "number") {
      return this.timeToComplete / this.rewardInterval;
    }
    return 1;
  }

  /**
   * Calculates
   */
  getDifficulty(): number {
    let difficulty = this.baseDifficulty;
    difficulty *= 0.2;
    return difficulty;
  }

  constructor(
    id: string,
    {
      label,
      color,
      interestBonus,
      mentalSignature,
      reward,
      description,
      recomendedSkills,
      requiredSkills,
      baseDifficulty,
    }: Omit<ActivityData, "id">,
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.label = label;
    this.color = color;
    this.mentalSignature = mentalSignature;
    this.interestBonus = interestBonus;
    this.description = description;
    this.reward = reward;
    this.requiredSkills = recomendedSkills;
    this.recomendedSkills = requiredSkills;
    this.baseDifficulty = baseDifficulty;
  }
}

export const research = new AActivity("Research & Documentation", {
  label: "Research & Documentation",
  description: "Detailed work requiring focus and organization",
  color: "#f59e0b",
  baseDifficulty: 6,
  mentalSignature: {
    fortitude: 45, // Requires moderate sustained effort
    focus: 70, // High focus needed
    creativity: 40, // Some creativity helps
    attentionSpan: 75,
    processingSpeed: 50,
    workingMemory: 45,
    intellect: 60,
    extraversion: 20,
    openness: 55,
    conscientiousness: 60,
    agreeableness: 50,
    neuroticism: 65,
  },
  interestBonus: ["writing", "observation"],
  reward: {
    Insight: { amount: 1, influence: 1, chance: 0.2 },
    analyticalExperience: { amount: 10, influence: 0.2, chance: 0.5 },
    Research: { amount: 13, influence: 1, chance: 1 },
  },
  requiredSkills: [],
  recomendedSkills: [],
});

export const community = new AActivity("Community Outreach", {
  label: "Community Outreach",
  color: "#ec4899",
  baseDifficulty: 5,
  mentalSignature: {
    fortitude: 65, // Draining, high energy output
    focus: 40, // Less about precision
    creativity: 70, // Need to adapt to people
    attentionSpan: 60,
    processingSpeed: 70, // Quick reactions
    workingMemory: 80, // Must be flexible
    intellect: 60,
    extraversion: 50,
    openness: 60,
    conscientiousness: 55,
    agreeableness: 75,
    neuroticism: 40,
  },
  reward: {
    socialExperience: { amount: 10, influence: 1, chance: 1 },
    Connection: { amount: 4, influence: 1, chance: 0.9 },
    Reputation: { amount: 3, influence: 1, chance: 0.8 },
    Trust: { amount: 2, influence: 1, chance: 0.7 },
    Popularity: { amount: 2, influence: 0.9, chance: 0.6 },
  },
  interestBonus: ["helping", "social-dynamics"],
  description: "High energy, varied interactions",
  requiredSkills: [{ skill: "communication", level: 3 }],
  recomendedSkills: [],
});

export const creative = new AActivity("Creative Problem-Solving", {
  label: "Creative Problem-Solving",
  color: "#14b8a6",
  baseDifficulty: 4,
  mentalSignature: {
    fortitude: 55, // Intense bursts
    focus: 50, // Need to execute ideas
    creativity: 85, // High creativity required
    attentionSpan: 65,
    processingSpeed: 60,
    workingMemory: 90, // Must think outside box
    intellect: 80,
    extraversion: 40,
    openness: 80,
    conscientiousness: 50,
    agreeableness: 45,
    neuroticism: 35,
  },
  reward: {
    Ideas: { amount: 20, influence: 0.9, chance: 1 },
    Innovation: { amount: 12, influence: 0.9, chance: 0.8 },
    Insight: { amount: 6, influence: 1, chance: 0.6 },
    analyticalExperience: { amount: 3, influence: 1, chance: 1 },
    Research: { amount: 4, influence: 1, chance: 0.5 },
    Knowledge: { amount: 2, influence: 1, chance: 0.7 },
  },
  interestBonus: ["self-discovery", "observation"],
  description: "Bursts of insight, unpredictable flow",
  requiredSkills: [],
  recomendedSkills: [],
});

export const minfulness = new AActivity("Mindfulness Meditation", {
  label: "Mindfulness Meditation",
  color: "#22c55e",
  baseDifficulty: 2,
  mentalSignature: {
    fortitude: 30, // Low sustained effort
    focus: 20, // Minimal focus needed
    creativity: 10, // Low creativity required
    attentionSpan: 85,
    processingSpeed: 10,
    workingMemory: 15,
    extraversion: 10,
    openness: 40,
    conscientiousness: 30,
    agreeableness: 70,
    neuroticism: 20,
    intellect: 50,
  },
  reward: {
    Wisdom: { amount: 2, influence: 1, chance: 0.1 },
    Clarity: { amount: 3, influence: 1, chance: 1 },
    Focus: { amount: 4, influence: 1, chance: 0.8 },
    Insight: { amount: 1, influence: 0.1, chance: 0.3 },
  },
  interestBonus: ["self-discovery", "solitude"],
  description: "Quiet reflection, internal focus",
  requiredSkills: [],
  recomendedSkills: [],
});

export const dummy = new AActivity("Dummy task", {
  label: "Dummy task",
  color: "#9ca3af",
  baseDifficulty: 0,
  mentalSignature: {
    attentionSpan: 50,
    processingSpeed: 20,
    workingMemory: 10,
    fortitude: 10,
    creativity: 10,
    focus: 10,
    intellect: 50,
    openness: 1,
    conscientiousness: 1,
    extraversion: 1,
    agreeableness: 1,
    neuroticism: 1,
  },
  reward: {
    Money: { amount: 5, influence: 0.01, chance: 1 },
    socialExperience: { amount: 1, influence: 0.01, chance: 0.2 },
    Beauty: { amount: 2, influence: 1, chance: 0.5 },
  },
  interestBonus: [],
  description: "A task with no requirements",
  requiredSkills: [],
  recomendedSkills: [],
});

export const AllActivities = Array<AActivity>(
  research,
  community,
  creative,
  minfulness,
  dummy,
);
