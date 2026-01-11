import { makeAutoObservable } from "mobx";
import type { CharacterTraits } from "./Characters";

export type TalentEffectConfig = {
  traitModifiers?: Partial<CharacterTraits>;
  resourceMultiplier?: number;
  resonanceBonus?: number;
};

/**
 * Base Talent class that can be extended for different talent types
 */
export class Talent {
  readonly name: string;
  readonly description: string;
  readonly maxPoints: number;
  readonly effectConfig: TalentEffectConfig;
  points = 0;

  get Points() {
    return this.points;
  }

  constructor(
    name: string,
    description: string,
    effectConfig: TalentEffectConfig,
    maxPoints = 5,
  ) {
    makeAutoObservable(this);
    this.name = name;
    this.description = description;
    this.maxPoints = maxPoints;
    this.effectConfig = effectConfig;
  }

  update(time: number) {
    this.points += time;
  }

  /**
   * Add points to the talent
   */
  addPoint(): boolean {
    if (this.points < this.maxPoints) {
      this.points++;
      return true;
    }
    return false;
  }

  /**
   * Remove points from the talent
   */
  removePoint(): boolean {
    if (this.points > 0) {
      this.points--;
      return true;
    }
    return false;
  }

  /**
   * Get effective trait modifiers based on current points
   */
  getActiveModifiers(): Partial<CharacterTraits> {
    const modifiers: Partial<CharacterTraits> = {};
    const baseModifiers = this.effectConfig.traitModifiers;

    if (baseModifiers) {
      (Object.keys(baseModifiers) as Array<keyof CharacterTraits>).forEach(
        (key) => {
          const baseValue = baseModifiers[key] ?? 0;
          modifiers[key] = (baseValue * this.points) / this.maxPoints;
        },
      );
    }

    return modifiers;
  }

  /**
   * Get active resonance bonus based on current points
   */
  getActiveResonanceBonus(): number {
    const baseBonus = this.effectConfig.resonanceBonus ?? 0;
    return (baseBonus * this.points) / this.maxPoints;
  }

  /**
   * Get active resource multiplier based on current points
   */
  getActiveResourceMultiplier(): number {
    const baseMultiplier = this.effectConfig.resourceMultiplier ?? 1;
    return 1 + (baseMultiplier - 1) * (this.points / this.maxPoints);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    return (this.points / this.maxPoints) * 100;
  }
}

// Mental Focus Tree
export class MentalAgility extends Talent {
  constructor() {
    super(
      "Mental Agility",
      "Increases processing speed and reduces mental fatigue",
      {
        traitModifiers: {
          processingSpeed: 5,
          focus: 3,
        },
        resonanceBonus: 0.05,
      },
    );
  }
}

export class DeepFocus extends Talent {
  constructor() {
    super(
      "Deep Focus",
      "Enhance your ability to maintain concentration on complex tasks",
      {
        traitModifiers: {
          focus: 8,
          attentionSpan: 5,
        },
      },
    );
  }
}

export const MemoryMastery2 = new Talent(
  "Memory Mastery",
  "Expand your working memory capacity",
  {
    traitModifiers: {
      workingMemory: 10,
      intellect: 3,
    },
  },
);

export class MemoryMastery extends Talent {
  constructor() {
    super("Memory Mastery", "Expand your working memory capacity", {
      traitModifiers: {
        workingMemory: 10,
        intellect: 3,
      },
    });
  }
}

// Cognitive Flexibility Tree
export class CreativeMind extends Talent {
  constructor() {
    super(
      "Creative Mind",
      "Unlock new possibilities through divergent thinking",
      {
        traitModifiers: {
          creativity: 8,
          openness: 6,
        },
        resonanceBonus: 0.08,
      },
    );
  }
}

export class MentalFlexibility extends Talent {
  constructor() {
    super("Mental Flexibility", "Adapt quickly to changing circumstances", {
      traitModifiers: {
        openness: 7,
        processingSpeed: 4,
        focus: 4,
      },
    });
  }
}

// Resilience Tree
export class MentalFortitude extends Talent {
  constructor() {
    super(
      "Mental Fortitude",
      "Strengthen your mental resilience under pressure",
      {
        traitModifiers: {
          fortitude: 10,
          conscientiousness: 4,
        },
        resonanceBonus: 0.06,
      },
    );
  }
}

export class StressResilience extends Talent {
  constructor() {
    super(
      "Stress Resilience",
      "Reduce the impact of negative emotions on performance",
      {
        traitModifiers: {
          neuroticism: -5,
          fortitude: 6,
        },
        resonanceBonus: 0.04,
      },
    );
  }
}

// Social Intelligence Tree
export class Empathy extends Talent {
  constructor() {
    super("Empathy", "Better understand and resonate with others", {
      traitModifiers: {
        agreeableness: 8,
        openness: 5,
      },
      resourceMultiplier: 1.1,
    });
  }
}

export class CharismaticPresence extends Talent {
  constructor() {
    super("Charismatic Presence", "Naturally draw others to you", {
      traitModifiers: {
        extraversion: 10,
        agreeableness: 4,
      },
      resourceMultiplier: 1.15,
    });
  }
}

// Analytical Tree
export class LogicalMind extends Talent {
  constructor() {
    super("Logical Mind", "Excel at systematic problem-solving", {
      traitModifiers: {
        intellect: 10,
        focus: 5,
      },
    });
  }
}

export class PatternRecognition extends Talent {
  constructor() {
    super("Pattern Recognition", "Spot patterns and connections others miss", {
      traitModifiers: {
        intellect: 6,
        processingSpeed: 8,
        openness: 4,
      },
      resonanceBonus: 0.07,
    });
  }
}

// Utility Talents
export class RhythmicBalance extends Talent {
  constructor() {
    super(
      "Rhythmic Balance",
      "Synchronize your natural rhythms with your activities",
      {
        traitModifiers: {
          conscientiousness: 3,
        },
        resonanceBonus: 0.12,
      },
    );
  }
}

export class EndlessEndurance extends Talent {
  constructor() {
    super("Endless Endurance", "Push through fatigue and maintain output", {
      traitModifiers: {
        fortitude: 7,
        conscientiousness: 7,
      },
      resourceMultiplier: 1.2,
    });
  }
}

/**
 * Factory function to create all talent instances
 */
export const createAllTalents = (): Talent[] => [
  new MentalAgility(),
  new DeepFocus(),
  new MemoryMastery(),
  new CreativeMind(),
  new MentalFlexibility(),
  new MentalFortitude(),
  new StressResilience(),
  new Empathy(),
  new CharismaticPresence(),
  new LogicalMind(),
  new PatternRecognition(),
  new RhythmicBalance(),
  new EndlessEndurance(),
];
