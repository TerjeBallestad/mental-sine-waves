import { AActivity } from "../data/Activities";
import { ActivityView } from "./ActivityView";

type Props = {
  activities: Array<AActivity>;
};

export function ActivityList({ activities }: Props) {
  return activities.map((activity) => (
    <ActivityView key={activity.name} activity={activity} />
  ));
}
