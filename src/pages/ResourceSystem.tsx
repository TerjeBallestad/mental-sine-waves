import { useState } from "react";
import {
  Activity,
  Clock,
  Heart,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Type definitions
interface Resources {
  energi: number;
  helse: number;
  kapasitet: number;
  overskudd: number;
  trygghet: number;
}

interface Skill {
  name: string;
  level: number;
  category: "basic" | "social" | "creative" | "professional";
}

interface GameActivity {
  id: string;
  name: string;
  description: string;
  category: "basic" | "easy" | "moderate" | "hard";
  baseCosts: Partial<Resources>;
  effects: Partial<Resources>;
  skillImpact?: string;
  requiredSkill?: string;
  minTrygghet?: number;
}

// Initial character state
const initialResources: Resources = {
  energi: 60,
  helse: 70,
  kapasitet: 40,
  overskudd: 30,
  trygghet: 50,
};

const initialSkills: Skill[] = [
  { name: "Matlaging", level: 1, category: "basic" },
  { name: "Renhold", level: 1, category: "basic" },
  { name: "Samtale", level: 0, category: "social" },
  { name: "Skriving", level: 0, category: "creative" },
];

// Activity definitions
const activities: GameActivity[] = [
  {
    id: "sleep",
    name: "Sove",
    description: "Hvile og gjenvinne energi",
    category: "basic",
    baseCosts: {},
    effects: { energi: 40, kapasitet: 20, helse: 5 },
  },
  {
    id: "tv",
    name: "Se på TV",
    description: "Lett underholdning som gir hvile",
    category: "easy",
    baseCosts: { energi: 5 },
    effects: { kapasitet: 15, overskudd: 5 },
  },
  {
    id: "cook_simple",
    name: "Lage enkel mat",
    description: "Frosenpizza eller lignende",
    category: "easy",
    baseCosts: { energi: 10 },
    effects: { energi: 20, helse: 5 },
    skillImpact: "Matlaging",
  },
  {
    id: "cook_proper",
    name: "Lage skikkelig mat",
    description: "Næringsrik middag fra bunnen av",
    category: "moderate",
    baseCosts: { energi: 20, kapasitet: 15 },
    effects: { energi: 35, helse: 15, trygghet: 2 },
    skillImpact: "Matlaging",
    requiredSkill: "Matlaging",
  },
  {
    id: "clean",
    name: "Rydde leiligheten",
    description: "Holde orden hjemme",
    category: "moderate",
    baseCosts: { energi: 25, kapasitet: 10 },
    effects: { trygghet: 5, overskudd: 5 },
    skillImpact: "Renhold",
  },
  {
    id: "walk",
    name: "Gå en tur",
    description: "Frisk luft og mosjon",
    category: "moderate",
    baseCosts: { energi: 15, overskudd: 10 },
    effects: { helse: 8, kapasitet: 10, trygghet: 3 },
    minTrygghet: 30,
  },
  {
    id: "meet_friend",
    name: "Møte en venn",
    description: "Sosial kontakt",
    category: "moderate",
    baseCosts: { energi: 20, kapasitet: 20, overskudd: 15 },
    effects: { overskudd: 25, trygghet: 8 },
    skillImpact: "Samtale",
    minTrygghet: 40,
  },
  {
    id: "write_poem",
    name: "Skrive dikt",
    description: "Kreativt arbeid",
    category: "hard",
    baseCosts: { energi: 15, kapasitet: 30, overskudd: 20 },
    effects: { overskudd: 10, trygghet: 5 },
    skillImpact: "Skriving",
    requiredSkill: "Skriving",
    minTrygghet: 50,
  },
  {
    id: "job_application",
    name: "Søke jobb",
    description: "Skrive søknad og forberede",
    category: "hard",
    baseCosts: { energi: 25, kapasitet: 40, overskudd: 30 },
    effects: { trygghet: -5, overskudd: -10 },
    minTrygghet: 60,
  },
];

const ResourceSystem = () => {
  const [resources, setResources] = useState<Resources>(initialResources);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [log, setLog] = useState<string[]>([
    "Spillet startet. Velg en aktivitet.",
  ]);
  const [day, setDay] = useState(1);

  const getSkillLevel = (skillName: string): number => {
    return skills.find((s) => s.name === skillName)?.level || 0;
  };

  const calculateCost = (activity: GameActivity): Partial<Resources> => {
    const costs = { ...activity.baseCosts };

    // Skill reduces costs
    if (activity.skillImpact) {
      const skillLevel = getSkillLevel(activity.skillImpact);
      const reduction = 1 - skillLevel * 0.15; // 15% reduction per level

      (Object.keys(costs) as Array<keyof typeof costs>).forEach((key) => {
        costs[key] = Math.max(5, Math.floor(costs?.[key] ?? 0 * reduction));
      });
    }

    // Low trygghet increases costs
    const trygghetMultiplier =
      resources.trygghet < 40 ? 1.3 : resources.trygghet < 60 ? 1.1 : 1.0;

    if (activity.category === "hard" || activity.category === "moderate") {
      if (costs.kapasitet)
        costs.kapasitet = Math.floor(costs.kapasitet * trygghetMultiplier);
      if (costs.overskudd)
        costs.overskudd = Math.floor(costs.overskudd * trygghetMultiplier);
    }

    return costs;
  };

  const canAfford = (
    activity: GameActivity,
  ): { can: boolean; reason?: string } => {
    // Check skill requirement
    if (activity.requiredSkill && getSkillLevel(activity.requiredSkill) === 0) {
      return {
        can: false,
        reason: `Trenger ferdighet: ${activity.requiredSkill}`,
      };
    }

    // Check trygghet requirement
    if (activity.minTrygghet && resources.trygghet < activity.minTrygghet) {
      return { can: false, reason: `Trenger ${activity.minTrygghet} trygghet` };
    }

    const costs = calculateCost(activity);

    for (const [key, value] of Object.entries(costs)) {
      if (resources[key as keyof typeof resources] < value) {
        return { can: false, reason: `Ikke nok ${key}` };
      }
    }

    return { can: true };
  };

  const performActivity = (activity: GameActivity) => {
    const affordCheck = canAfford(activity);
    if (!affordCheck.can) {
      setLog((prev) => [
        ...prev,
        `❌ Kan ikke ${activity.name}: ${affordCheck.reason}`,
      ]);
      return;
    }

    const costs = calculateCost(activity);
    const newResources = { ...resources };

    // Apply costs
    (
      Object.entries(costs) as Array<
        [keyof Resources, Resources[keyof Resources]]
      >
    ).forEach(([key, value]) => {
      newResources[key] = Math.max(0, newResources[key] - value);
    });

    // Apply effects
    (
      Object.entries(activity.effects) as Array<
        [keyof Resources, Resources[keyof Resources]]
      >
    ).forEach(([key, value]) => {
      newResources[key] = Math.max(0, Math.min(100, newResources[key] + value));
    });

    // Skill improvement
    // eslint-disable-next-line react-hooks/purity
    if (activity.skillImpact && Math.random() < 0.3) {
      const newSkills = skills.map((s) =>
        s.name === activity.skillImpact && s.level < 5
          ? { ...s, level: s.level + 1 }
          : s,
      );
      setSkills(newSkills);
      setLog((prev) => [
        ...prev,
        `✨ ${activity.skillImpact} økte til nivå ${newSkills.find((s) => s.name === activity.skillImpact)?.level}!`,
      ]);
    }

    setResources(newResources);
    setLog((prev) => [...prev, `✓ ${activity.name} fullført`]);
  };

  const advanceDay = () => {
    setDay((d) => d + 1);

    // Night recovery
    const newResources = { ...resources };
    newResources.energi = Math.min(100, resources.energi + 30);
    newResources.kapasitet = Math.min(100, resources.kapasitet + 20);

    // Helse affects recovery
    if (resources.helse > 70) {
      newResources.energi = Math.min(100, newResources.energi + 10);
    }

    // Trygghet provides stability
    if (resources.trygghet > 60) {
      newResources.overskudd = Math.min(100, resources.overskudd + 10);
    }

    setResources(newResources);
    setLog((prev) => [...prev, `🌙 Dag ${day} er over. Ny dag starter.`]);
  };

  const getResourceColor = (value: number): string => {
    if (value > 70) return "bg-green-500";
    if (value > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getActivityColor = (category: string): string => {
    switch (category) {
      case "basic":
        return "border-gray-400";
      case "easy":
        return "border-green-400";
      case "moderate":
        return "border-yellow-400";
      case "hard":
        return "border-red-400";
      default:
        return "border-gray-400";
    }
  };

  return (
    <div className="mx-auto max-w-6xl bg-slate-50 p-6">
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          Lifelines - Ressurssystem
        </h1>
        <div className="flex items-center gap-4 text-slate-600">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Dag {day}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Resources Panel */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Ressurser</h2>

            {[
              {
                key: "energi",
                label: "Energi",
                icon: Zap,
                desc: "Fysisk stamina",
              },
              {
                key: "helse",
                label: "Helse",
                icon: Heart,
                desc: "Fysisk tilstand",
              },
              {
                key: "kapasitet",
                label: "Kapasitet",
                icon: Brain,
                desc: "Mental båndbredde",
              },
              {
                key: "overskudd",
                label: "Overskudd",
                icon: TrendingUp,
                desc: "Mental reserve",
              },
              {
                key: "trygghet",
                label: "Trygghet",
                icon: Shield,
                desc: "Stabilitet og selvtillit",
              },
            ].map(({ key, label, icon: Icon, desc }) => (
              <div key={key} className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-700">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {resources[key as keyof Resources]}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200">
                  <div
                    className={`h-3 rounded-full transition-all ${getResourceColor(resources[key as keyof Resources])}`}
                    style={{ width: `${resources[key as keyof Resources]}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Ferdigheter
            </h2>
            {skills.map((skill) => (
              <div key={skill.name} className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {skill.name}
                  </span>
                  <span className="text-xs text-slate-600">
                    Nivå {skill.level}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={advanceDay}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Neste dag →
          </button>
        </div>

        {/* Activities Panel */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Aktiviteter
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {activities.map((activity) => {
                const affordCheck = canAfford(activity);
                const costs = calculateCost(activity);

                return (
                  <div
                    key={activity.id}
                    className={`rounded-lg border-2 p-4 ${getActivityColor(activity.category)} ${
                      affordCheck.can ? "bg-white" : "bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-slate-800">
                        {activity.name}
                      </h3>
                      <Activity className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mb-3 text-sm text-slate-600">
                      {activity.description}
                    </p>

                    <div className="mb-3 space-y-1 text-xs">
                      {Object.entries(costs).length > 0 && (
                        <div className="text-red-600">
                          Koster:{" "}
                          {Object.entries(costs)
                            .map(([k, v]) => `${k} -${v}`)
                            .join(", ")}
                        </div>
                      )}
                      {Object.entries(activity.effects).length > 0 && (
                        <div className="text-green-600">
                          Gir:{" "}
                          {Object.entries(activity.effects)
                            .map(([k, v]) => `${k} ${v > 0 ? "+" : ""}${v}`)
                            .join(", ")}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => performActivity(activity)}
                      disabled={!affordCheck.can}
                      className={`w-full rounded py-2 text-sm font-medium transition-colors ${
                        affordCheck.can
                          ? "bg-slate-800 text-white hover:bg-slate-700"
                          : "cursor-not-allowed bg-slate-300 text-slate-500"
                      }`}
                    >
                      {affordCheck.can ? "Gjør aktivitet" : affordCheck.reason}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log Panel */}
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Aktivitetslogg
            </h2>
            <div className="h-48 overflow-y-auto rounded bg-slate-50 p-3">
              {log
                .slice()
                .reverse()
                .map((entry, i) => (
                  <div
                    key={i}
                    className="mb-1 font-mono text-sm text-slate-700"
                  >
                    {entry}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
          <div className="text-sm text-blue-900">
            <p className="mb-2 font-semibold">Emergente mekanismer:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                Ferdigheter reduserer kostnadene på aktiviteter (15% per nivå)
              </li>
              <li>Lav trygghet (under 60) øker mentale kostnader med 10-30%</li>
              <li>Høy helse forbedrer energigjenvinning ved søvn</li>
              <li>Trygghet over 60 gir daglig overskudd-bonus</li>
              <li>
                Noen aktiviteter krever minimum trygghet for å være
                tilgjengelige
              </li>
              <li>
                Ferdigheter forbedres tilfeldig (30% sjanse) når aktivitet
                gjøres
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSystem;
