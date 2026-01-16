import type {
  ACharacter,
  CharacterData,
  CharacterTraits,
} from "../data/Characters";
import type { Resource } from "../data/Resources";
import type { AActivity, ActivityData } from "../data/Activities";

export const sineWaveGenerator = (
  t: number,
  { amplitude = 100, frequency = 100, phase = 0, verticalShift = 0 },
) => {
  return (
    (amplitude / 100) *
      Math.sin(2 * Math.PI * (frequency / 100) * t + phase / 10) +
    verticalShift / 100
  );
};

export const makeAttentionSpanWave = (
  t: number,
  { attentionSpan, agreeableness, processingSpeed }: CharacterTraits,
) => {
  // Square wave for attention span
  return (
    (Math.sign(
      sineWaveGenerator(t, {
        amplitude: 100,
        frequency: processingSpeed,
        phase: 20,
        verticalShift: agreeableness,
      }),
    ) *
      attentionSpan) /
    100
  );
};

export const makeDivergentThinkingWave = (
  t: number,
  { creativity, fortitude, extraversion, openness }: CharacterTraits,
) => {
  return sineWaveGenerator(t, {
    amplitude: fortitude,
    frequency: (creativity + 0.2) * 0.8,
    phase: extraversion * 0.3,
    verticalShift: openness,
  });
};

export const makeConvergentThinkingWave = (
  t: number,
  { focus, fortitude, conscientiousness, neuroticism }: CharacterTraits,
) => {
  return sineWaveGenerator(t, {
    amplitude: fortitude,
    frequency: focus * 0.3,
    phase: conscientiousness * 0.3,
    verticalShift: neuroticism,
  });
};

export const sumTraits = (a: CharacterTraits, b: CharacterTraits) => {
  return Object.keys(a).reduce((output, key) => {
    const typedKey = key as keyof CharacterTraits;
    output[typedKey] = a[typedKey] + b[typedKey];
    return output;
  }, {} as CharacterTraits);
};

export const subtractTraits = (a: CharacterTraits, b: CharacterTraits) => {
  return Object.keys(a).reduce((output, key) => {
    const typedKey = key as keyof CharacterTraits;
    output[typedKey] = a[typedKey] - b[typedKey];
    return output;
  }, {} as CharacterTraits);
};

export const compareTraits = (a: CharacterTraits, b: CharacterTraits) => {
  return (Object.keys(a) as Array<keyof CharacterTraits>).every(
    (key) => a[key] === b[key],
  );
};

export const traitsToWave = (
  t: number,
  {
    fortitude,
    attentionSpan,
    focus,
    creativity,
    extraversion,
    openness,
    neuroticism,
    conscientiousness,
    agreeableness,
    processingSpeed,
  }: CharacterTraits,
) => {
  const harmonics = [
    makeConvergentThinkingWave(t, {
      focus,
      fortitude,
      conscientiousness,
      neuroticism,
    } as CharacterTraits),
    makeDivergentThinkingWave(t, {
      creativity,
      fortitude,
      extraversion,
      openness,
    } as CharacterTraits),
    makeAttentionSpanWave(t, {
      attentionSpan,
      agreeableness,
      processingSpeed,
    } as CharacterTraits),
  ];

  let value = 0;
  let totalHarmonics = 0;

  harmonics.forEach((harmonic) => {
    value += harmonic;
    totalHarmonics++;
  });

  return value / totalHarmonics;
};
export const keyToName = (name: string) => {
  return name.replace(/([A-Z])/g, " $1").trim();
};

/**
 *Generate reward based on resonance
 */
export const calculateReward = (
  char: ACharacter,
  activity: AActivity,
  resonance: number,
): [Resource, number] => {
  const { traits } = char;
  const baseReward = Math.min(
    1,
    activity.mentalSignature.intellect > traits.intellect
      ? resonance -
          (activity.mentalSignature.intellect - traits.intellect) / 100
      : resonance,
  );
  const interestBonus = hasInterestBonus(char, activity) ? 0.2 : 0;

  const finalProgress = Math.min(Math.max(0, baseReward + interestBonus), 1);

  let selectedResource = "none" as Resource;
  let highestScore = 0;
  Object.entries(activity.reward).forEach(([key, value]) => {
    const score = Math.random() * value.chance;
    if (score > highestScore) {
      selectedResource = key as Resource;
      highestScore = score;
    }
  });

  const finalReward = activity.reward[selectedResource];

  return [
    selectedResource,
    Math.floor(
      (finalReward?.amount ?? 0) *
        (1 - (1 - finalProgress) * (finalReward?.influence ?? 0)),
    ),
  ];
};

/**
 *Calculate how well character traits match activity requirements
 */
export const calculateResonance = (
  t: number,
  charTraits: CharacterTraits,
  actRequirements: CharacterTraits,
) => {
  const charWave = traitsToWave(t, charTraits);
  const maxSamples = 5;

  // Remap the values
  const samples = Math.round(
    ((charTraits.workingMemory - 1) * (maxSamples - 1)) / (100 - 1) + 1,
  );
  let highestResonance = 0;

  for (let i = 0; i < samples; i++) {
    const sampleTime = t - i * 0.15;
    const sampleValue = traitsToWave(sampleTime, actRequirements);
    const difference = Math.abs(charWave - sampleValue);

    const waveAlignment = 1 - difference;
    if (waveAlignment > highestResonance) {
      highestResonance = waveAlignment;
    }
  }

  return Math.max(0, Math.min(1, highestResonance));
};

// export function calculateSuitability(
//   character: ACharacter,
//   activity: AActivity,
// ) {
//   attribute_score = Σ(Math.min(character_value / optimal_value, 1.0)) / count;
//   skill_score = Σ(min(character_skill / optimal_skill, 1.0)) / count;
//   trait_score = 1.0 - Σ(abs(character_trait - preferred_trait)) / count;
//   interest_score =
//     (strong_matches * 1.0 + weak_matches * 0.5 - poor_matches * 0.3) /
//     total_interests;
// }

/**
 * Check interest bonus
 */
export const hasInterestBonus = (
  char: CharacterData,
  activity: ActivityData,
) => {
  return activity.interestBonus.some((interest: string) =>
    char.interests.includes(interest),
  );
};

/**
 *  Generate wave visualization
 */
export const generateVisualWaveData = <T extends object | number>(
  waveFn: (t: number, data: T) => number,
  time: number,
  data: T,
  res: number,
) =>
  Array.from({ length: res }, (_, i) => {
    const t = time - (i / res) * 12;
    return {
      x: res - i,
      y: 50 + waveFn(t, data) * 48,
    };
  });
