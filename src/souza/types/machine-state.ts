import type { ParameterType } from "./state-machine-parameter";

export enum stateMachineComparison {
  EQUAL = "==",
  NOTEQUAL = "!=",
  GREATER = ">",
  LESSOREQUAL = "<=",
}

export interface stateMachineCondition {
  parameter: string;
  type: ParameterType;
  comparison: stateMachineComparison;
  value: boolean | number;
}

export interface stateMachineTransition {
  from: string;
  to: string;
  conditions: stateMachineCondition[];
}

export interface stateMachineState {
  name: string;
  data?: any;
  loop?: boolean;
}

export type StateMap = Record<string, stateMachineState>;
export interface StateMachine {
  currentState: string;
  stateTime: number;
  states: StateMap;
  transitions: stateMachineTransition[];
}
