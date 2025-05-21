import { AnimatorComparison, type AnimatorCondition } from "../state-machine";
import { AnimatorParameterType, type AnimatorParametersComponent } from "../types/animator-parameters";

export function checkTransitionConditions(conditions: AnimatorCondition[], parameters: AnimatorParametersComponent): boolean {
  return conditions.every(cond => {
    switch (cond.type) {
      case AnimatorParameterType.BOOL:
        return compare(parameters.bools[cond.parameter], cond.comparison, cond.value);
      case AnimatorParameterType.FLOAT:
        return compare(parameters.floats[cond.parameter], cond.comparison, cond.value);
      case AnimatorParameterType.INT:
        return compare(parameters.ints[cond.parameter], cond.comparison, cond.value);
    }
  });
}

function compare(paramValue: boolean | number, comparison: AnimatorComparison, targetValue: boolean | number): boolean {
  switch (comparison) {
    case AnimatorComparison.EQUAL: return paramValue === targetValue;
    case AnimatorComparison.NOTEQUAL: return paramValue !== targetValue;
    case AnimatorComparison.GREATER: return (paramValue as number) > (targetValue as number);
    case AnimatorComparison.LESSOREQUAL: return (paramValue as number) <= (targetValue as number);
  }
}