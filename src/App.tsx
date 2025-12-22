import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Sparkles, Info } from "lucide-react";
import {
  activities,
  characters,
  type Activity,
  type ActivityRequirements,
  type Character,
  type CharacterTraits,
  type RewardData,
  type WaveDefiniton,
} from "./Data";

const ResonanceSystem = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChar, setSelectedChar] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [recentRewards, setRecentRewards] = useState(Array<RewardData>());
  const [showMapping, setShowMapping] = useState(false);

  // Convert traits to wave parameters
  const traitsToWaveParams = (traits: ActivityRequirements) => {
    // Mental Stamina → Frequency (higher stamina = faster, more energetic rhythm)
    const frequency = 0.2 + (traits.mentalStamina / 100) * 0.8;

    // Convergent Thinking → Amplitude (focused output strength)
    const amplitude = 0.3 + (traits.convergentThinking / 100) * 0.7;

    // Divergent Thinking → Harmonic Complexity
    const divergence = traits.divergentThinking / 100;
    const harmonics = [
      1.0,
      divergence * 0.5, // Second harmonic
      divergence * 0.25, // Third harmonic
    ];

    // Openness → Phase offset (how they start their cycle)
    const phase = (traits.openness / 100) * Math.PI;

    // Processing Speed affects overall wave smoothness
    const smoothness = traits.processingSpeed / 100;

    return { frequency, amplitude, harmonics, phase, smoothness };
  };

  // Generate wave value at time t
  const generateWave = (params: WaveDefiniton, t: number) => {
    let value = 0;
    const totalHarmonics = params.harmonics.reduce((a, b) => a + b, 0);

    params.harmonics.forEach((harmonic: number, i: number) => {
      const freq = params.frequency * (i + 1);
      value += harmonic * Math.sin(freq * t + params.phase);
    });

    // Normalize and apply amplitude
    return ((params.amplitude * value) / totalHarmonics) * params.smoothness;
  };

  // Calculate how well character traits match activity requirements
  const calculateResonance = useCallback(
    (
      charTraits: CharacterTraits,
      actRequirements: ActivityRequirements,
      t: number,
    ) => {
      const charWave = generateWave(traitsToWaveParams(charTraits), t);
      const actWave = generateWave(traitsToWaveParams(actRequirements), t);

      // Wave alignment (how close they are at this moment)
      const difference = Math.abs(charWave - actWave);
      const charParams = traitsToWaveParams(charTraits);
      const actParams = traitsToWaveParams(actRequirements);
      const maxDiff = charParams.amplitude + actParams.amplitude;
      const waveAlignment = 1 - difference / maxDiff;

      // Trait compatibility (how similar their overall patterns are)
      const freqMatch =
        1 - Math.abs(charParams.frequency - actParams.frequency) / 1.0;
      const ampMatch =
        1 - Math.abs(charParams.amplitude - actParams.amplitude) / 1.0;
      // const phaseMatch =
      //   1 - Math.abs(charParams.phase - actParams.phase) / Math.PI;

      // Key trait alignment
      const staminaMatch =
        1 -
        Math.abs(charTraits.mentalStamina - actRequirements.mentalStamina) /
          100;
      const convergentMatch =
        1 -
        Math.abs(
          charTraits.convergentThinking - actRequirements.convergentThinking,
        ) /
          100;
      const divergentMatch =
        1 -
        Math.abs(
          charTraits.divergentThinking - actRequirements.divergentThinking,
        ) /
          100;

      // Weighted combination
      const resonance =
        waveAlignment * 0.25 + // Moment-to-moment fit
        freqMatch * 0.15 + // Rhythm compatibility
        ampMatch * 0.1 + // Output style match
        staminaMatch * 0.2 + // Stamina alignment
        convergentMatch * 0.15 + // Focus match
        divergentMatch * 0.15; // Creativity match

      return Math.max(0, Math.min(1, resonance));
    },
    [],
  );

  // Check interest bonus
  const hasInterestBonus = (char: Character, activity: Activity) => {
    return activity.interestBonus.some((interest: string) =>
      char.interests.includes(interest),
    );
  };

  // Generate reward based on resonance
  const generateReward = useCallback(
    (char: Character, activity: Activity, resonance: number) => {
      // Base reward from resonance (30-100 range)
      const baseReward = 30 + resonance * 70;

      // Interest bonus: flat +20 points
      const interestBonus = hasInterestBonus(char, activity) ? 20 : 0;

      // Add small random variation (±10%) - natural performance fluctuation
      const variation = (Math.random() - 0.5) * 0.2;
      const finalReward = Math.max(
        0,
        (baseReward + interestBonus) * (1 + variation),
      );

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
      setTime((t) => t + 0.15);

      const char = characters[selectedChar];
      const activity = activities[selectedActivity];
      const resonance = calculateResonance(
        char.traits,
        activity.requirements,
        time,
      );
      const reward = generateReward(char, activity, resonance);

      setRecentRewards((prev) => [
        {
          value: reward.amount,
          base: reward.base,
          bonus: reward.bonus,
          time: Date.now(),
          resonance: reward.resonance,
        },
        ...prev.slice(0, 14),
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, [
    calculateResonance,
    generateReward,
    isRunning,
    selectedActivity,
    selectedChar,
    time,
  ]);

  const char = characters[selectedChar];
  const activity = activities[selectedActivity];
  const currentResonance = calculateResonance(
    char.traits,
    activity.requirements,
    time,
  );
  const hasBonus = hasInterestBonus(char, activity);

  // Generate wave visualization
  const points = 200;
  const charParams = traitsToWaveParams(char.traits);
  const actParams = traitsToWaveParams(activity.requirements);

  const charWaveData = Array.from({ length: points }, (_, i) => {
    const t = time + (i / points) * 12;
    return {
      x: i,
      y: 50 + generateWave(charParams, t) * 35,
    };
  });

  const actWaveData = Array.from({ length: points }, (_, i) => {
    const t = time + (i / points) * 12;
    return {
      x: i,
      y: 50 + generateWave(actParams, t) * 35,
    };
  });

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

      {/* Wave Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Mental Rhythm Patterns (Hidden from Player)
        </h2>
        <svg viewBox="0 0 200 100" className="w-full h-48 bg-gray-50 rounded">
          <line
            x1="0"
            y1="50"
            x2="200"
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
