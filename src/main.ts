import { loadAssets } from "./lib/assets";
import { resetCamera, updateCamera } from "./lib/camera";
import {
  createChunk,
  disposeOfDistantChunks,
  generateChunksAround,
} from "./lib/chunks";
import { DAY_AND_NIGHT_CYCLE_IN_SECONDS } from "./lib/constants";
import {
  createEntityLib,
  cullDistantEntities,
  updateDroppedItems,
  updateEntities,
} from "./lib/entities";
import { spawnPlayer, updatePlayer } from "./lib/player";

import { gameState, saveGameIntoLocalStorage } from "./lib/game-state";
import { EntityType } from "./lib/types";
import { UI } from "./lib/ui";

import { engine } from "./lib/engine";

engine.canvas.width = window.innerWidth;
engine.canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  engine.canvas.width = window.innerWidth;
  engine.canvas.height = window.innerHeight;
});




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
  requestAnimationFrame(update);
}

let lastUpdatedAt = performance.now();
let deltaTime = 0;

export const timeDebug = document.querySelector("#time-debug") as HTMLElement;


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



  updateCamera(deltaTime);
  updateEntities(deltaTime);
  updateDroppedItems(deltaTime);
  cullDistantEntities();

  updatePlayer(deltaTime)

  // draw stuff
  engine.renderer.draw();


  requestAnimationFrame(update);

}

main();
function spawnDebugStuff() {
  const refX = gameState.player.position.x;
  const refY = gameState.player.position.y;
  createEntityLib(EntityType.PIG, refX, refY - 600, 1, 1);
  createEntityLib(EntityType.TREE, refX - 500, refX - 200, 4, 5);
  createEntityLib(EntityType.ROCK, refX - 200, refY - 200, 1, 1);
  createEntityLib(EntityType.SLIME, refX - 300, refY - 200, 1, 1);
  createEntityLib(EntityType.SLIME_GREEN, refX - 300, refY - 150, 1, 1);
  createEntityLib(EntityType.SKELETON, refX - 150, refY - 150, 1, 1);
  createEntityLib(EntityType.AXE, refX - 200, refY, 0.7, 0.7);
  createEntityLib(EntityType.CRAFTING_TABLE, refX + 50, refY + 50, 1, 1);


}

