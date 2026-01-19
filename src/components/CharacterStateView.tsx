import clsx from "clsx";
import { keyToName } from "../functions/FunctionLibrary";
import type { CharacterState } from "../data/Characters";
import {
  Zap,
  Brain,
  Heart,
  Shield,
  TrendingUp,
  Target,
  Battery,
  AlertTriangle,
} from "lucide-react";

type StateViewProps = {
  name: string;
  value: number;
};

type StateListProps = {
  state: CharacterState;
};

const stateIcons: Record<keyof CharacterState, typeof Zap> = {
  energy: Zap,
  mentalCapacity: Brain,
  attention: Brain,
  will: Target,
  security: Shield,
  overskudd: TrendingUp,
  workingMemory: Brain,
  socialBattery: Battery,
  flow: TrendingUp,
  nutrition: Heart,
  purpose: Target,
  mood: Heart,
};

const stateDescriptions: Partial<Record<keyof CharacterState, string>> = {
  energy: "Physical stamina and vitality",
  mentalCapacity: "Cognitive bandwidth for complex tasks",
  attention: "Ability to focus and concentrate",
  will: "Willpower to do difficult tasks",
  security: "Feeling of safety and stability",
  overskudd: "Mental surplus and capacity",
  workingMemory: "Ability to hold multiple things in mind",
  socialBattery: "Capacity for social interaction",
  flow: "State of optimal performance",
  nutrition: "Quality of food consumed",
  purpose: "Sense of meaning and direction",
  mood: "Overall emotional state",
};

export function CharacterStateList({ state }: StateListProps) {
  // Only show Overskudd - hide all other stats
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CharacterStateView name="overskudd" value={state.overskudd} />
    </div>
  );
}

export function CharacterStateView({ name, value }: StateViewProps) {
  const Icon = stateIcons[name as keyof CharacterState] || Zap;
  const description = stateDescriptions[name as keyof CharacterState];
  const isLow = value <= 20;
  const isMedium = value > 20 && value <= 60;
  const isNegative = value < 0;

  const getStatusColor = () => {
    if (isNegative) return "text-error";
    if (isLow) return "text-error";
    if (isMedium) return "text-warning";
    return "text-success";
  };

  const getProgressColor = () => {
    if (isNegative) return "progress-error";
    if (isLow) return "progress-error";
    if (isMedium) return "progress-warning";
    return "progress-success";
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={clsx("size-5", getStatusColor())} />
            <span className="font-semibold capitalize">
              {keyToName(name)}
            </span>
          </div>
          <div className={clsx("badge badge-lg", getStatusColor())}>
            {isNegative ? (
              <span className="text-error">{value.toFixed(1)}</span>
            ) : (
              <span>{Math.round(value)}/100</span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-xs opacity-70 mb-2">{description}</p>
        )}

        <progress
          className={clsx("progress w-full h-3", getProgressColor())}
          value={isNegative ? 0 : Math.min(100, Math.max(0, value))}
          max={100}
        />

        {isNegative && name === "overskudd" && (
          <div className="alert alert-error alert-sm mt-2">
            <AlertTriangle className="size-4" />
            <span className="text-xs">
              Overskudd is negative! Activities will stop automatically.
            </span>
          </div>
        )}

        {isLow && !isNegative && (
          <div className="alert alert-error alert-sm mt-2">
            <AlertTriangle className="size-4" />
            <span className="text-xs">
              {name === "overskudd" &&
                "Low overskudd! You need mental rest."}
            </span>
          </div>
        )}

        {isMedium && name === "mood" && (
          <div className="alert alert-warning alert-sm mt-2">
            <span className="text-xs">Mood could be better.</span>
          </div>
        )}
      </div>
    </div>
  );
}
