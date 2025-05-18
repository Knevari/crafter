export function floor(value: number) {
  return Math.floor(value);
}

export function ceil(value: number) {
  return Math.ceil(value);
}

export function round(value: number) {
  return Math.round(value);
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) {
  const result =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

  if (start2 < stop2) {
    return constrain(result, start2, stop2);
  } else {
    return constrain(result, stop2, start2);
  }
}

export function constrain(value: number, low: number, high: number) {
  return Math.max(Math.min(value, high), low);
}
