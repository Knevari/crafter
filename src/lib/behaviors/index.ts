import type { Behavior } from "../types";
import { updateWanderBehavior } from "./wander";

const behaviors: Record<string, Behavior> = {
  wander: updateWanderBehavior,
};

export default behaviors;
