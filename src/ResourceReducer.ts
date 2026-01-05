import type { Resource } from "./Data";

export const resourceReducer = (
  resources: Record<Resource, number>,
  action: { resource: Resource; amount: number; type: "added" | "subtracted" },
) => {
  switch (action.type) {
    case "added": {
      return {
        ...resources,
        [action.resource]: resources[action.resource] + action.amount,
      };
    }
    case "subtracted": {
      return {
        ...resources,
        [action.resource]: resources[action.resource] - action.amount,
      };
    }

    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};
