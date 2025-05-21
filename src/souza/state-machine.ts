import type { AnimatorParameterType } from "./types/animator-parameters";

export interface AnimatorState {
  name: string;
  animation: string;
  loop?: boolean;
}



export enum AnimatorComparison {
  EQUAL = "==",
  NOTEQUAL = "!=",
  GREATER = ">",
  LESSOREQUAL = "<=",
}

export interface AnimatorCondition {
  parameter: string;
  type: AnimatorParameterType;
  comparison: AnimatorComparison;
  value: boolean | number;
}

export interface AnimatorTransition {
  from: string;
  to: string;
  conditions: AnimatorCondition[];
}

export interface AnimatorStateMachineComponent {
  currentState: string;
  stateTime: number;
  states: Record<string, AnimatorState>;
  transitions: AnimatorTransition[];
}

