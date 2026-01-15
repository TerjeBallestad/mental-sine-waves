import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Activity, Moon, Sun } from "lucide-react";
type Stat =
  | "overskudd"
  | "maxOverskudd"
  | "purpose"
  | "nutrition"
  | "security"
  | "attention"
  | "energy"
  | "baseRegenRate"
  | "anxietyDrain"
  | "activityProgress";
type MathBreakdown = {
  baseRegen: number;
  nutritionMod: number;
  energyMod: number;
  timeMod: number;
  restingBonus: number;
  totalRegen: number;
  anxietyDrain: number;
  netChange: number;
};
type Activity = {
  name: string;
  baseCost: number;
  duration: number;
  type: string;
  requiresMotivation: boolean;
  effects: Partial<Record<Stat, number>>;
  diagnostic?: string;
};

type Patient = {
  name: string;
  archetype: string;

  // VISIBLE RESOURCE
  overskudd: number;
  maxOverskudd: number;

  // HIDDEN STATS (revealed through diagnosis)
  purpose: number;
  nutrition: number;
  security: number;
  attention: number;
  energy: number;

  // DERIVED VALUES (calculated from hidden stats)
  baseRegenRate: number;
  anxietyDrain: number;

  // STATE
  currentActivity: Activity | null;
  activityProgress: number;
  isResting: boolean;

  // DISCOVERED
  discoveredStats: Array<Stat>;
};

const hiddenStats = [
  "purpose",
  "nutrition",
  "security",
  "attention",
  "energy",
] as const;

const getTimeOfDayModifier = (hour: number) => {
  // Morning (6-12): 1.2x regen (fresh)
  if (hour >= 6 && hour < 12) return 1.2;
  // Afternoon (12-18): 1.0x regen (normal)
  if (hour >= 12 && hour < 18) return 1.0;
  // Evening (18-23): 0.8x regen (tired)
  if (hour >= 18 && hour < 23) return 0.8;
  // Night (23-6): 1.5x regen (sleeping)
  return 1.5;
};

// CORE MATH FORMULAS
const calculateRegenRate = (patient: Patient, time: number) => {
  let regen = patient.baseRegenRate;

  // Nutrition modifier: -50% to +25% regen
  const nutritionModifier = ((patient.nutrition - 50) / 50) * 0.5;
  regen *= 1 + nutritionModifier;

  // Energy modifier: -30% to +30% regen
  const energyModifier = ((patient.energy - 50) / 50) * 0.3;
  regen *= 1 + energyModifier;

  // Time of day modifier
  const timeModifier = getTimeOfDayModifier(time);
  regen *= timeModifier;

  // Resting bonus
  if (patient.isResting) {
    regen *= 2.0;
  }

  return Math.max(0.1, regen); // Minimum 0.1/hour
};

const calculateAnxietyDrain = (patient: Patient) => {
  // Security below 50 causes constant drain
  if (patient.security < 50) {
    const drainAmount = (50 - patient.security) / 10; // 0-5 drain per hour
    return drainAmount;
  }
  return 0;
};

const calculateActivityCost = (baseActivity: Activity, patient: Patient) => {
  let cost = baseActivity.baseCost;

  // Attention modifier for cognitive activities
  if (baseActivity.type === "cognitive") {
    const attentionModifier = (patient.attention - 50) / 50;
    cost *= 1 - attentionModifier * 0.5; // ±50% based on attention
  }

  // Purpose modifier for motivation-required activities
  if (baseActivity.requiresMotivation) {
    const purposeModifier = (patient.purpose - 50) / 50;
    cost *= 1 - purposeModifier * 0.4; // ±40% based on purpose
  }

  // Security modifier for social activities
  if (baseActivity.type === "social") {
    const securityModifier = (patient.security - 50) / 50;
    cost *= 1 - securityModifier * 0.6; // ±60% based on security
  }

  return Math.max(5, cost); // Minimum cost of 5
};

export function OverskuddMathPrototype() {
  const [time, setTime] = useState(0); // In-game hours (0-23 cycles)
  const [day, setDay] = useState(1);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1000); // ms per game hour

  const [patient, setPatient] = useState<Patient>({
    name: "Erik",
    archetype: "The Withdrawn",

    // VISIBLE RESOURCE
    overskudd: 50,
    maxOverskudd: 100,

    // HIDDEN STATS (revealed through diagnosis)
    purpose: 20,
    nutrition: 40,
    security: 35,
    attention: 70,
    energy: 45,

    // DERIVED VALUES (calculated from hidden stats)
    baseRegenRate: 2.0,
    anxietyDrain: 0,

    // STATE
    currentActivity: null as Activity | null,
    activityProgress: 0,
    isResting: false,

    // DISCOVERED
    discoveredStats: Array<Stat>(),
  });

  const [log, setLog] =
    useState(Array<{ message: string; type: string; time: string }>());

  const addLog = useCallback(
    (message: string, type = "info") => {
      setLog((prev) =>
        [{ message, type, time: `Day ${day}, ${time}:00` }, ...prev].slice(
          0,
          10,
        ),
      );
    },
    [day, time],
  );

  const [mathBreakdown, setMathBreakdown] = useState<MathBreakdown | null>(
    null,
  );

  // Sample activities with different characteristics
  const activities = Array<Activity>(
    {
      name: "Job Application",
      baseCost: 35,
      duration: 2,
      type: "cognitive",
      requiresMotivation: true,
      effects: { purpose: 5 },
    },
    {
      name: "Clean Room",
      baseCost: 15,
      duration: 1,
      type: "routine",
      requiresMotivation: true,
      effects: { purpose: 2 },
    },
    {
      name: "Therapy Session",
      baseCost: 30,
      duration: 2,
      type: "social",
      requiresMotivation: false,
      effects: { purpose: 8, security: 5 },
      diagnostic: "Reveals Purpose stat",
    },
    {
      name: "Group Meal",
      baseCost: 25,
      duration: 1,
      type: "social",
      requiresMotivation: false,
      effects: { nutrition: 10, security: 3 },
    },
    {
      name: "Read Book",
      baseCost: 20,
      duration: 2,
      type: "cognitive",
      requiresMotivation: false,
      effects: { attention: 5 },
    },
    {
      name: "Take Walk",
      baseCost: 10,
      duration: 1,
      type: "routine",
      requiresMotivation: false,
      effects: { energy: 8 },
    },
  );

  // Time progression
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTime((t) => {
        const newTime = (t + 1) % 24;
        if (newTime === 0) setDay((d) => d + 1);
        return newTime;
      });

      setPatient((prev) => {
        const newPatient = { ...prev };

        // Handle ongoing activity
        if (newPatient.currentActivity) {
          newPatient.activityProgress += 1;

          if (
            newPatient.activityProgress >= newPatient.currentActivity.duration
          ) {
            // Activity complete
            addLog(`Completed: ${newPatient.currentActivity.name}`);

            // Apply effects
            (
              Object.entries(newPatient.currentActivity.effects || {}) as Array<
                [stat: Stat, value: number]
              >
            ).forEach(([stat, value]) => {
              newPatient[stat] = Math.min(
                100,
                Math.max(0, newPatient[stat] + value),
              );
            });

            // Diagnostic reveal
            if (
              newPatient.currentActivity.diagnostic &&
              !newPatient.discoveredStats.includes("purpose")
            ) {
              newPatient.discoveredStats = [
                ...newPatient.discoveredStats,
                "purpose",
              ];
              addLog(
                `🔍 Discovered: ${newPatient.currentActivity.diagnostic}`,
                "discovery",
              );
            }

            newPatient.currentActivity = null;
            newPatient.activityProgress = 0;
          }

          return newPatient;
        }

        // Calculate regeneration
        const regenRate = calculateRegenRate(newPatient, time);
        const anxietyDrain = calculateAnxietyDrain(newPatient);

        const netChange = regenRate - anxietyDrain;
        newPatient.overskudd = Math.min(
          newPatient.maxOverskudd,
          Math.max(0, newPatient.overskudd + netChange),
        );

        // Update math breakdown
        setMathBreakdown({
          baseRegen: 2.0,
          nutritionMod: ((newPatient.nutrition - 50) / 50) * 0.5,
          energyMod: ((newPatient.energy - 50) / 50) * 0.3,
          timeMod: getTimeOfDayModifier(time),
          restingBonus: newPatient.isResting ? 2.0 : 1.0,
          totalRegen: regenRate,
          anxietyDrain: anxietyDrain,
          netChange: netChange,
        });

        // Auto-rest at night
        if (time >= 23 || time < 6) {
          newPatient.isResting = true;
        } else if (time === 6) {
          newPatient.isResting = false;
        }

        return newPatient;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [addLog, isPaused, speed, time]);

  const doActivity = (activity: Activity) => {
    if (patient.currentActivity) {
      addLog("Patient is already busy", "error");
      return;
    }

    const cost = calculateActivityCost(activity, patient);

    if (patient.overskudd < cost) {
      addLog(
        `${patient.name} doesn't have overskudd for ${activity.name}`,
        "error",
      );
      return;
    }

    setPatient((prev) => ({
      ...prev,
      overskudd: Math.max(0, prev.overskudd - cost),
      currentActivity: activity,
      activityProgress: 0,
      isResting: false,
    }));

    addLog(`Started: ${activity.name} (cost: ${Math.round(cost)} overskudd)`);
  };

  const toggleRest = () => {
    setPatient((prev) => ({
      ...prev,
      isResting: !prev.isResting,
      currentActivity: null,
      activityProgress: 0,
    }));
  };

  const modifyStat = (stat: keyof Patient, delta: number) => {
    setPatient((prev) => ({
      ...prev,
      [stat]: Math.min(
        100,
        Math.max(0, (typeof prev[stat] === "number" ? prev[stat] : 0) + delta),
      ),
    }));
  };

  const reset = () => {
    setTime(8);
    setDay(1);
    setPatient({
      name: "Erik",
      archetype: "The Withdrawn",
      overskudd: 50,
      maxOverskudd: 100,
      purpose: 20,
      nutrition: 40,
      security: 35,
      attention: 70,
      energy: 45,
      baseRegenRate: 2.0,
      anxietyDrain: 0,
      currentActivity: null,
      activityProgress: 0,
      isResting: false,
      discoveredStats: [],
    });
    setLog([]);
  };

  const getTimeOfDayIcon = () => {
    if (time >= 6 && time < 18)
      return <Sun className="h-5 w-5 text-yellow-500" />;
    return <Moon className="h-5 w-5 text-indigo-400" />;
  };

  const getTimeOfDayLabel = () => {
    if (time >= 6 && time < 12) return "Morning (High Regen)";
    if (time >= 12 && time < 18) return "Afternoon (Normal)";
    if (time >= 18 && time < 23) return "Evening (Low Regen)";
    return "Night (Sleep Regen)";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Overskudd Math System
          </h1>
          <p className="text-slate-400">
            Technical prototype exploring regeneration formulas and activity
            costs
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              {getTimeOfDayIcon()}
              <span className="font-semibold">
                Day {day}, {time}:00
              </span>
              <span className="text-sm text-slate-400">
                ({getTimeOfDayLabel()})
              </span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
              {isPaused ? "Start" : "Pause"}
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            >
              <option value={2000}>0.5x Speed</option>
              <option value={1000}>1x Speed</option>
              <option value={500}>2x Speed</option>
              <option value={250}>4x Speed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Patient State */}
          <div className="space-y-6 lg:col-span-1">
            {/* Overskudd Display */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Overskudd (Visible)
              </h2>

              <div className="mb-4">
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-slate-300">Current</span>
                  <span className="text-lg font-bold text-white">
                    {Math.round(patient.overskudd)}/100
                  </span>
                </div>
                <div className="h-6 w-full rounded-full bg-slate-700">
                  <div
                    className={`h-6 rounded-full transition-all ${
                      patient.overskudd > 66
                        ? "bg-green-500"
                        : patient.overskudd > 33
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${patient.overskudd}%` }}
                  />
                </div>
              </div>

              {patient.currentActivity && (
                <div className="mb-4 rounded border border-blue-700 bg-blue-900/30 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-blue-300">
                      {patient.currentActivity.name}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${(patient.activityProgress / patient.currentActivity.duration) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {patient.activityProgress}/
                    {patient.currentActivity.duration} hours
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white">
                    {patient.currentActivity
                      ? "Busy"
                      : patient.isResting
                        ? "Resting"
                        : "Idle"}
                  </span>
                </div>

                <button
                  onClick={toggleRest}
                  disabled={patient.currentActivity !== null}
                  className={`w-full rounded px-3 py-2 text-sm ${
                    patient.isResting
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-600 text-white hover:bg-slate-700"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {patient.isResting ? "✓ Resting (2x Regen)" : "Rest"}
                </button>
              </div>
            </div>

            {/* Hidden Stats */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Hidden Stats (Debug)
              </h2>
              <div className="space-y-3">
                {hiddenStats.map((stat) => (
                  <div key={stat}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm text-slate-300 capitalize">
                        {stat}
                        {patient.discoveredStats.includes(stat) && (
                          <span className="ml-2 text-xs text-green-400">
                            ✓ Discovered
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-white">
                        {Math.round(patient[stat])}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => modifyStat(stat, -10)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        -10
                      </button>
                      <div className="h-2 flex-1 rounded-full bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${patient[stat]}%` }}
                        />
                      </div>
                      <button
                        onClick={() => modifyStat(stat, 10)}
                        className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Activity Log
              </h2>
              <div className="space-y-2">
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`rounded p-2 text-sm ${
                      entry.type === "error"
                        ? "border border-red-700 bg-red-900/30 text-red-300"
                        : entry.type === "discovery"
                          ? "border border-green-700 bg-green-900/30 text-green-300"
                          : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="mb-1 font-mono text-xs text-slate-500">
                      {entry.time}
                    </div>
                    <div>{entry.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Math Breakdown */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Regeneration Formula
              </h2>

              {mathBreakdown && (
                <div className="space-y-4 font-mono text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Base Regen:</span>
                      <span className="text-white">
                        {mathBreakdown.baseRegen.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>× Nutrition Mod:</span>
                      <span
                        className={
                          mathBreakdown.nutritionMod >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {mathBreakdown.nutritionMod >= 0 ? "+" : ""}
                        {(mathBreakdown.nutritionMod * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>× Energy Mod:</span>
                      <span
                        className={
                          mathBreakdown.energyMod >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {mathBreakdown.energyMod >= 0 ? "+" : ""}
                        {(mathBreakdown.energyMod * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>× Time of Day:</span>
                      <span
                        className={
                          mathBreakdown.timeMod >= 1
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {(mathBreakdown.timeMod * 100).toFixed(0)}%
                      </span>
                    </div>

                    {patient.isResting && (
                      <div className="flex justify-between text-slate-400">
                        <span>× Resting Bonus:</span>
                        <span className="text-green-400">200%</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-slate-600 pt-2 font-bold text-white">
                      <span>= Regen Rate:</span>
                      <span className="text-green-400">
                        +{mathBreakdown.totalRegen.toFixed(2)}/hour
                      </span>
                    </div>

                    {mathBreakdown.anxietyDrain > 0 && (
                      <>
                        <div className="flex justify-between text-red-400">
                          <span>- Anxiety Drain:</span>
                          <span>
                            -{mathBreakdown.anxietyDrain.toFixed(2)}/hour
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-slate-600 pt-2 font-bold text-white">
                          <span>= Net Change:</span>
                          <span
                            className={
                              mathBreakdown.netChange >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {mathBreakdown.netChange >= 0 ? "+" : ""}
                            {mathBreakdown.netChange.toFixed(2)}/hour
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-slate-600 pt-4 text-xs text-slate-400">
                    <p>
                      <strong className="text-slate-300">Nutrition:</strong>{" "}
                      {(((patient.nutrition - 50) / 50) * 0.5 * 100).toFixed(0)}
                      % modifier (-50% to +25%)
                    </p>
                    <p>
                      <strong className="text-slate-300">Energy:</strong>{" "}
                      {(((patient.energy - 50) / 50) * 0.3 * 100).toFixed(0)}%
                      modifier (-30% to +30%)
                    </p>
                    <p>
                      <strong className="text-slate-300">Security:</strong>{" "}
                      {patient.security < 50
                        ? `${((50 - patient.security) / 10).toFixed(1)}/hour drain`
                        : "No anxiety drain"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Activities */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-white">
                Available Activities
              </h2>
              <div className="space-y-3">
                {activities.map((activity, idx) => {
                  const actualCost = calculateActivityCost(activity, patient);
                  const canAfford =
                    patient.overskudd >= actualCost && !patient.currentActivity;

                  return (
                    <button
                      key={idx}
                      onClick={() => doActivity(activity)}
                      disabled={!canAfford}
                      className={`w-full rounded-lg border-2 p-4 text-left transition ${
                        canAfford
                          ? "border-slate-600 bg-slate-700 hover:border-slate-500 hover:bg-slate-600"
                          : "cursor-not-allowed border-slate-700 bg-slate-800 opacity-50"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-bold text-white">
                          {activity.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {activity.duration}h
                        </span>
                      </div>

                      <div className="mb-3 text-xs text-slate-400">
                        {activity.type} •{" "}
                        {activity.requiresMotivation
                          ? "needs motivation"
                          : "no motivation needed"}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-slate-400">Cost: </span>
                          <span
                            className={`font-bold ${actualCost !== activity.baseCost ? "text-yellow-400" : "text-white"}`}
                          >
                            {Math.round(actualCost)}
                          </span>
                          {actualCost !== activity.baseCost && (
                            <span className="ml-1 text-xs text-slate-500">
                              (base: {activity.baseCost})
                            </span>
                          )}
                        </div>

                        {Object.entries(activity.effects || {}).length > 0 && (
                          <div className="text-xs text-green-400">
                            {Object.entries(activity.effects).map(
                              ([stat, val]) => (
                                <span key={stat} className="ml-2">
                                  +{val} {stat}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                      </div>

                      {activity?.diagnostic && (
                        <div className="mt-2 text-xs text-blue-400 italic">
                          🔍 {activity?.diagnostic}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverskuddMathPrototype;
