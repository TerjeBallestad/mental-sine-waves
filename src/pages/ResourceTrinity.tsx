import { useState, useEffect } from "react";
import {
  User,
  Brain,
  Heart,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Mood = "thriving" | "stable" | "struggling" | "depleted";

export function PatientResourcePrototype() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Erik",
      condition: "Depression",
      attention: 60,
      emotional: 40,
      motivation: 30,
      maxAttention: 100,
      maxEmotional: 100,
      maxMotivation: 100,
      regenRates: { attention: 8, emotional: 5, motivation: 3 },
      mood: "struggling" as Mood,
    },
    {
      id: 2,
      name: "Sofie",
      condition: "ADHD",
      attention: 40,
      emotional: 70,
      motivation: 80,
      maxAttention: 100,
      maxEmotional: 100,
      maxMotivation: 100,
      regenRates: { attention: 3, emotional: 7, motivation: 10 },
      mood: "restless" as Mood,
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(0);
  const [time, setTime] = useState(0);
  const [log, setLog] =
    useState(Array<{ message: string; type: string; time: number }>());
  const [isPaused, setIsPaused] = useState(false);

  const activities = [
    {
      name: "Job Application",
      attention: 40,
      emotional: 20,
      motivation: 30,
      duration: 2,
      benefits: "Progress towards employment",
      type: "skill",
    },
    {
      name: "Therapy Session",
      attention: 25,
      emotional: 50,
      motivation: 15,
      duration: 2,
      benefits: "Emotional insight +emotional regen",
      type: "therapy",
    },
    {
      name: "Clean Room",
      attention: 10,
      emotional: 5,
      motivation: 20,
      duration: 1,
      benefits: "Small accomplishment +motivation",
      type: "routine",
    },
    {
      name: "Social Gathering",
      attention: 30,
      emotional: 45,
      motivation: 10,
      duration: 2,
      benefits: "Build connections",
      type: "social",
    },
    {
      name: "Read Book",
      attention: 20,
      emotional: 0,
      motivation: 5,
      duration: 1,
      benefits: "+attention recovery rate",
      type: "hobby",
    },
    {
      name: "Take Walk",
      attention: 5,
      emotional: 10,
      motivation: 15,
      duration: 1,
      benefits: "+all resources slightly",
      type: "exercise",
    },
    {
      name: "Rest",
      attention: -15,
      emotional: -10,
      motivation: -5,
      duration: 1,
      benefits: "Restore resources",
      type: "rest",
    },
  ];

  // Time progression and resource regeneration
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
      setPatients((prev) =>
        prev.map((p) => ({
          ...p,
          attention: Math.min(
            p.maxAttention,
            p.attention + p.regenRates.attention,
          ),
          emotional: Math.min(
            p.maxEmotional,
            p.emotional + p.regenRates.emotional,
          ),
          motivation: Math.min(
            p.maxMotivation,
            p.motivation + p.regenRates.motivation,
          ),
        })),
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const canDoActivity = (
    patient: (typeof patients)[number],
    activity: (typeof activities)[number],
  ) => {
    return (
      patient.attention >= activity.attention &&
      patient.emotional >= activity.emotional &&
      patient.motivation >= activity.motivation
    );
  };

  const doActivity = (activity: (typeof activities)[number]) => {
    const patient = patients[selectedPatient];

    if (!canDoActivity(patient, activity)) {
      addLog(
        `${patient.name} can't handle ${activity.name} right now`,
        "failure",
      );
      return;
    }

    const newPatients = [...patients];
    const p = newPatients[selectedPatient];

    // Spend resources (negative values restore)
    p.attention = Math.max(
      0,
      Math.min(p.maxAttention, p.attention - activity.attention),
    );
    p.emotional = Math.max(
      0,
      Math.min(p.maxEmotional, p.emotional - activity.emotional),
    );
    p.motivation = Math.max(
      0,
      Math.min(p.maxMotivation, p.motivation - activity.motivation),
    );

    // Update mood based on resource levels
    const avgResources = (p.attention + p.emotional + p.motivation) / 3;
    if (avgResources > 70) p.mood = "thriving";
    else if (avgResources > 50) p.mood = "stable";
    else if (avgResources > 30) p.mood = "struggling";
    else p.mood = "depleted";

    setPatients(newPatients);
    addLog(
      `${patient.name} ${activity.attention < 0 ? "is resting" : "completed"}: ${activity.name}`,
      "success",
    );
  };

  const addLog = (message: string, type: string) => {
    setLog((prev) => [{ message, type, time }, ...prev].slice(0, 8));
  };

  const patient = patients[selectedPatient];

  const getResourceColor = (value: number, max: number) => {
    const percent = (value / max) * 100;
    if (percent > 66) return "bg-green-500";
    if (percent > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMoodColor = (mood: Mood) => {
    const colors = {
      thriving: "text-green-600",
      stable: "text-blue-600",
      struggling: "text-yellow-600",
      depleted: "text-red-600",
    };
    return colors[mood] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            Lifelines: Patient Resource Management
          </h1>
          <p className="text-slate-600">
            Manage cognitive resources to help patients rebuild their lives
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700">
                Day {Math.floor(time / 8) + 1}, Hour {(time % 8) + 8}:00
              </span>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
            >
              {isPaused ? "Resume" : "Pause"} Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Patient Selection & Status */}
          <div className="lg:col-span-1">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Patients
              </h2>
              {patients.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(idx)}
                  className={`mb-2 w-full rounded-lg p-4 text-left transition ${
                    selectedPatient === idx
                      ? "border-2 border-blue-500 bg-blue-100"
                      : "border-2 border-transparent bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <div className="text-sm text-slate-600">{p.condition}</div>
                  <div
                    className={`mt-1 text-sm font-semibold ${getMoodColor(p.mood)}`}
                  >
                    {p.mood}
                  </div>
                </button>
              ))}
            </div>

            {/* Activity Log */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Activity Log
              </h2>
              <div className="space-y-2">
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 rounded p-2 text-sm ${
                      entry.type === "success" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    {entry.type === "success" ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <span>{entry.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Resource Display */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-6 w-6 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-800">
                  {patient.name}
                </h2>
                <span className="text-slate-600">- {patient.condition}</span>
              </div>

              <div className="space-y-4">
                {/* Attention */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-slate-700">
                        Attention / Focus
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {Math.round(patient.attention)}/{patient.maxAttention}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-200">
                    <div
                      className={`h-4 rounded-full transition-all ${getResourceColor(patient.attention, patient.maxAttention)}`}
                      style={{
                        width: `${(patient.attention / patient.maxAttention) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Cognitive capacity for demanding tasks
                  </p>
                </div>

                {/* Emotional Bandwidth */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-slate-700">
                        Emotional Bandwidth
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {Math.round(patient.emotional)}/{patient.maxEmotional}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-200">
                    <div
                      className={`h-4 rounded-full transition-all ${getResourceColor(patient.emotional, patient.maxEmotional)}`}
                      style={{
                        width: `${(patient.emotional / patient.maxEmotional) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Capacity for social interaction and emotional situations
                  </p>
                </div>

                {/* Motivation */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-slate-700">
                        Motivation / Will
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {Math.round(patient.motivation)}/{patient.maxMotivation}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-slate-200">
                    <div
                      className={`h-4 rounded-full transition-all ${getResourceColor(patient.motivation, patient.maxMotivation)}`}
                      style={{
                        width: `${(patient.motivation / patient.maxMotivation) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Willpower to do difficult or unwanted tasks
                  </p>
                </div>
              </div>
            </div>

            {/* Available Activities */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Available Activities
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activities.map((activity, idx) => {
                  const canDo = canDoActivity(patient, activity);
                  return (
                    <button
                      key={idx}
                      onClick={() => doActivity(activity)}
                      disabled={!canDo}
                      className={`rounded-lg p-4 text-left transition ${
                        canDo
                          ? "border-2 border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                          : "cursor-not-allowed border-2 border-slate-200 bg-slate-100 opacity-50"
                      }`}
                    >
                      <div className="mb-2 font-bold text-slate-800">
                        {activity.name}
                      </div>
                      <div className="mb-3 text-xs text-slate-600">
                        {activity.benefits}
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-purple-600" />
                          <span
                            className={
                              activity.attention > patient.attention
                                ? "font-bold text-red-600"
                                : ""
                            }
                          >
                            {activity.attention > 0 ? "-" : "+"}
                            {Math.abs(activity.attention)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-600" />
                          <span
                            className={
                              activity.emotional > patient.emotional
                                ? "font-bold text-red-600"
                                : ""
                            }
                          >
                            {activity.emotional > 0 ? "-" : "+"}
                            {Math.abs(activity.emotional)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-600" />
                          <span
                            className={
                              activity.motivation > patient.motivation
                                ? "font-bold text-red-600"
                                : ""
                            }
                          >
                            {activity.motivation > 0 ? "-" : "+"}
                            {Math.abs(activity.motivation)}
                          </span>
                        </div>
                      </div>
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

export default PatientResourcePrototype;
