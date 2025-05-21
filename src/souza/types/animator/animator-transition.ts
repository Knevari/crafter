import type { AnimatorCondition } from "./animator-condition";

export interface AnimatorTransition {
  from: string;
  to: string;
  conditions: AnimatorCondition[];
}