import type { CharacterTraits } from "./Characters";
import type { Resource, ResourceData } from "./Resources";

export type Activity = {
  name?: string;
  color?: string;
  requirements: CharacterTraits;
  interestBonus: string[];
  description?: string;
  reward: Partial<Record<Resource, ResourceData>>;
};

export const activities: Activity[] = [
  {
    name: "Research & Documentation",
    description: "Detailed work requiring focus and organization",
    color: "#f59e0b",
    requirements: {
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
      AnalyticalExperience: { amount: 10, influence: 0.2, chance: 0.5 },
      Research: { amount: 13, influence: 1, chance: 1 },
    },
  },
  {
    name: "Community Outreach",
    color: "#ec4899",
    requirements: {
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
      SocialExperience: { amount: 80, influence: 0.5, chance: 1 },
      Connection: { amount: 40, influence: 0.6, chance: 0.9 },
      Reputation: { amount: 30, influence: 0.8, chance: 0.8 },
      Trust: { amount: 25, influence: 0.4, chance: 0.7 },
      Popularity: { amount: 20, influence: 0.2, chance: 0.6 },
    },
    interestBonus: ["helping", "social-dynamics"],
    description: "High energy, varied interactions",
  },
  {
    name: "Routine Maintenance",
    color: "#6366f1",
    requirements: {
      fortitude: 50, // Moderate sustained effort
      focus: 60, // Consistent execution
      creativity: 100, // Don't need creativity
      attentionSpan: 50,
      processingSpeed: 40,
      workingMemory: 30, // Prefer consistency
      intellect: 30,
      extraversion: 20,
      openness: 30,
      conscientiousness: 80,
      agreeableness: 60,
      neuroticism: 50,
    },
    reward: {
      Order: { amount: 11, influence: 1, chance: 1 },
      Momentum: { amount: 3, influence: 1, chance: 0.9 },
      Infrastructure: { amount: 5, influence: 0.8, chance: 0.6 },
      Reputation: { amount: 2, influence: 0.2, chance: 0.5 },
    },
    interestBonus: ["routine", "cooking"],
    description: "Consistent, predictable rhythm",
  },
  {
    name: "Creative Problem-Solving",
    color: "#14b8a6",
    requirements: {
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
      AnalyticalExperience: { amount: 3, influence: 1, chance: 1 },
      Research: { amount: 4, influence: 1, chance: 0.5 },
      Knowledge: { amount: 2, influence: 1, chance: 0.7 },
    },
    interestBonus: ["self-discovery", "observation"],
    description: "Bursts of insight, unpredictable flow",
  },
  {
    name: "Mindfulness Meditation",
    color: "#22c55e",
    requirements: {
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
  },
  {
    name: "Dummy task",
    color: "#9ca3af",
    requirements: {
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
      SocialExperience: { amount: 1, influence: 0.01, chance: 0.2 },
      Beauty: { amount: 2, influence: 1, chance: 0.5 },
    },
    interestBonus: [],
    description: "A task with no requirements",
  },
];
