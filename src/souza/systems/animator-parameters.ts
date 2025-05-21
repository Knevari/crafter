import type { AnimatorParameters } from "../types/animator/animator-parameters";

export class AnimatorParameterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnimatorParameterError";
  }
}

export function setBool(params: AnimatorParameters, name: string, value: boolean): void {
  if (!(name in params.bools)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro booleano: parâmetro "${name}" não encontrado.`);
  }
  params.bools[name] = value;
}

export function getBool(params: AnimatorParameters, name: string): boolean {
  if (!(name in params.bools)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro booleano: parâmetro "${name}" não encontrado.`);
  }
  return params.bools[name];
}

export function setInt(params: AnimatorParameters, name: string, value: number): void {
  if (!(name in params.ints)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro inteiro: parâmetro "${name}" não encontrado.`);
  }
  params.ints[name] = value;
}

export function getInt(params: AnimatorParameters, name: string): number {
  if (!(name in params.ints)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro inteiro: parâmetro "${name}" não encontrado.`);
  }
  return params.ints[name];
}

export function setFloat(params: AnimatorParameters, name: string, value: number): void {
  if (!(name in params.floats)) {
    throw new AnimatorParameterError(`Falha ao definir parâmetro float: parâmetro "${name}" não encontrado.`);
  }
  params.floats[name] = value;
}

export function getFloat(params: AnimatorParameters, name: string): number {
  if (!(name in params.floats)) {
    throw new AnimatorParameterError(`Falha ao obter parâmetro float: parâmetro "${name}" não encontrado.`);
  }
  return params.floats[name];
}
