import type { CharacterTraits } from "./Data";

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
