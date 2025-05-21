import type { AnimatorParametersComponent } from "../types/animator-parameters";

export class AnimatorParameterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnimatorParameterError";
  }
}

export function setBool(params: AnimatorParametersComponent, name: string, value: boolean): void {
  if (!(name in params.bools)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro booleano: parâmetro "${name}" não encontrado.`);
  }
  params.bools[name] = value;
}

export function getBool(params: AnimatorParametersComponent, name: string): boolean {
  if (!(name in params.bools)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro booleano: parâmetro "${name}" não encontrado.`);
  }
  return params.bools[name];
}

export function setInt(params: AnimatorParametersComponent, name: string, value: number): void {
  if (!(name in params.ints)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro inteiro: parâmetro "${name}" não encontrado.`);
  }
  params.ints[name] = value;
}

export function getInt(params: AnimatorParametersComponent, name: string): number {
  if (!(name in params.ints)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro inteiro: parâmetro "${name}" não encontrado.`);
  }
  return params.ints[name];
}

export function setFloat(params: AnimatorParametersComponent, name: string, value: number): void {
  if (!(name in params.floats)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro float: parâmetro "${name}" não encontrado.`);
  }
  params.floats[name] = value;
}

export function getFloat(params: AnimatorParametersComponent, name: string): number {
  if (!(name in params.floats)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro float: parâmetro "${name}" não encontrado.`);
  }
  return params.floats[name];
}
