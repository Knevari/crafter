import type { stateMachineCondition } from "../types/machine-state";
import type { ParameterMap, ParameterType } from "../types/state-machine-parameter";
import { stateMachineComparison } from "../types/machine-state"; 

export function checkTransitionConditions(
  conditions: stateMachineCondition[],
  parameters: ParameterMap
): boolean {
  return conditions.every(condition => {
    const { parameter, type, comparison, value } = condition;
    condition.type

    const paramValue = getParameterValue(parameters, type, parameter);
    if (paramValue === undefined) return false;

    return evaluateComparison(paramValue, comparison, value);
  });
}

function getParameterValue(
  parameters: ParameterMap,
  type: ParameterType,
  key: string
): boolean | number | undefined {
  const param = parameters[key];
  if (!param) return undefined;
  if (param.type !== type) return undefined;
  return param.value;
}

function evaluateComparison(
  paramValue: boolean | number,
  comparison: stateMachineComparison,
  targetValue: boolean | number
): boolean {
  switch (comparison) {
    case stateMachineComparison.EQUAL:
      return paramValue === targetValue;
    case stateMachineComparison.NOTEQUAL:
      return paramValue !== targetValue;
    case stateMachineComparison.GREATER:
      return (paramValue as number) > (targetValue as number);
    case stateMachineComparison.LESSOREQUAL:
      return (paramValue as number) <= (targetValue as number);
    default:
      return false;
  }
}
