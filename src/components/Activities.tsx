import { activities } from "../data/Activities";
import { ActivityView } from "./Activity";

export function Activities() {
  return activities.map((activity) => (
    <ActivityView key={activity.name} activity={activity} />
  ));
}
