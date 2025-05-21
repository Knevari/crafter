import { PLAYER_RANGE, TILE_SIZE } from "./constants";
import { engine } from "./engine";
import { getEntityAtWorldPosition, handleEntityClick } from "./entities";
import { gameState, saveGameIntoLocalStorage } from "./game-state";
import { distance } from "./math";
import type { Direction } from "./types";
import { UI } from "./ui";
import { isColliding } from "./utils/is-colliding";

export const pressedKeys = new Set();

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "z") gameState.debug = !gameState.debug;
  if (event.key === "x") gameState.profile = !gameState.profile;
  if (event.key === "c")
    gameState.dayNightCycle.daylight = !gameState.dayNightCycle.daylight;
  if (event.key === "F5") {
    event.preventDefault();
    saveGameIntoLocalStorage(gameState);
    UI.text.savedGame.setPosition(130, 24);
    UI.text.savedGame.fadeIn();
    setTimeout(() => {
      UI.text.savedGame.fadeOut();
    }, 2000);
  }
  if (event.key === "F6") {
    event.preventDefault();
    localStorage.removeItem("save");
    window.location.reload();
  }
  pressedKeys.add(event.key);
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
  pressedKeys.delete(event.key);
});

export const cursor = {
  x: 0,
  y: 0,
  size: 4,
};

engine.canvas.addEventListener("mousemove", (event) => {
  const { top, left } = engine.canvas.getBoundingClientRect();
  cursor.x = event.clientX - left;
  cursor.y = event.clientY - top;

  let hoveringAnyEntity = false;

  // Verify if its hovering any entities
  gameState.entities.forEach((entity) => {
    const entityCenterX =
      entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
    const entityCenterY =
      entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

    const hovering = isColliding(
      cursor.x + gameState.camera.position.x,
      cursor.y + gameState.camera.position.y,
      cursor.size,
      cursor.size,
      entityCenterX,
      entityCenterY,
      entity.dimensions.width * TILE_SIZE,
      entity.dimensions.height * TILE_SIZE,
    );

    if (hovering) {
      hoveringAnyEntity = true;
      gameState.hoveredEntityId = entity.id;
    }
  });

  if (hoveringAnyEntity) {
    document.body.classList.add("hover");
  } else {
    document.body.classList.remove("hover");
    gameState.hoveredEntityId = "";
  }
});

engine.canvas.addEventListener("mousedown", (event) => {
  const { top, left } = engine.canvas.getBoundingClientRect();
  const clickX = event.clientX - left;
  const clickY = event.clientY - top;

  const clickWorldX = clickX + gameState.camera.position.x;
  const clickWorldY = clickY + gameState.camera.position.y;

  // Verify if the click hit something
  const clickedEntity = getEntityAtWorldPosition(clickWorldX, clickWorldY);

  if (clickedEntity) {
    const distanceFromPlayer = distance(
      gameState.player.position.x,
      gameState.player.position.y,
      clickedEntity.position.x +
        (clickedEntity.dimensions.width * TILE_SIZE) / 2,
      clickedEntity.position.y +
        (clickedEntity.dimensions.height * TILE_SIZE) / 2,
    );

    if (distanceFromPlayer < PLAYER_RANGE * TILE_SIZE) {
      handleEntityClick(clickedEntity);
    }
  }

  const clickDirX = clickWorldX - gameState.player.position.x;
  const clickDirY = clickWorldY - gameState.player.position.y;

  const length = Math.hypot(clickDirX, clickDirY);

  const dirX = clickDirX / length;
  const dirY = clickDirY / length;

  const absX = Math.abs(dirX);
  const absY = Math.abs(dirY);

  let direction: Direction = "down";

  if (absX > absY) {
    direction = clickDirX > 0 ? "right" : "left";
  } else {
    direction = clickDirY > 0 ? "down" : "up";
  }

  gameState.player.data.attacking = true;
  gameState.player.data.direction = direction;
  gameState.player.data.lockedDirection = direction;
});
