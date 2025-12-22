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
  emptyWave,
  type Activity,
  type ActivityRequirements,
  type Character,
  type CharacterTraits,
  type RewardData,
  type WaveDefiniton,
} from "./Data";
import { Wave } from "./Wave";

const ResonanceSystem = () => {
  const timeStep = 0.15;
  const timeInterval = 100; // ms

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChar, setSelectedChar] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [recentRewards, setRecentRewards] = useState(Array<RewardData>());
  const [showMapping, setShowMapping] = useState(false);
  const [currentResonance, setCurrentResonance] = useState(0);
  const [charParams, setCharParams] = useState(emptyWave);
  const [actParams, setActParams] = useState(emptyWave);
  const [currentAttentionSpan, setCurrentAttentionSpan] = useState(0);
  const [currentConvergentThinking, setCurrentConvergentThinking] = useState(0);
  const [currentDivergentThinking, setCurrentDivergentThinking] = useState(0);

  const makeAttentionSpanWave = (value: number, t: number) => {
    return Math.sign(Math.sin((value / 100) * 0.3 * t));
  };

  const makeDivergentThinkingWave = (value: number, t: number) => {
    return Math.sin((value / 100) * 77 * t);
  };

  const makeConvergentThinkingWave = (value: number, t: number) => {
    return Math.sin((value / 100) * 6 * t);
  };

  /**
   *Convert traits to wave parameters
   */
  const traitsToWaveParams = (
    {
      attentionSpan,
      convergentThinking,
      divergentThinking,
      processingSpeed,
      workingMemory,
    }: ActivityRequirements | CharacterTraits,
    t: number,
  ) => {
    // Mental Stamina → Frequency (higher stamina = faster, more energetic rhythm)

    // Convergent Thinking → Amplitude (focused output strength)

    // Divergent Thinking → Harmonic Complexity
    const divergence = divergentThinking / 100;
    const frequency = 0.2 + (processingSpeed / 100) * 6;

    console.log("Divergence:", divergence);
    const harmonics = [
      makeConvergentThinkingWave(convergentThinking, t),
      makeDivergentThinkingWave(divergentThinking, t),
      makeAttentionSpanWave(attentionSpan, t),
    ];

    // Openness → Phase offset (how they start their cycle)
    const openness = divergentThinking; // Using divergent thinking as a proxy for openness
    const phase = (openness / 100) * Math.PI;

    // Processing Speed affects overall wave smoothness
    const smoothness = workingMemory / 100;
    const amplitude = convergentThinking / 100;

    return { frequency, amplitude, harmonics, phase, smoothness };
  };

  /**
   * Generate wave value at time t
   */
  const generateWave = ({ harmonics }: WaveDefiniton) => {
    let value = 0;
    let totalHarmonics = 0;

    harmonics.forEach((harmonic) => {
      value += harmonic;
      totalHarmonics++;
    });

    // Normalize and apply amplitude
    // return ((amplitude * value) / totalHarmonics) * smoothness;
    // return (Math.sin(6 * t) + Math.sin(amplitude * t + 43 * 77)) / 2;
    return value / totalHarmonics;
  };

  const traitsToWave = (_: WaveDefiniton, t: number) => {
    // Mental Stamina → Frequency (higher stamina = faster, more energetic rhythm)

    // Convergent Thinking → Amplitude (focused output strength)

    // Divergent Thinking → Harmonic Complexity
    // const divergence = divergentThinking / 100;
    // const frequency = 0.2 + (processingSpeed / 100) * 6;

    // console.log("Divergence:", divergence);
    const harmonics = [
      makeConvergentThinkingWave(currentConvergentThinking, t),
      makeDivergentThinkingWave(currentDivergentThinking, t),
      makeAttentionSpanWave(currentAttentionSpan, t),
    ];

    // Openness → Phase offset (how they start their cycle)
    // const openness = divergentThinking; // Using divergent thinking as a proxy for openness
    // const phase = (openness / 100) * Math.PI;

    // Processing Speed affects overall wave smoothness
    // const smoothness = workingMemory / 100;
    // const amplitude = convergentThinking / 100;

    let value = 0;
    let totalHarmonics = 0;

    harmonics.forEach((harmonic) => {
      value += harmonic;
      totalHarmonics++;
    });

    // Normalize and apply amplitude
    // return ((amplitude * value) / totalHarmonics) * smoothness;
    // return (Math.sin(6 * t) + Math.sin(amplitude * t + 43 * 77)) / 2;
    return value / totalHarmonics;
  };

  /**
   *Calculate how well character traits match activity requirements
   */
  const calculateResonance = useCallback(
    (
      charTraits: CharacterTraits,
      actRequirements: ActivityRequirements,
      t: number,
    ) => {
      const charParams = traitsToWaveParams(charTraits, t);
      const actParams = traitsToWaveParams(actRequirements, t);
      setCharParams(charParams);
      setActParams(actParams);
      const charWave = generateWave(charParams);
      const actWave = generateWave(actParams);

      // Wave alignment (how close they are at this moment)
      const difference = Math.abs(charWave - actWave);
      const waveAlignment = 1 - difference;

      // Weighted combination
      const resonance = waveAlignment;

      return Math.max(0, Math.min(1, resonance));
    },
    [],
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
  const generateReward = useCallback(
    (_1: Character, _: Activity, resonance: number) => {
      // Base reward from resonance (30-100 range)
      const baseReward = resonance * 100;

      // Interest bonus: flat +20 points
      // const interestBonus = hasInterestBonus(char, activity) ? 20 : 0;
      const interestBonus = 0;

      // Add small random variation (±10%) - natural performance fluctuation
      // const variation = (Math.random() - 0.5) * 0.2;
      const finalReward = Math.max(0, baseReward + interestBonus);

      return {
        amount: Math.round(finalReward),
        base: Math.round(baseReward),
        bonus: interestBonus,
        resonance: resonance,
      };
    },
    [],
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => t + timeStep);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const char = characters[selectedChar];
    const activity = activities[selectedActivity];
    const resonance = calculateResonance(
      {
        ...char.traits,
        attentionSpan: currentAttentionSpan,
        convergentThinking: currentConvergentThinking,
        divergentThinking: currentDivergentThinking,
      },
      activity.requirements,
      time,
    );
    setCurrentResonance(resonance);
    const reward = generateReward(char, activity, resonance);

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
    currentAttentionSpan,
    calculateResonance,
    generateReward,
    selectedActivity,
    selectedChar,
    time,
    isRunning,
    currentConvergentThinking,
    currentDivergentThinking,
  ]);

  useEffect(() => {
    const char = characters[selectedChar];
    setCurrentAttentionSpan(char.traits.attentionSpan);
    setCurrentConvergentThinking(char.traits.convergentThinking);
    setCurrentDivergentThinking(char.traits.divergentThinking);
  }, [selectedChar]);

  console.log("Rendering App at time:", time);

  const char = characters[selectedChar];
  const activity = activities[selectedActivity];

  const hasBonus = hasInterestBonus(char, activity);

  // Generate wave visualization
  const points = 400;
  const generateVisualWaveData = (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    waveFn: Function,
    data: WaveDefiniton | number,
    points: number,
    time: number,
  ) =>
    Array.from({ length: points }, (_, i) => {
      const t = time - (i / points) * 12;
      return {
        x: 400 - i,
        y: 50 + waveFn(data, t) * 48,
      };
    });

  const charWaveData = generateVisualWaveData(
    traitsToWave,
    charParams,
    points,
    time,
  );
  const actWaveData = generateVisualWaveData(
    traitsToWave,
    actParams,
    points,
    time,
  );

  const divergentThinkingData = generateVisualWaveData(
    makeDivergentThinkingWave,
    currentDivergentThinking,
    points,
    time,
  );

  const convergentThinkingData = generateVisualWaveData(
    makeConvergentThinkingWave,
    currentConvergentThinking,
    points,
    time,
  );

  const attentionSpanData = generateVisualWaveData(
    makeAttentionSpanWave,
    currentAttentionSpan,
    points,
    time,
  );

  const avgReward =
    recentRewards.length > 0
      ? Math.round(
          recentRewards.reduce((sum, r) => sum + r.value, 0) /
            recentRewards.length,
        )
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Trait-Based Resonance System
        </h1>
        <p className="text-gray-600 mb-3">
          Character traits create unique mental rhythms. Observe performance to
          learn compatibility.
        </p>
        <button
          onClick={() => setShowMapping(!showMapping)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          {showMapping ? "Hide" : "Show"} trait-to-wave mapping
        </button>
      </div>

      {showMapping && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">
            How Traits Map to Wave Properties:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
            <div>
              <strong>Mental Stamina → Frequency</strong>
              <p className="text-xs mt-1">
                Higher stamina = faster, more energetic rhythm
              </p>
            </div>
            <div>
              <strong>Convergent Thinking → Amplitude</strong>
              <p className="text-xs mt-1">
                Higher focus = stronger, more pronounced output
              </p>
            </div>
            <div>
              <strong>Divergent Thinking → Harmonics</strong>
              <p className="text-xs mt-1">
                Higher creativity = more complex wave patterns
              </p>
            </div>
            <div>
              <strong>Openness → Phase Offset</strong>
              <p className="text-xs mt-1">
                Affects starting point and adaptability
              </p>
            </div>
            <div>
              <strong>Processing Speed → Smoothness</strong>
              <p className="text-xs mt-1">
                How clean and efficient their output is
              </p>
            </div>
            <div>
              <strong>Interests → Flat Bonus</strong>
              <p className="text-xs mt-1">
                +20 points when matched with activity
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Character
          </h2>
          <div className="space-y-2">
            {characters.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedChar(idx)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedChar === idx
                    ? "border-2"
                    : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor:
                    selectedChar === idx ? `${c.color}15` : undefined,
                  borderColor: selectedChar === idx ? c.color : undefined,
                }}
              >
                <div className="font-semibold text-gray-800">{c.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {c.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Interests: {c.interests.join(", ")}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Activity</h2>
          <div className="space-y-2">
            {activities.map((a, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedActivity(idx)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedActivity === idx
                    ? "border-2"
                    : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor:
                    selectedActivity === idx ? `${a.color}15` : undefined,
                  borderColor: selectedActivity === idx ? a.color : undefined,
                }}
              >
                <div className="font-semibold text-gray-800">{a.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {a.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        {currentDivergentThinking}
        <div className="w-10/12 m-auto">
          <input
            className="w-full"
            min={0}
            max={100}
            value={currentDivergentThinking}
            onChange={(event) =>
              setCurrentDivergentThinking(Number(event.target.value))
            }
            type={"range"}
          />
        </div>
      </div>
      <Wave
        points={divergentThinkingData}
        title="Divergent Thinking"
        color={char.color}
      />

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        {currentConvergentThinking}
        <div className="w-10/12 m-auto">
          <input
            className="w-full"
            min={0}
            max={100}
            value={currentConvergentThinking}
            onChange={(event) =>
              setCurrentConvergentThinking(Number(event.target.value))
            }
            type={"range"}
          />
        </div>
      </div>
      <Wave
        points={convergentThinkingData}
        title="Convergent Thinking"
        color={char.color}
      />

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        {currentAttentionSpan}
        <div className="w-10/12 m-auto">
          <input
            className="w-full"
            min={0}
            max={100}
            value={currentAttentionSpan}
            onChange={(event) =>
              setCurrentAttentionSpan(Number(event.target.value))
            }
            type={"range"}
          />
        </div>
      </div>
      <Wave
        points={attentionSpanData}
        title="Attention Span"
        color={char.color}
      />

      {/* Wave Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Mental Rhythm Patterns (Hidden from Player)
        </h2>
        <svg viewBox="0 0 400 100" className="w-full h-48 bg-gray-50 rounded">
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
        <div className="flex justify-between mt-3 text-sm">
          <span style={{ color: char.color }} className="font-medium">
            ■ {char.name}'s rhythm
          </span>
          <span style={{ color: activity.color }} className="font-medium">
            ▪▪▪ {activity.name} demands
          </span>
        </div>
        <div className="mt-3 text-xs text-gray-600 space-y-1">
          <div>
            Frequency: {charParams.frequency.toFixed(2)} vs{" "}
            {actParams.frequency.toFixed(2)} (stamina/pace)
          </div>
          <div>
            Amplitude: {charParams.amplitude.toFixed(2)} vs{" "}
            {actParams.amplitude.toFixed(2)} (focus strength)
          </div>
          <div>
            Complexity: {charParams.harmonics.length} harmonics (divergent
            thinking)
          </div>
        </div>
      </div>

      {/* Simulation */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Performance Simulation
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setTime(0);
                setRecentRewards([]);
                setIsRunning(false);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              onClick={() => setTime((prev) => prev + timeStep)}
            >
              Step
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Reward Display */}
        <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border-2 border-amber-200 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-gray-700">
              Resources Generated
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-5xl font-bold text-amber-600">
              {recentRewards.length > 0 ? recentRewards[0].value : "--"}
            </div>
            {hasBonus && (
              <div className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
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
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Resource Stream (What player sees):
          </div>
          <div className="flex flex-wrap gap-2">
            {recentRewards.map((reward, idx) => (
              <div
                key={reward.time}
                className="px-3 py-2 rounded-lg text-sm font-bold shadow-sm"
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

      {/* Design Notes */}
      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-3">
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
