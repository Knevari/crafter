export enum ParameterType {
  BOOL = "bool",
  FLOAT = "float",
  INT = "int",
  TRIGGER = "trigger", 
}

export interface BaseParameter {
  type: ParameterType;
}

export interface BoolParameter extends BaseParameter {
  type: ParameterType.BOOL;
  value: boolean;
}

export interface FloatParameter extends BaseParameter {
  type: ParameterType.FLOAT;
  value: number;
}

export interface IntParameter extends BaseParameter {
  type: ParameterType.INT;
  value: number;
}

export type Parameter = BoolParameter | FloatParameter | IntParameter;
export type ParameterMap = Record<string, Parameter>;
