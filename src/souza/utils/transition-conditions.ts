import { AnimatorComparison } from "../types/animator-comparison";
import { AnimatorParameterType } from "../types/animator-parameter-type";
import type { AnimatorCondition } from "../types/animator-condition";
import type { AnimatorParameters } from "../types/animator-parameters";

export function checkTransitionConditions(
  conditions: AnimatorCondition[],
  parameters: AnimatorParameters
): boolean {
  return conditions.every((condition) => {
    const { parameter, type, comparison, value } = condition;

    const paramValue = getParameterValue(parameters, type, parameter);
    if (paramValue === undefined) return false;

    return evaluateComparison(paramValue, comparison, value);
  });
}

function getParameterValue(
  parameters: AnimatorParameters,
  type: AnimatorParameterType,
  key: string
): boolean | number | undefined {
  switch (type) {
    case AnimatorParameterType.BOOL:
      return parameters.bools[key];
    case AnimatorParameterType.FLOAT:
      return parameters.floats[key];
    case AnimatorParameterType.INT:
      return parameters.ints[key];
    default:
      return undefined;
  }
}

function evaluateComparison(
  paramValue: boolean | number,
  comparison: AnimatorComparison,
  targetValue: boolean | number
): boolean {
  switch (comparison) {
    case AnimatorComparison.EQUAL:
      return paramValue === targetValue;
    case AnimatorComparison.NOTEQUAL:
      return paramValue !== targetValue;
    case AnimatorComparison.GREATER:
      return (paramValue as number) > (targetValue as number);
    case AnimatorComparison.LESSOREQUAL:
      return (paramValue as number) <= (targetValue as number);
    default:
      return false;
  }
}
