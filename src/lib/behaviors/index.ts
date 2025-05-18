import type { Behavior } from "../types";
import { updateWanderBehavior } from "./wander";
import { updateFollowPlayerBehavior } from "./follow-player";

const behaviors: Record<string, Behavior> = {
  wander: updateWanderBehavior,
  "follow-player": updateFollowPlayerBehavior,
};

export default behaviors;
