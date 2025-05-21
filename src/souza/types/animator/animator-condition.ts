import type { AnimatorComparison } from "./animator-comparison";
import type { AnimatorParameterType } from "./animator-parameter-type";

export interface AnimatorCondition {
  parameter: string;
  type: AnimatorParameterType;
  comparison: AnimatorComparison;
  value: boolean | number;
}