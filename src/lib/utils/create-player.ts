import { PLAYER_SIZE } from "../constants";
import { EntityType, type Player } from "../types";

export function createPlayer(): Player {
  const player: Player = {
    id: "player",
    type: EntityType.PLAYER,
    sprite: null,
    position: {
      x: 0,
      y: 0,
    },
    animator: {
      animations: {
        "attack-down": {
          row: 6,
          frames: 4,
          frameDuration: 0.08,
          totalDuration: 0.08 * 4,
        },
        "attack-right": {
          row: 7,
          frames: 4,
          frameDuration: 0.08,
          totalDuration: 0.08 * 4,
        },
        "attack-left": {
          row: 7,
          frames: 4,
          frameDuration: 0.08,
          totalDuration: 0.08 * 4,
        },
        "attack-up": {
          row: 8,
          frames: 4,
          frameDuration: 0.08,
          totalDuration: 0.08 * 4,
        },
        "idle-down": {
          row: 0,
          frames: 6,
          frameDuration: 0.15,
        },
        "walk-right": {
          row: 4,
          frames: 6,
          frameDuration: 0.15,
        },
        "walk-left": {
          row: 4,
          frames: 6,
          frameDuration: 0.15,
        },
        "walk-up": {
          row: 2,
          frames: 6,
          frameDuration: 0.15,
        },
        "walk-down": {
          row: 3,
          frames: 6,
          frameDuration: 0.15,
        },
      },
      current: "idle",
      frame: 0,
      elapsed: 0,
      startTime: 0,
    },
    direction: "down",
    health: {
      max: 10,
      current: 10,
    },
    drops: [],
    dimensions: {
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    },
    speed: 400,
    moving: false,
    attacking: false,
  };
  return player;
}
