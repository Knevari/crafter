import { loadAssets } from "./lib/assets";
import { resetCamera, updateCamera } from "./lib/camera";
import {
  createChunk,
  disposeOfDistantChunks,
  generateChunksAround,
} from "./lib/chunks";
import { DAY_AND_NIGHT_CYCLE_IN_SECONDS } from "./lib/constants";
import {
  createEntity,
  cullDistantEntities,
  updateDroppedItems,
  updateEntities,
} from "./lib/entities";
import { spawnPlayer, updatePlayer } from "./lib/player";
import { engine } from "./lib/engine";
import { gameState, saveGameIntoLocalStorage } from "./lib/game-state";
import { EntityType } from "./lib/types";
import { UI } from "./lib/ui";

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

  UI.render();
  createChunk(0, 0);
  generateChunksAround(
    gameState.player.position.x,
    gameState.player.position.y,
  );

  if (!gameState.loadedFromStorage) {
    spawnPlayer();
    spawnDebugStuff();
  }

  resetCamera();

  // saveGameIntoLocalStorage(gameState);
  gameState.player.health.current = 8;
  UI.healthBar.update();

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
    // gameState.dayNightCycle.daylight = !gameState.dayNightCycle.daylight;
    // gameState.dayNightCycle.lastCycle = gameState.gameTime;
    // saveGameIntoLocalStorage(gameState);
  }

  // chunks
  // generateChunksAround(
  //   gameState.player.position.x,
  //   gameState.player.position.y,
  // );
  // disposeOfDistantChunks();

  // update stuff
  updatePlayer(deltaTime);
  updateCamera(deltaTime);
  updateEntities(deltaTime);
  updateDroppedItems(deltaTime);
  cullDistantEntities();

  // draw stuff
  engine.renderer.draw();

  requestAnimationFrame(update);
}

main();

function spawnDebugStuff() {
  createEntity(
    EntityType.PIG,
    gameState.player.position.x,
    gameState.player.position.y - 600,
    1,
    1,
  );
  createEntity(
    EntityType.TREE,
    gameState.player.position.x - 500,
    gameState.player.position.y - 200,
    4,
    5,
  );
  createEntity(
    EntityType.ROCK,
    gameState.player.position.x - 200,
    gameState.player.position.y - 200,
    1,
    1,
  );
  createEntity(
    EntityType.SLIME,
    gameState.player.position.x - 300,
    gameState.player.position.y - 200,
    1,
    1,
  );
  createEntity(
    EntityType.SLIME_GREEN,
    gameState.player.position.x - 300,
    gameState.player.position.y - 150,
    1,
    1,
  );
  createEntity(
    EntityType.SKELETON,
    gameState.player.position.x - 150,
    gameState.player.position.y - 150,
    1,
    1,
  );
  createEntity(
    EntityType.AXE,
    gameState.player.position.x - 200,
    gameState.player.position.y,
    0.7,
    0.7,
  );
}

// @ts-ignore
window.saveProgress = () => saveGameIntoLocalStorage(gameState);
// @ts-ignore
window.resetProgress = () => {
  localStorage.removeItem("save");
};
