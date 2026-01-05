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
