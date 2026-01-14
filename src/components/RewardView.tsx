import clsx from "clsx";
import type { Resource } from "../data/Resources";

type Props = {
  resource: Resource;
  amount: number;
  resonance: number;
  time: number;
  idx: number;
};

export function RewardView({ resource, resonance, amount, idx }: Props) {
  return (
    <div
      className={clsx(
        "text-base-100 rounded-lg px-3 py-2 text-sm font-bold shadow-sm transition-all",
        {
          "bg-success": resonance > 0.65,
          "bg-warning": resonance > 0.45 && resonance <= 0.65,
          "bg-error": resonance <= 0.45,
        },
      )}
      style={{
        opacity: 1 - idx * 0.02,
      }}
    >
      <div>{resource}</div>
      <div className="flex justify-between">
        <div>{Math.round(amount)}</div>
        <div>{Math.round(resonance * 100)}%</div>
      </div>
    </div>
  );
}
