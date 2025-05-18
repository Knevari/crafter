import Alea from "alea";
import { init } from "@paralleldrive/cuid2";
import { createNoise2D } from "simplex-noise";
import { SEED } from "./constants";
import { map } from "./math";

export const prng = Alea(SEED);
export const noise = createNoise2D(prng);

export function scaledNoise(x: number, y: number) {
  return map(noise(x, y), -1, 1, 0, 1);
}

export function rand(min: number, max: number) {
  return Math.floor(prng() * (max - min) + min);
}

export const createId = init({
  random: prng,
  length: 10,

  fingerprint: "bleb",
});
