import type { Chunk, ChunkKey, GameState } from "./types";
import { createPlayer } from "./utils/create-player";

function createInitialGameState(): GameState {
  // const savedGame = loadGameFromLocalStorage();
  // if (savedGame) {
  //   return savedGame;
  // } else {
  const player = createPlayer();
  return {
    chunks: {},
    camera: {
      position: {
        x: 0,
        y: 0,
      },
      dimensions: {
        width: 0,
        height: 0,
      },
      target: player,
    },
    player,
    hoveredEntityId: "",
    entities: [],
    inventory: [],
    dayNightCycle: {
      daylight: true,
      lastCycle: 0,
    },
    debug: true,
    profile: true,
    gameTime: 0,
  };
  // }
}

export const gameState = createInitialGameState();

export function saveGameIntoLocalStorage(state: GameState) {
  localStorage.setItem("save", JSON.stringify(state));
}

export function loadGameFromLocalStorage() {
  const savedGame = localStorage.getItem("save");

  if (!savedGame) {
    return null;
  }

  const json = JSON.parse(savedGame) as GameState;
  return json;
}
