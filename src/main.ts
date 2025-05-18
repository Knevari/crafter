import { loadAssets } from "./lib/assets";
import { updateCamera } from "./lib/camera";
import {
  createChunk,
  disposeOfDistantChunks,
  generateChunksAround,
} from "./lib/chunks";
import { DAY_AND_NIGHT_CYCLE_IN_SECONDS } from "./lib/constants";
import { updateDroppedItems, updateEntities } from "./lib/entities";
import { spawnPlayer, updatePlayer } from "./lib/player";
import { engine } from "./lib/engine";
import { gameState, saveGameIntoLocalStorage } from "./lib/game-state";

engine.canvas.width = window.innerWidth;
engine.canvas.height = window.innerHeight;

gameState.camera.dimensions.width = engine.canvas.width;
gameState.camera.dimensions.height = engine.canvas.height;

async function main() {
  try {
    await loadAssets();
  } catch {
    throw new Error("Unable to load assets, verify if files exist");
  }

  createChunk(0, 0);
  generateChunksAround(
    gameState.player.position.x,
    gameState.player.position.y,
  );
  spawnPlayer();

  requestAnimationFrame(update);
}

let lastUpdatedAt = performance.now();
let deltaTime = 0;

function update(now: number) {
  deltaTime = (now - lastUpdatedAt) / 1000;
  lastUpdatedAt = now;

  gameState.gameTime += deltaTime;

  if (
    gameState.gameTime - gameState.dayNightCycle.lastCycle >
    DAY_AND_NIGHT_CYCLE_IN_SECONDS
  ) {
    gameState.dayNightCycle.daylight = !gameState.dayNightCycle.daylight;
    gameState.dayNightCycle.lastCycle = gameState.gameTime;
    saveGameIntoLocalStorage(gameState);
  }

  // chunks
  generateChunksAround(
    gameState.player.position.x,
    gameState.player.position.y,
  );
  disposeOfDistantChunks();

  // update stuff
  updatePlayer(deltaTime);
  updateCamera(deltaTime);
  updateEntities(deltaTime);
  updateDroppedItems(deltaTime);

  // draw stuff
  engine.renderer.draw();

  requestAnimationFrame(update);
}

main();
