export type CharacterTraits = {
  attentionSpan: number;
  processingSpeed: number;
  workingMemory: number;
  fortitude: number;
  creativity: number;
  focus: number;
  intellect: number;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export type Activity = {
  name?: string;
  color?: string;
  requirements: CharacterTraits;
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

export const emptyWave: WaveDefiniton = {
  frequency: 0,
  amplitude: 0,
  harmonics: Array<number>(),
  phase: 0,
  smoothness: 0,
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

export const emptyTraits: CharacterTraits = {
  attentionSpan: 0,
  processingSpeed: 0,
  workingMemory: 0,
  fortitude: 0,
  creativity: 0,
  focus: 0,
  intellect: 1,
  openness: 0,
  conscientiousness: 0,
  extraversion: 0,
  agreeableness: 0,
  neuroticism: 0,
};

// Characters with cognitive and personality traits
export const characters: Character[] = [
  {
    name: "Test Dummy",
    color: "#f0f",
    traits: {
      attentionSpan: 50,
      processingSpeed: 20,
      workingMemory: 10,
      fortitude: 10,
      creativity: 10,
      focus: 10,
      intellect: 50,
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    },
    interests: ["routine", "observation"],
    description: "Balanced, neutral character for testing",
  },
  {
    name: "Elling",
    color: "#3b82f6",
    traits: {
      // Cognitive traits
      attentionSpan: 45,
      processingSpeed: 60,
      workingMemory: 70,
      fortitude: 40, // → frequency (low stamina = slow, deliberate)
      creativity: 75, // → harmonics complexity
      focus: 55, // → amplitude (focused output)
      intellect: 50,
      openness: 70,
      conscientiousness: 60,
      extraversion: 30,
      agreeableness: 50,
      neuroticism: 65,
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
      fortitude: 70, // → high stamina = consistent pace
      creativity: 40,
      focus: 65, // → strong focused output
      intellect: 20,
      openness: 40,
      conscientiousness: 80,
      extraversion: 50,
      agreeableness: 70,
      neuroticism: 30,
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
      fortitude: 60, // → good stamina = adaptive rhythm
      creativity: 80, // → complex thinking patterns
      focus: 70, // → strong execution
      intellect: 70,
      openness: 85,
      conscientiousness: 55,
      extraversion: 60,
      agreeableness: 40,
      neuroticism: 25,
    },
    interests: ["self-discovery", "social-dynamics", "independence"],
    description: "Dynamic, adaptable, thrives on variety",
  },
];

export const activities: Activity[] = [
  {
    name: "Research & Documentation",
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
    description: "Detailed work requiring focus and organization",
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
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    },
    interestBonus: [],
    description: "A task with no requirements",
  },
];
