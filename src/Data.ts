export type CharacterTraits = {
  attentionSpan: number;
  processingSpeed: number;
  workingMemory: number;
  mentalStamina: number;
  divergentThinking: number;
  convergentThinking: number;
  conscientiousness: number;
  openness: number;
  stability: number;
  sociability: number;
  assertiveness: number;
};

export type ActivityRequirements = {
  mentalStamina: number;
  convergentThinking: number;
  divergentThinking: number;
  attentionSpan: number;
  processingSpeed: number;
  openness: number;
};

export type Activity = {
  name?: string;
  color?: string;
  requirements: ActivityRequirements;
  interestBonus: string[];
  description?: string;
};

export type WaveDefiniton = {
  frequency: number;
  amplitude: number;
  harmonics: number[];
  phase: number;
  smoothness: number;
};

export type Character = {
  name: string;
  color: string;
  traits: CharacterTraits;
  interests: string[];
  description?: string;
};

export type RewardData = {
  value: number;
  base: number;
  bonus: number;
  time: number;
  resonance: number;
};

// Characters with cognitive and personality traits
export const characters: Character[] = [
  {
    name: "Elling",
    color: "#3b82f6",
    traits: {
      // Cognitive traits
      attentionSpan: 45,
      processingSpeed: 60,
      workingMemory: 70,
      mentalStamina: 40, // → frequency (low stamina = slow, deliberate)
      divergentThinking: 75, // → harmonics complexity
      convergentThinking: 55, // → amplitude (focused output)

      // Personality traits
      conscientiousness: 50,
      openness: 80, // → phase variation
      stability: 35,
      sociability: 25,
      assertiveness: 30,
    },
    interests: ["writing", "observation", "solitude"],
    description: "Anxious, creative, needs routine with breaks",
  },
  {
    name: "Kjell-Bjarne",
    color: "#10b981",
    traits: {
      attentionSpan: 55,
      processingSpeed: 50,
      workingMemory: 60,
      mentalStamina: 70, // → high stamina = consistent pace
      divergentThinking: 40,
      convergentThinking: 65, // → strong focused output

      conscientiousness: 65,
      openness: 50,
      stability: 70,
      sociability: 60,
      assertiveness: 55,
    },
    interests: ["cooking", "routine", "helping"],
    description: "Steady, reliable, prefers consistent pace",
  },
  {
    name: "Nora",
    color: "#8b5cf6",
    traits: {
      attentionSpan: 70,
      processingSpeed: 75,
      workingMemory: 65,
      mentalStamina: 60, // → good stamina = adaptive rhythm
      divergentThinking: 80, // → complex thinking patterns
      convergentThinking: 70, // → strong execution

      conscientiousness: 60,
      openness: 85, // → high adaptability
      stability: 55,
      sociability: 70,
      assertiveness: 75,
    },
    interests: ["self-discovery", "social-dynamics", "independence"],
    description: "Dynamic, adaptable, thrives on variety",
  },
  {
    name: "Test Dummy",
    color: "#f0f",
    traits: {
      attentionSpan: 0,
      processingSpeed: 0,
      workingMemory: 0,
      mentalStamina: 0,
      divergentThinking: 0,
      convergentThinking: 0,
      conscientiousness: 0,
      openness: 0,
      stability: 0,
      sociability: 0,
      assertiveness: 0,
    },
    interests: ["routine", "observation"],
    description: "Balanced, neutral character for testing",
  },
];

export const activities: Activity[] = [
  {
    name: "Research & Documentation",
    color: "#f59e0b",
    requirements: {
      mentalStamina: 45, // Requires moderate sustained effort
      convergentThinking: 70, // High focus needed
      divergentThinking: 40, // Some creativity helps
      attentionSpan: 75,
      processingSpeed: 50,
      openness: 45,
    },
    interestBonus: ["writing", "observation"],
    description: "Detailed work requiring focus and organization",
  },
  {
    name: "Community Outreach",
    color: "#ec4899",
    requirements: {
      mentalStamina: 65, // Draining, high energy output
      convergentThinking: 40, // Less about precision
      divergentThinking: 70, // Need to adapt to people
      attentionSpan: 60,
      processingSpeed: 70, // Quick reactions
      openness: 80, // Must be flexible
    },
    interestBonus: ["helping", "social-dynamics"],
    description: "High energy, varied interactions",
  },
  {
    name: "Routine Maintenance",
    color: "#6366f1",
    requirements: {
      mentalStamina: 50, // Moderate sustained effort
      convergentThinking: 60, // Consistent execution
      divergentThinking: 20, // Don't need creativity
      attentionSpan: 50,
      processingSpeed: 40,
      openness: 30, // Prefer consistency
    },
    interestBonus: ["routine", "cooking"],
    description: "Consistent, predictable rhythm",
  },
  {
    name: "Creative Problem-Solving",
    color: "#14b8a6",
    requirements: {
      mentalStamina: 55, // Intense bursts
      convergentThinking: 50, // Need to execute ideas
      divergentThinking: 85, // High creativity required
      attentionSpan: 65,
      processingSpeed: 60,
      openness: 90, // Must think outside box
    },
    interestBonus: ["self-discovery", "observation"],
    description: "Bursts of insight, unpredictable flow",
  },
];
