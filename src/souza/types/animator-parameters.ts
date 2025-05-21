export interface AnimatorParametersComponent {
  bools: Record<string, boolean>;
  floats: Record<string, number>;
  ints: Record<string, number>;
}

export enum AnimatorParameterType {
  BOOL = "bool",
  FLOAT = "float",
  INT = "int",
}