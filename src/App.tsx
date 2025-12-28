import { useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  activities,
  characters,
  emptyTraits,
  type Activity,
  type Character,
  type CharacterTraits,
  type RewardData,
} from "./Data";
import { Wave } from "./Wave";

const ResonanceSystem = () => {
  const timeStep = 0.15;
  const timeInterval = 50; // ms

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChar, setSelectedChar] = useState(0);
  const [currentTraits, setCurrentTraits] = useState(emptyTraits);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [recentRewards, setRecentRewards] = useState(Array<RewardData>());
  const [showMapping, setShowMapping] = useState(false);
  const [currentResonance, setCurrentResonance] = useState(0);

  const sineWaveGenerator = (
    t: number,
    { amplitude = 100, frequency = 100, phase = 0, verticalShift = 0 },
  ) => {
    return (
      (amplitude / 100) *
        Math.sin(2 * Math.PI * (frequency / 100) * t + phase / 10) +
      verticalShift / 100
    );
  };

  const makeAttentionSpanWave = useCallback(
    (
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
    },
    [],
  );

  const makeDivergentThinkingWave = useCallback(
    (
      t: number,
      { creativity, fortitude, extraversion, openness }: CharacterTraits,
    ) => {
      return sineWaveGenerator(t, {
        amplitude: fortitude,
        frequency: (creativity + 0.2) * 0.8,
        phase: extraversion,
        verticalShift: openness,
      });
    },
    [],
  );

  const makeConvergentThinkingWave = useCallback(
    (
      t: number,
      { focus, fortitude, conscientiousness, neuroticism }: CharacterTraits,
    ) => {
      return sineWaveGenerator(t, {
        amplitude: fortitude,
        frequency: focus * 0.3,
        phase: conscientiousness,
        verticalShift: neuroticism,
      });
    },
    [],
  );

  const traitsToWave = useCallback(
    (
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
      // console.log("Divergence:", divergence);
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
    },
    [
      makeAttentionSpanWave,
      makeConvergentThinkingWave,
      makeDivergentThinkingWave,
    ],
  );

  /**
   *Calculate how well character traits match activity requirements
   */
  const calculateResonance = useCallback(
    (
      charTraits: CharacterTraits,
      actRequirements: CharacterTraits,
      t: number,
    ) => {
      const charWave = traitsToWave(t, charTraits);
      const maxSamples = 5;
      const samples = Math.round(
        ((charTraits.workingMemory - 1) * (maxSamples - 1)) / (100 - 1) + 1,
      );
      let highestResonance = 0;
      console.log(
        samples,
        "samples for working memory",
        charTraits.workingMemory,
      );
      for (let i = 0; i < samples; i++) {
        const sampleTime = t - i * 0.15;
        const sampleValue = traitsToWave(sampleTime, actRequirements);
        const difference = Math.abs(charWave - sampleValue);
        const waveAlignment = 1 - difference;
        if (waveAlignment > highestResonance) {
          highestResonance = waveAlignment;
        }
        console.log(
          "Sample",
          i,
          "Time:",
          sampleTime,
          "Value:",
          sampleValue,
          "Alignment:",
          waveAlignment,
        );
      }

      // // Wave alignment (how close they are at this moment)
      // const difference = Math.abs(charWave - actWave);
      // const waveAlignment = 1 - difference;

      // Weighted combination
      // const resonance = waveAlignment;

      return Math.max(0, Math.min(1, highestResonance));
    },
    [traitsToWave],
  );

  /**
   * Check interest bonus
   */
  const hasInterestBonus = (char: Character, activity: Activity) => {
    return activity.interestBonus.some((interest: string) =>
      char.interests.includes(interest),
    );
  };

  /**
   *Generate reward based on resonance
   */
  const generateReward = useCallback((resonance: number) => {
    // Base reward from resonance (30-100 range)
    const baseReward = resonance * 100;

    // Interest bonus: flat +20 points
    // const interestBonus = hasInterestBonus(char, activity) ? 20 : 0;
    const interestBonus = 20;

    // Add small random variation (±10%) - natural performance fluctuation
    // const variation = (Math.random() - 0.5) * 0.2;
    const finalReward = Math.max(0, baseReward + interestBonus);

    return {
      amount: Math.round(finalReward),
      base: Math.round(baseReward),
      bonus: interestBonus,
      resonance: resonance,
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => t + timeStep);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const activity = activities[selectedActivity];
    const resonance = calculateResonance(
      currentTraits,
      activity.requirements,
      time,
    );

    setCurrentResonance(resonance);
    const reward = generateReward(resonance);

    setRecentRewards((prev) => [
      {
        value: reward.amount,
        base: reward.base,
        bonus: reward.bonus,
        time: Date.now(),
        resonance: reward.resonance,
      },
      ...prev.slice(0, 50),
    ]);
  }, [
    calculateResonance,
    generateReward,
    selectedActivity,
    selectedChar,
    time,
    isRunning,
    currentTraits,
  ]);

  useEffect(() => {
    const char = characters[selectedChar];
    setCurrentTraits(char.traits);
  }, [selectedChar]);

  console.log("Rendering App at time:", time);

  const char = characters[selectedChar];
  const activity = activities[selectedActivity];

  const hasBonus = hasInterestBonus(char, activity);

  // Generate wave visualization
  const points = 400;
  const generateVisualWaveData = <T extends object | number>(
    waveFn: (t: number, data: T) => number,
    time: number,
    data: T,
    points: number,
  ) =>
    Array.from({ length: points }, (_, i) => {
      const t = time - (i / points) * 12;
      return {
        x: points - i,
        y: 50 + waveFn(t, data) * 48,
      };
    });

  const charWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    currentTraits,
    points,
  );
  const actWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    activity.requirements,
    points,
  );

  const divergentThinkingData = generateVisualWaveData(
    makeDivergentThinkingWave,
    time,
    currentTraits,
    points,
  );

  const convergentThinkingData = generateVisualWaveData(
    makeConvergentThinkingWave,
    time,
    currentTraits,
    points,
  );

  const attentionSpanData = generateVisualWaveData(
    makeAttentionSpanWave,
    time,
    currentTraits,
    points,
  );

  const avgReward =
    recentRewards.length > 0
      ? Math.round(
          recentRewards.reduce((sum, r) => sum + r.value, 0) /
            recentRewards.length,
        )
      : 0;

  return (
    <div className="bg-base-200 mx-auto w-full max-w-6xl">
      <div className="card card-border bg-base-100 mb-6 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">Trait-Based Resonance System</h1>
          <p className="mb-3">
            Character traits create unique mental rhythms. Observe performance
            to learn compatibility.
          </p>
          <div className="card-actions">
            <button
              onClick={() => setShowMapping(!showMapping)}
              className="btn btn-info btn-soft"
            >
              <Info className="size-4" />
              {showMapping ? "Hide" : "Show"} trait-to-wave mapping
            </button>
          </div>
        </div>
      </div>

      {showMapping && (
        <div className="card bg-neutral card-outline mb-6">
          <div className="card-body grid grid-cols-1 md:grid-cols-2">
            <h3 className="card-title">How Traits Map to Wave Properties:</h3>
            <div>
              <strong>Mental Stamina → Frequency</strong>
              <p className="mt-1 text-xs">
                Higher stamina = faster, more energetic rhythm
              </p>
            </div>
            <div>
              <strong>Convergent Thinking → Amplitude</strong>
              <p className="mt-1 text-xs">
                Higher focus = stronger, more pronounced output
              </p>
            </div>
            <div>
              <strong>Divergent Thinking → Harmonics</strong>
              <p className="mt-1 text-xs">
                Higher creativity = more complex wave patterns
              </p>
            </div>
            <div>
              <strong>Openness → Phase Offset</strong>
              <p className="mt-1 text-xs">
                Affects starting point and adaptability
              </p>
            </div>
            <div>
              <strong>Processing Speed → Smoothness</strong>
              <p className="mt-1 text-xs">
                How clean and efficient their output is
              </p>
            </div>
            <div>
              <strong>Interests → Flat Bonus</strong>
              <p className="mt-1 text-xs">
                +20 points when matched with activity
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card card-outline bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Character</h2>
            {characters.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedChar(idx)}
                className={`flex w-full gap-6 rounded-lg p-3 ${
                  selectedChar === idx
                    ? "border-2"
                    : "bg-neutral border-neutral hover:bg-neutral-active border-2"
                }`}
                style={{
                  backgroundColor:
                    selectedChar === idx ? `${c.color}15` : undefined,
                  borderColor: selectedChar === idx ? c.color : undefined,
                }}
              >
                <div
                  className="avatar avatar-placeholder"
                  style={{ borderColor: c.color }}
                >
                  <div
                    className="w-18 rounded-full border-2"
                    style={{
                      borderColor: c.color,
                      backgroundColor: c.color + "33",
                    }}
                  >
                    <span className="text-3xl" style={{ color: c.color }}>
                      {c.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="text-left transition-colors">
                  <div className="text-xl font-semibold">{c.name}</div>
                  <div className="mt-1 opacity-70">{c.description}</div>
                  <div className="text-secondary mt-1 text-xs">
                    Interests: {c.interests.join(", ")}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card card-outline bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Activity
            </h2>
            <div className="space-y-2">
              {activities.map((a, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedActivity(idx)}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    selectedActivity === idx
                      ? "border-2"
                      : "border-2 border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor:
                      selectedActivity === idx ? `${a.color}15` : undefined,
                    borderColor: selectedActivity === idx ? a.color : undefined,
                  }}
                >
                  <div className="font-semibold text-gray-800">{a.name}</div>
                  <div className="mt-1 text-xs text-gray-600">
                    {a.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Mental Rhythm Patterns (Hidden from Player)
        </h2>
        <svg viewBox="0 0 400 100" className="h-48 w-full rounded bg-gray-50">
          <line
            x1="-50"
            y1="50"
            x2="450"
            y2="50"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <polyline
            points={charWaveData.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={char.color}
            strokeWidth="2.5"
          />
          <polyline
            points={actWaveData.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={activity.color}
            strokeWidth="2.5"
            strokeDasharray="5 3"
          />
        </svg>
        <div className="mt-3 flex justify-between text-sm">
          <span style={{ color: char.color }} className="font-medium">
            ■ {char.name}'s rhythm
          </span>
          <span style={{ color: activity.color }} className="font-medium">
            ▪▪▪ {activity.name} demands
          </span>
        </div>
      </div>

      {/* Simulation */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Performance Simulation
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setTime(0);
                setRecentRewards([]);
                setIsRunning(false);
              }}
              className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              onClick={() => setTime((prev) => prev + timeStep)}
            >
              Step
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Reward Display */}
        <div className="mb-4 rounded-lg border-2 border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50 p-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-gray-700">
              Resources Generated
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-bold text-amber-600">
              {recentRewards.length > 0 ? recentRewards[0].value : "--"}
            </div>
            {hasBonus && (
              <div className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                +{recentRewards.length > 0 ? recentRewards[0].bonus : 20}{" "}
                Interest Bonus!
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-between text-sm text-gray-600">
            <div>
              Average (last 15):{" "}
              <span className="font-semibold text-gray-800">{avgReward}</span>
            </div>
            <div className="text-xs text-gray-500">
              Resonance: {(currentResonance * 100).toFixed(1)}% (hidden)
            </div>
          </div>
        </div>

        {/* Reward Stream */}
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Resource Stream (What player sees):
          </div>
          <div className="flex flex-wrap gap-2">
            {recentRewards.map((reward, idx) => (
              <div
                key={reward.time}
                className="rounded-lg px-3 py-2 text-sm font-bold shadow-sm"
                style={{
                  backgroundColor:
                    reward.resonance > 0.65
                      ? "#86efac"
                      : reward.resonance > 0.45
                        ? "#fde047"
                        : "#fca5a5",
                  opacity: 1 - idx * 0.05,
                }}
              >
                {reward.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Wave
        points={divergentThinkingData}
        title="Divergent Thinking"
        color={char.color}
      >
        <label className="input m-auto w-10/12">
          <span className="label">
            Creativity:
            {currentTraits.creativity}
          </span>
          <input
            className="range range-accent w-full"
            min={0}
            max={100}
            value={currentTraits.creativity}
            onChange={(event) =>
              setCurrentTraits((prev) => ({
                ...prev,
                creativity: Number(event.target.value),
              }))
            }
            type="range"
          />
        </label>
        <label>
          Fortitude:
          {currentTraits.fortitude}
          <input
            className="w-full"
            min={0}
            max={100}
            value={currentTraits.fortitude}
            onChange={(event) =>
              setCurrentTraits((prev) => ({
                ...prev,
                fortitude: Number(event.target.value),
              }))
            }
            type={"range"}
          />
        </label>
        <label>
          Openness:
          {currentTraits.openness}
          <input
            className="w-full"
            min={-100}
            max={100}
            value={currentTraits.openness}
            onChange={(event) =>
              setCurrentTraits((prev) => ({
                ...prev,
                openness: Number(event.target.value),
              }))
            }
            type={"range"}
          />
        </label>
        <label>
          Extraversion:
          {currentTraits.extraversion}
          <input
            className="w-full"
            min={0}
            max={100}
            value={currentTraits.extraversion}
            onChange={(event) =>
              setCurrentTraits((prev) => ({
                ...prev,
                extraversion: Number(event.target.value),
              }))
            }
            type={"range"}
          />
        </label>
      </Wave>

      <Wave
        points={convergentThinkingData}
        title="Convergent Thinking"
        color={char.color}
      >
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          <div className="m-auto w-10/12">
            <label>
              Focus: {currentTraits.focus}
              <input
                className="w-full"
                min={0}
                max={100}
                value={currentTraits.focus}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    focus: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
            <label>
              Fortitude: {currentTraits.fortitude}
              <input
                className="w-full"
                min={0}
                max={100}
                value={currentTraits.fortitude}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    fortitude: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
            <label>
              Conscientiousness: {currentTraits.conscientiousness}
              <input
                className="w-full"
                min={0}
                max={100}
                value={currentTraits.conscientiousness}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    conscientiousness: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
            <label>
              Neuroticism: {currentTraits.neuroticism}
              <input
                className="w-full"
                min={-100}
                max={100}
                value={currentTraits.neuroticism}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    neuroticism: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
          </div>
        </div>
      </Wave>

      <Wave
        points={attentionSpanData}
        title="Attention Span"
        color={char.color}
      >
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          <div className="m-auto w-10/12">
            <label>
              Attention Span: {currentTraits.attentionSpan}
              <input
                className="w-full"
                min={0}
                max={100}
                value={currentTraits.attentionSpan}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    attentionSpan: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
            <label>
              Processing Speed: {currentTraits.processingSpeed}
              <input
                className="w-full"
                min={0}
                max={100}
                value={currentTraits.processingSpeed}
                onChange={(event) =>
                  setCurrentTraits((prev) => ({
                    ...prev,
                    processingSpeed: Number(event.target.value),
                  }))
                }
                type={"range"}
              />
            </label>
          </div>
        </div>
      </Wave>

      {/* Design Notes */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
        <h3 className="mb-3 font-semibold text-purple-900">
          Design Implementation Notes:
        </h3>
        <div className="space-y-3 text-sm text-purple-900">
          <div>
            <strong>Player Experience:</strong> Players only see the resource
            numbers bubbling up. Through observation over time, they learn
            "Elling is good at research" without ever seeing his stats.
          </div>
          <div>
            <strong>Trait Discovery:</strong> The wave properties encode traits
            invisibly. High stamina characters produce faster, more consistent
            streams. High creativity produces more variable but potentially
            higher peaks.
          </div>
          <div>
            <strong>Interest System:</strong> Flat +20 bonus is immediately
            noticeable ("Why did that give more?") and encourages players to
            remember character backgrounds.
          </div>
          <div>
            <strong>Tuning Balance:</strong> Good fits average 70-90 points. Bad
            fits average 35-55 points. Clear enough to learn, but variation
            prevents it feeling "solved."
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResonanceSystem;
