import { makeAutoObservable } from "mobx";
import type { ACharacter, CharacterTraits } from "./Characters";
import type { Resource, ResourceData } from "./Resources";
import type { SkillID, SkillRequirement } from "./Skills";

export type ActivityCosts = {
  energy?: number;
  will?: number;
  attention?: number;
  overskudd?: number;
  mentalCapacity?: number;
  socialBattery?: number;
};

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
  costs?: ActivityCosts; // Base costs before skill reductions
  lol?: Partial<Record<SkillID, number>>;
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
  costs?: ActivityCosts;
  rewardInterval = 0.05; // 3 minutes
  mastery = 0; // determines mental adaption
  previousIntervalTime = 0;
  lol: Partial<Record<SkillID, number>> | undefined;
  masteryThresholds = [
    0, // Level 0 (untrained)
    100, // Level 1 (novice)
    250, // Level 2 (beginner)
    500, // Level 3 (competent)
    1000, // Level 4 (proficient)
    2000, // Level 5 (skilled)
    4000, // Level 6 (expert)
    7000, // Level 7 (master)
    11000, // Level 8 (grandmaster)
    16000, // Level 9 (legendary)
    22000, // Level 10 (transcendent)
  ];

  get intervalTime() {
    if (typeof this.timeToComplete === "number") {
      return this.timeToComplete / this.rewardInterval;
    }
    return 1;
  }

  /**
   * Calculates the effective difficulty of the activity, factoring in required and recommended skills.
   */
  getDifficulty(character: ACharacter): number {
    let difficulty = this.baseDifficulty;
    this.requiredSkills.forEach((req) => {
      const charSkillLevel = character.getSkillLevel(req.id);
      if (charSkillLevel < req.level) {
        difficulty -= (req.level - charSkillLevel) * 2; // Penalty for lacking required skills
      }
      // let tierPenalty = Math.pow(0.85, req.skill.tier - 1);
    });
    this.recomendedSkills.forEach((rec) => {
      const charSkillLevel = character.getSkillLevel(rec.id);
      if (charSkillLevel < rec.level) {
        difficulty -= rec.level - charSkillLevel; // Smaller penalty for lacking recommended skills
      }
    });
    Object.entries(this.lol || {}).forEach(([key, value]) => {
      const charSkillLevel = character.getSkillLevel(key as SkillID);
      difficulty -= charSkillLevel * value;
    });
    return difficulty;
  }

  /**
   * Calculates the effective costs of the activity, factoring in character skills and mastery.
   * Skills reduce costs by 15% per level (up to 75% reduction).
   * Mastery reduces costs by 5% per level (up to 50% reduction).
   */
  getEffectiveCosts(character: ACharacter): ActivityCosts {
    if (!this.costs) {
      return {};
    }

    const effectiveCosts: ActivityCosts = { ...this.costs };

    // Calculate skill reduction (15% per level, max 75%)
    let skillReduction = 0;
    this.requiredSkills.forEach((req) => {
      const charSkillLevel = character.getSkillLevel(req.id);
      skillReduction += Math.min(0.75, charSkillLevel * 0.15);
    });
    this.recomendedSkills.forEach((rec) => {
      const charSkillLevel = character.getSkillLevel(rec.id);
      skillReduction += Math.min(0.75, charSkillLevel * 0.15) * 0.5; // Half effect for recommended
    });
    skillReduction = Math.min(0.75, skillReduction);

    // Calculate mastery reduction (5% per mastery level, max 50%)
    const masteryLevel = character.getActivityMasteryLevel(this);
    const masteryReduction = Math.min(0.5, masteryLevel * 0.05);

    // Apply reductions
    const totalReduction = Math.min(0.9, skillReduction + masteryReduction);
    const multiplier = 1 - totalReduction;

    Object.keys(effectiveCosts).forEach((key) => {
      const typedKey = key as keyof ActivityCosts;
      if (effectiveCosts[typedKey] !== undefined) {
        effectiveCosts[typedKey] = Math.max(
          1,
          Math.floor((effectiveCosts[typedKey] ?? 0) * multiplier),
        );
      }
    });

    return effectiveCosts;
  }

  /**
   * Gets the mastery level based on mastery points (deprecated - use character.getActivityMasteryLevel)
   */
  getMasteryLevel(): number {
    for (let i = this.masteryThresholds.length - 1; i >= 0; i--) {
      if (this.mastery >= this.masteryThresholds[i]) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Get reward multiplier based on mastery level
   */
  getRewardMultiplier(character: ACharacter): number {
    const masteryLevel = character.getActivityMasteryLevel(this);
    // Mastery increases rewards by 2% per level, up to 20%
    return 1 + Math.min(0.2, masteryLevel * 0.02);
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
      costs,
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
    this.costs = costs;
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
  costs: {
    energy: 15,
    will: 12,
    attention: 20,
    mentalCapacity: 18,
    overskudd: 8,
  },
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
  requiredSkills: [{ id: "communication", level: 3 }],
  recomendedSkills: [],
  costs: {
    energy: 20,
    will: 10,
    attention: 15,
    socialBattery: 25,
    overskudd: 12,
  },
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
  requiredSkills: [
    { id: "creativeSynthesis", level: 4 },
    { id: "dataAnalysis", level: 2 },
  ],
  recomendedSkills: [
    { id: "creativeSynthesis", level: 6 },
    { id: "dataAnalysis", level: 4 },
  ],
  lol: { creativeSynthesis: 10, dataAnalysis: 5 },
  costs: {
    energy: 18,
    will: 15,
    attention: 22,
    mentalCapacity: 25,
    overskudd: 10,
  },
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
  costs: {
    energy: 5,
    will: 3,
    attention: 8,
    overskudd: 2,
  },
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
  costs: {
    energy: 2,
    will: 1,
    attention: 2,
    overskudd: 1,
  },
});

export const exercise = new AActivity("Exercise", {
  label: "Exercise",
  color: "#ef4444",
  baseDifficulty: 3,
  mentalSignature: {
    fortitude: 80,
    focus: 40,
    creativity: 20,
    attentionSpan: 50,
    processingSpeed: 60,
    workingMemory: 30,
    intellect: 30,
    extraversion: 40,
    openness: 30,
    conscientiousness: 70,
    agreeableness: 50,
    neuroticism: 20,
  },
  reward: {
    physicalExperience: { amount: 15, influence: 0.8, chance: 1 },
  },
  interestBonus: ["routine"],
  description: "Physical activity to boost energy and mood",
  requiredSkills: [],
  recomendedSkills: [{ id: "grossMotorControl", level: 2 }],
  costs: {
    energy: 25,
    will: 8,
    overskudd: 5,
  },
});

export const cooking = new AActivity("Cooking", {
  label: "Cooking",
  color: "#f97316",
  baseDifficulty: 4,
  mentalSignature: {
    fortitude: 50,
    focus: 60,
    creativity: 50,
    attentionSpan: 65,
    processingSpeed: 55,
    workingMemory: 70,
    intellect: 40,
    extraversion: 30,
    openness: 50,
    conscientiousness: 70,
    agreeableness: 60,
    neuroticism: 40,
  },
  reward: {
    physicalExperience: { amount: 8, influence: 0.7, chance: 0.9 },
  },
  interestBonus: ["cooking", "routine"],
  description: "Prepare nutritious meals",
  requiredSkills: [],
  recomendedSkills: [{ id: "fineMotorControl", level: 3 }],
  costs: {
    energy: 12,
    will: 10,
    attention: 15,
    overskudd: 6,
  },
});

export const reading = new AActivity("Reading", {
  label: "Reading",
  color: "#8b5cf6",
  baseDifficulty: 2,
  mentalSignature: {
    fortitude: 30,
    focus: 50,
    creativity: 40,
    attentionSpan: 70,
    processingSpeed: 45,
    workingMemory: 60,
    intellect: 70,
    extraversion: 20,
    openness: 80,
    conscientiousness: 50,
    agreeableness: 50,
    neuroticism: 30,
  },
  reward: {
    Knowledge: { amount: 8, influence: 0.9, chance: 1 },
    Insight: { amount: 3, influence: 0.8, chance: 0.6 },
    basicExperience: { amount: 5, influence: 0.5, chance: 0.8 },
  },
  interestBonus: ["observation", "solitude"],
  description: "Read books to gain knowledge",
  requiredSkills: [],
  recomendedSkills: [{ id: "observation", level: 2 }],
  costs: {
    energy: 5,
    will: 5,
    attention: 12,
    overskudd: 3,
  },
});

export const socializing = new AActivity("Socializing", {
  label: "Socializing",
  color: "#ec4899",
  baseDifficulty: 3,
  mentalSignature: {
    fortitude: 50,
    focus: 30,
    creativity: 60,
    attentionSpan: 50,
    processingSpeed: 70,
    workingMemory: 75,
    intellect: 50,
    extraversion: 70,
    openness: 60,
    conscientiousness: 40,
    agreeableness: 80,
    neuroticism: 30,
  },
  reward: {
    socialExperience: { amount: 12, influence: 1, chance: 1 },
    Connection: { amount: 6, influence: 1, chance: 0.9 },
  },
  interestBonus: ["social-dynamics", "helping"],
  description: "Spend time with friends",
  requiredSkills: [],
  recomendedSkills: [{ id: "communication", level: 2 }],
  costs: {
    energy: 15,
    will: 8,
    attention: 10,
    socialBattery: 20,
    overskudd: 8,
  },
});

export const writing = new AActivity("Writing", {
  label: "Writing",
  color: "#3b82f6",
  baseDifficulty: 5,
  mentalSignature: {
    fortitude: 50,
    focus: 75,
    creativity: 70,
    attentionSpan: 80,
    processingSpeed: 55,
    workingMemory: 65,
    intellect: 70,
    extraversion: 25,
    openness: 75,
    conscientiousness: 60,
    agreeableness: 45,
    neuroticism: 50,
  },
  reward: {
    creativeExperience: { amount: 12, influence: 0.9, chance: 1 },
    Ideas: { amount: 8, influence: 0.8, chance: 0.9 },
    Insight: { amount: 4, influence: 0.7, chance: 0.7 },
  },
  interestBonus: ["writing", "solitude"],
  description: "Creative writing and expression",
  requiredSkills: [],
  recomendedSkills: [
    { id: "symbolicRepresentation", level: 3 },
    { id: "artisticExpression", level: 2 },
  ],
  costs: {
    energy: 10,
    will: 15,
    attention: 20,
    mentalCapacity: 18,
    overskudd: 10,
  },
});

export const learning = new AActivity("Learning New Skill", {
  label: "Learning New Skill",
  color: "#10b981",
  baseDifficulty: 6,
  mentalSignature: {
    fortitude: 55,
    focus: 70,
    creativity: 50,
    attentionSpan: 75,
    processingSpeed: 60,
    workingMemory: 70,
    intellect: 75,
    extraversion: 30,
    openness: 85,
    conscientiousness: 65,
    agreeableness: 50,
    neuroticism: 40,
  },
  reward: {
    Knowledge: { amount: 10, influence: 1, chance: 1 },
    Insight: { amount: 5, influence: 0.9, chance: 0.8 },
    basicExperience: { amount: 8, influence: 0.7, chance: 1 },
  },
  interestBonus: ["self-discovery", "observation"],
  description: "Study and practice a new skill",
  requiredSkills: [],
  recomendedSkills: [{ id: "observation", level: 3 }],
  costs: {
    energy: 12,
    will: 18,
    attention: 25,
    mentalCapacity: 22,
    overskudd: 12,
  },
});

export const rest = new AActivity("Rest", {
  label: "Rest",
  color: "#6366f1",
  baseDifficulty: 1,
  mentalSignature: {
    fortitude: 20,
    focus: 10,
    creativity: 10,
    attentionSpan: 30,
    processingSpeed: 20,
    workingMemory: 20,
    intellect: 30,
    extraversion: 20,
    openness: 30,
    conscientiousness: 30,
    agreeableness: 50,
    neuroticism: 20,
  },
  reward: {
    Wisdom: { amount: 2, influence: 0.8, chance: 0.6 },
  },
  interestBonus: ["solitude"],
  description: "Take a break and recover",
  requiredSkills: [],
  recomendedSkills: [],
  costs: {
    will: 2,
    overskudd: 1,
  },
});

export const planning = new AActivity("Planning & Organization", {
  label: "Planning & Organization",
  color: "#06b6d4",
  baseDifficulty: 4,
  mentalSignature: {
    fortitude: 40,
    focus: 65,
    creativity: 30,
    attentionSpan: 70,
    processingSpeed: 50,
    workingMemory: 75,
    intellect: 60,
    extraversion: 25,
    openness: 40,
    conscientiousness: 85,
    agreeableness: 50,
    neuroticism: 45,
  },
  reward: {
    organizationalExperience: { amount: 10, influence: 0.9, chance: 1 },
    Plans: { amount: 8, influence: 1, chance: 0.9 },
  },
  interestBonus: ["routine"],
  description: "Organize tasks and make plans",
  requiredSkills: [],
  recomendedSkills: [
    { id: "planning", level: 2 },
    { id: "timeManagement", level: 2 },
  ],
  costs: {
    energy: 8,
    will: 12,
    attention: 18,
    mentalCapacity: 15,
    overskudd: 7,
  },
});

export const art = new AActivity("Artistic Creation", {
  label: "Artistic Creation",
  color: "#a855f7",
  baseDifficulty: 5,
  mentalSignature: {
    fortitude: 45,
    focus: 60,
    creativity: 90,
    attentionSpan: 70,
    processingSpeed: 55,
    workingMemory: 80,
    intellect: 60,
    extraversion: 35,
    openness: 90,
    conscientiousness: 45,
    agreeableness: 50,
    neuroticism: 40,
  },
  reward: {
    creativeExperience: { amount: 15, influence: 0.9, chance: 1 },
    Beauty: { amount: 10, influence: 0.8, chance: 0.9 },
    Ideas: { amount: 6, influence: 0.7, chance: 0.8 },
  },
  interestBonus: ["self-discovery"],
  description: "Create art and express creativity",
  requiredSkills: [],
  recomendedSkills: [
    { id: "artisticExpression", level: 3 },
    { id: "artisticObservation", level: 2 },
  ],
  costs: {
    energy: 12,
    will: 14,
    attention: 20,
    mentalCapacity: 18,
    overskudd: 9,
  },
});

export const problemSolving = new AActivity("Problem Solving", {
  label: "Problem Solving",
  color: "#14b8a6",
  baseDifficulty: 7,
  mentalSignature: {
    fortitude: 60,
    focus: 80,
    creativity: 70,
    attentionSpan: 85,
    processingSpeed: 70,
    workingMemory: 90,
    intellect: 85,
    extraversion: 30,
    openness: 70,
    conscientiousness: 70,
    agreeableness: 45,
    neuroticism: 35,
  },
  reward: {
    analyticalExperience: { amount: 15, influence: 0.9, chance: 1 },
    Insight: { amount: 8, influence: 1, chance: 0.9 },
    Innovation: { amount: 6, influence: 0.9, chance: 0.8 },
    Knowledge: { amount: 5, influence: 0.8, chance: 0.7 },
  },
  interestBonus: ["observation"],
  description: "Solve complex problems",
  requiredSkills: [
    { id: "criticalThinking", level: 3 },
    { id: "logic", level: 2 },
  ],
  recomendedSkills: [
    { id: "dataAnalysis", level: 3 },
    { id: "systemAnalysis", level: 2 },
  ],
  costs: {
    energy: 15,
    will: 20,
    attention: 28,
    mentalCapacity: 25,
    overskudd: 15,
  },
});

export const teaching = new AActivity("Teaching", {
  label: "Teaching",
  color: "#f59e0b",
  baseDifficulty: 5,
  mentalSignature: {
    fortitude: 60,
    focus: 65,
    creativity: 55,
    attentionSpan: 70,
    processingSpeed: 65,
    workingMemory: 80,
    intellect: 75,
    extraversion: 60,
    openness: 70,
    conscientiousness: 75,
    agreeableness: 80,
    neuroticism: 30,
  },
  reward: {
    socialExperience: { amount: 12, influence: 1, chance: 1 },
    Knowledge: { amount: 8, influence: 0.9, chance: 0.9 },
    Reputation: { amount: 5, influence: 0.8, chance: 0.8 },
    Purpose: { amount: 6, influence: 0.7, chance: 0.7 },
  },
  interestBonus: ["helping", "social-dynamics"],
  description: "Teach others and share knowledge",
  requiredSkills: [{ id: "communication", level: 4 }],
  recomendedSkills: [
    { id: "teaching", level: 3 },
    { id: "leadership", level: 2 },
  ],
  costs: {
    energy: 18,
    will: 12,
    attention: 20,
    socialBattery: 15,
    overskudd: 10,
  },
});

export const networking = new AActivity("Networking", {
  label: "Networking",
  color: "#ec4899",
  baseDifficulty: 4,
  mentalSignature: {
    fortitude: 55,
    focus: 40,
    creativity: 60,
    attentionSpan: 55,
    processingSpeed: 75,
    workingMemory: 85,
    intellect: 60,
    extraversion: 80,
    openness: 70,
    conscientiousness: 55,
    agreeableness: 70,
    neuroticism: 25,
  },
  reward: {
    socialExperience: { amount: 10, influence: 1, chance: 1 },
    Connection: { amount: 8, influence: 1, chance: 0.9 },
    Influence: { amount: 5, influence: 0.9, chance: 0.8 },
    Reputation: { amount: 4, influence: 0.8, chance: 0.7 },
  },
  interestBonus: ["social-dynamics"],
  description: "Build professional connections",
  requiredSkills: [{ id: "communication", level: 2 }],
  recomendedSkills: [
    { id: "negotiation", level: 2 },
    { id: "persuasion", level: 2 },
  ],
  costs: {
    energy: 16,
    will: 10,
    attention: 15,
    socialBattery: 22,
    overskudd: 9,
  },
});

export const AllActivities = Array<AActivity>(
  research,
  community,
  creative,
  minfulness,
  dummy,
  exercise,
  cooking,
  reading,
  socializing,
  writing,
  learning,
  rest,
  planning,
  art,
  problemSolving,
  teaching,
  networking,
);
