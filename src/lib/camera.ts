import { gameState } from "./game-state";

export function updateCamera(deltaTime: number) {
  gameState.camera.position.x +=
    (gameState.camera.target.position.x -
      gameState.camera.dimensions.width / 2 -
      gameState.camera.position.x) *
    0.1;
  gameState.camera.position.y +=
    (gameState.camera.target.position.y -
      gameState.camera.dimensions.height / 2 -
      gameState.camera.position.y) *
    0.1;
}

export function resetCamera() {
  gameState.camera.position.x =
    gameState.camera.target.position.x - gameState.camera.dimensions.width / 2;
  gameState.camera.position.y =
    gameState.camera.target.position.y - gameState.camera.dimensions.height / 2;
}
