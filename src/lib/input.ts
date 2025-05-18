import { PLAYER_RANGE, TILE_SIZE } from "./constants";
import { engine } from "./engine";
import { getEntityAtWorldPosition, handleEntityClick } from "./entities";
import { gameState } from "./game-state";
import { distance } from "./math";
import { isColliding } from "./utils/is-colliding";

export const pressedKeys = new Set();

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "z") gameState.debug = !gameState.debug;
  if (event.key === "x") gameState.profile = !gameState.profile;
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
    document.body.style.cursor = "pointer";
  } else if (!hoveringAnyEntity && document.body.style.cursor === "pointer") {
    document.body.style.cursor = "auto";
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

  gameState.player.attacking = true;
});
