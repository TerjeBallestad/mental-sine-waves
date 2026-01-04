import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  CircleUser,
} from "lucide-react";
import {
  activities,
  characters,
  emptyTraits,
  type Activity,
  type Character,
  type CharacterTraits,
  type Resource,
} from "./Data";
import { Wave } from "./Wave";
import { clsx } from "clsx";
import {
  makeAttentionSpanWave,
  makeConvergentThinkingWave,
  makeDivergentThinkingWave,
  subtractTraits,
  sumTraits,
  traitsToWave,
} from "./FunctionLibrary";

const ResonanceSystem = () => {
  const timeStep = 0.15;
  const timeInterval = 250; // ms
  const resolution = 400; // amount of points on the sine wave

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedChar, setSelectedChar] = useState(0);
  const [currentTraits, setCurrentTraits] = useState(emptyTraits);
  const [adaption, setAdaption] = useState(emptyTraits);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [recentRewards, setRecentRewards] =
    useState(
      Array<{
        resource: string;
        amount: number;
        time: number;
        resonance: number;
      }>(),
    );
  const [showMapping, setShowMapping] = useState(false);

  /**
   *Calculate how well character traits match activity requirements
   */
  const calculateResonance = (
    charTraits: CharacterTraits,
    actRequirements: CharacterTraits,
    t: number,
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

  /**
   * Check interest bonus
   */
  const hasInterestBonus = (char: Character, activity: Activity) => {
    return activity.interestBonus.some((interest: string) =>
      char.interests.includes(interest),
    );
  };

  console.log("Rendering App at time:", time);

  const char = characters[selectedChar];
  const activity = activities[selectedActivity];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => t + timeStep);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setCurrentTraits(char.traits);
  }, [char]);

  /**
   *Generate reward based on resonance
   */
  const calculateProgress = (resonance: number) => {
    const baseReward = Math.min(
      1,
      activity.requirements.intellect >
        currentTraits.intellect + adaption.intellect
        ? resonance -
            (activity.requirements.intellect -
              (currentTraits.intellect + adaption.intellect)) /
              100
        : resonance,
    );

    const interestBonus = hasInterestBonus(char, activity) ? 0.2 : 0;

    const finalProgress = Math.min(Math.max(0, baseReward + interestBonus), 1);

    console.log("base reward 🤹", resonance, baseReward);

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
    ] as [Resource, number];
  };
  const finalTraits = sumTraits(currentTraits, adaption);

  const currentResonance = calculateResonance(
    finalTraits,
    activity.requirements,
    time,
  );
  const [resource, amount] = calculateProgress(currentResonance);

  useEffect(() => {
    const goal = subtractTraits(activity.requirements, currentTraits);
    setAdaption((prev) =>
      Object.keys(prev).reduce((output, key) => {
        const typedKey = key as keyof CharacterTraits;
        output[typedKey] = Math.max(
          -10,
          Math.min(
            10,
            prev[typedKey] +
              Math.max(-1, Math.min(1, goal[typedKey] - prev[typedKey])),
          ),
        );
        console.log(
          "reduce",
          typedKey,
          activity.requirements[typedKey],
          "-",
          prev[typedKey],
          "+",
          currentTraits[typedKey],
        );
        return output;
      }, {} as CharacterTraits),
    );
  }, [activity, currentTraits, time]);

  useEffect(() => {
    setRecentRewards((prev) => [
      {
        resource,
        amount,
        time: Date.now(),
        resonance: currentResonance,
      },
      ...prev.slice(0, 50),
    ]);
  }, [currentResonance, resource, amount]);

  const hasBonus = hasInterestBonus(char, activity);

  // Generate wave visualization
  const generateVisualWaveData = <T extends object | number>(
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

  const charWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    finalTraits,
    resolution,
  );

  const actWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    activity.requirements,
    resolution,
  );

  const divergentThinkingData = generateVisualWaveData(
    makeDivergentThinkingWave,
    time,
    finalTraits,
    resolution,
  );

  const convergentThinkingData = generateVisualWaveData(
    makeConvergentThinkingWave,
    time,
    finalTraits,
    resolution,
  );

  const attentionSpanData = generateVisualWaveData(
    makeAttentionSpanWave,
    time,
    finalTraits,
    resolution,
  );

  const avgReward =
    recentRewards.length > 0
      ? Math.round(
          recentRewards.reduce((sum, r) => sum + r.amount, 0) /
            recentRewards.length,
        )
      : 0;

  return (
    <div className="bg-base-200 mx-auto flex w-full max-w-6xl flex-col gap-6 pb-20">
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
                className="hover:bg-neutral border-base-300 flex w-full gap-6 rounded-lg border p-3"
                style={{
                  borderColor: selectedChar === idx ? c.color : undefined,
                }}
              >
                <CircleUser
                  size={40}
                  strokeWidth={0.5}
                  style={{ color: c.color }}
                />

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
            <h2 className="card-title">Activity</h2>
            {activities.map((a, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedActivity(idx)}
                className="border-neutral hover:bg-neutral rounded-lg border p-3 text-left transition-colors"
                style={{
                  borderColor: selectedActivity === idx ? a.color : undefined,
                }}
              >
                <div className="font-semibold">{a.name}</div>
                <div className="mt-1 text-xs">{a.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            Mental Rhythm Patterns (Hidden from Player)
          </h2>
          <svg
            viewBox="0 0 400 100"
            className="bg-base-200 h-48 w-full rounded shadow-inner"
          >
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
      </div>

      {/* Simulation */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title">Performance Simulation</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="btn btn-primary"
              >
                {isRunning ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setTime(0);
                  setRecentRewards([]);
                  setIsRunning(false);
                }}
                className="btn btn-secondary"
              >
                <RotateCcw className="size-4" />
                Reset
              </button>
              <button
                className="btn btn-neutral"
                onClick={() => setTime((prev) => prev + timeStep)}
              >
                Step
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Reward Display */}
          <div className="from-base-200 to-base-300 border-base-300 mb-4 rounded-lg border-2 bg-linear-to-br p-6">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="text-accent h-5 w-5" />
              <span className="text-accent font-semibold">
                Resources Generated
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-primary text-5xl font-bold">
                {recentRewards.length > 0 ? (
                  <>
                    <div>{recentRewards[0].resource}</div>
                    <div>{Math.round(recentRewards[0].amount)}</div>
                  </>
                ) : (
                  "--"
                )}
              </div>
              {hasBonus && (
                <div className="bg-success rounded px-2 py-1 text-sm text-green-900">
                  Interest Bonus!
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <div>
                Average (last 15):{" "}
                <span className="font-semibold">{avgReward}</span>
              </div>
              <div>
                Resonance: {(currentResonance * 100).toFixed(1)}% (hidden)
              </div>
            </div>
          </div>

          {/* Reward Stream */}
          <div>
            <div className="mb-2 text-sm font-semibold">
              Resource Stream (What player sees):
            </div>
            <div className="flex flex-wrap gap-2">
              {recentRewards.map((reward, idx) => (
                <div
                  key={`${idx}-${reward.time}`}
                  className={clsx(
                    "text-base-100 rounded-lg px-3 py-2 text-sm font-bold shadow-sm",
                    {
                      "bg-success": reward.resonance > 0.65,
                      "bg-warning":
                        reward.resonance > 0.45 && reward.resonance <= 0.65,
                      "bg-error": reward.resonance <= 0.45,
                    },
                  )}
                  style={{
                    opacity: 1 - idx * 0.02,
                  }}
                >
                  <div>{reward.resource}</div>
                  <div>{Math.round(reward.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Wave
        points={divergentThinkingData}
        title="Divergent Thinking"
        color={char.color}
      >
        <label className="input w-full">
          <span className="label w-50">
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
        <label className="input w-full">
          <span className="label w-50">
            Fortitude:
            {currentTraits.fortitude}
          </span>
          <input
            className="range range-primary w-full"
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
        <label className="input w-full">
          <span className="label w-50">
            Openness:
            {currentTraits.openness}
          </span>
          <input
            className="range range-secondary w-full"
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
        <label className="input w-full">
          <span className="label w-50">
            Extraversion:
            {currentTraits.extraversion}
          </span>
          <input
            className="range range-info w-full"
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
        <label className="input w-full">
          <span className="label w-50">Focus: {currentTraits.focus}</span>
          <input
            className="range range-accent w-full"
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
        <label className="input w-full">
          <span className="label w-50">
            Fortitude: {currentTraits.fortitude}
          </span>
          <input
            className="range range-primary w-full"
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

        <label className="input w-full">
          <span className="label w-50">
            Neuroticism: {currentTraits.neuroticism}
          </span>
          <input
            className="range range-secondary w-full"
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
        <label className="input w-full">
          <span className="label w-50">
            Conscientiousness: {currentTraits.conscientiousness}
          </span>
          <input
            className="range range-info w-full"
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
      </Wave>

      <Wave
        points={attentionSpanData}
        title="Attention Span"
        color={char.color}
      >
        <label className="input w-full">
          <span className="label w-50">
            Processing <br></br> Speed: {currentTraits.processingSpeed}
          </span>
          <input
            className="range range-accent w-full"
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
        <label className="input w-full">
          <span className="label w-55">
            Attention Span: {currentTraits.attentionSpan}
          </span>
          <input
            className="range range-accent w-full"
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
