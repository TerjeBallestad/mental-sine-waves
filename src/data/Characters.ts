export type CharacterTraits = {
  workingMemory: number; //yes
  intellect: number; //yes
  agreeableness: number; //no
  attentionSpan: number; //yes
  processingSpeed: number; //yes
  fortitude: number; //yes
  creativity: number; //yes
  focus: number; //yes
  openness: number; //yes
  conscientiousness: number; //yes
  extraversion: number; //yes
  neuroticism: number; //yes
};

export type Character = {
  name: string;
  color: string;
  traits: CharacterTraits;
  interests: string[];
  description?: string;
};

export const emptyTraits: CharacterTraits = {
  attentionSpan: 0,
  processingSpeed: 0,
  workingMemory: 0,
  fortitude: 0,
  creativity: 0,
  focus: 0,
  intellect: 0,
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
    color: "#ff00ff",
    traits: {
      attentionSpan: 50,
      processingSpeed: 20,
      workingMemory: 10,
      fortitude: 10,
      creativity: 10,
      focus: 10,
      intellect: 20,
      openness: 1,
      conscientiousness: 1,
      extraversion: 1,
      agreeableness: 1,
      neuroticism: 1,
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
