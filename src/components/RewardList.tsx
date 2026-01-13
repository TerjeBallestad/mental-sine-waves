import type { Resource } from "../data/Resources";
import { RewardView } from "./RewardView";

type Props = {
  recentRewards: Array<{
    resource: Resource;
    amount: number;
    resonance: number;
    time: number;
  }>;
};

export function RewardList({ recentRewards }: Props) {
  return recentRewards.map((reward, idx) => (
    <RewardView
      key={reward.time}
      resource={reward.resource}
      amount={reward.amount}
      idx={idx}
      resonance={reward.resonance}
      time={reward.time}
    />
  ));
}
