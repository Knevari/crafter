import { engine } from "../lib/engine";
import type { BaseEntity } from "../lib/types";
import { ECSComponents } from "./ecs/ecs-components";
import Input from "./input/Input";
import PCG32 from "./algorithms/PCG32/PCG32";
import { PerlinNoise2D } from "./algorithms/perlin-noise-2d/perlin-noise-2d";
import { generateTerrain } from "./terrain";
import AnimatorSystem from "./systems/animator-system";
import { cameraSystem } from "./systems/camera-system";
import { createColliderSystem } from "./systems/box-collider-system";
import FollowSystem from "./systems/follow-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import Time from "./systems/time";
import type { CameraComponent } from "./types/camera";
import type {  PositionComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import { ECSSystems } from "./ecs/ecs-system";
import CharacterControllerAnimationSystem from "./systems/character-controller-animations";
import CharacterControlerSystem from "./systems/character-controller-system";
import { createPlayer } from "./entities/player-entity";
import { createSlime } from "./entities/slime-entity";

export const ecs = new ECSComponents();
export const systems = new ECSSystems(ecs);

const camera: CameraComponent = {
  enabled: true,
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
};

ecs.addSingleton<CameraComponent>(ComponentType.Camera, camera);

const seed = new PCG32(1234567890123456789n, 9876543210987654321n);
const perlin = new PerlinNoise2D(seed);

const width = 32;
const height = 32;
const persistence = 0.2;
const octaves = 6;
const scale = 16;
const terrainMatrix = generateTerrain(perlin, width, height, octaves, persistence, scale);

const player = createPlayer(ecs, "player");
const slime = createSlime(ecs, "slime");

systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(createColliderSystem());
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControlerSystem());
systems.addSystem(createColliderSystem())
systems.addSystem(CharacterControllerAnimationSystem())
systems.addSystem(FollowSystem(player, [slime], 40, 200));
systems.addSystem(cameraSystem(engine.ctx, player));

export function app() {

  const time = new Time();

  time.on("start", () => {
    Input.start();

  });

  time.on("fixedUpdate", () => {
    systems.callFixedUpdate();
  });
  time.on("lateUpdate", () => {
    systems.callLatedUpdate();

  });

  time.on("render", () => {
    engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    systems.callRender();
    systems.callDrawGizmos();

  });

  time.on("update", () => {
    systems.callUpdate(Time.deltaTime);
    Input.clearInputs();
  });

  time.start();
}

export function renderTerrainBase(
  terrain: number[][],
  scale: number
) {
  const height = terrain.length;
  const width = terrain[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = terrain[y][x];
      const screenX = x * scale;
      const screenY = y * scale;

      const entity: BaseEntity = { id: `ground_${x}_${y}` };
      ecs.addComponent<PositionComponent>(entity, ComponentType.Position, { entity: entity, x: screenX, y: screenY, enabled: true });

      ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
        entity: entity,
        color: {r: value * 255, g: value * 255, b: value * 255, a: 1},
        sprite: null,
        scale: scale,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        layer: -1,
        enabled: true,
      });
    }
  }
}

renderTerrainBase(terrainMatrix, scale);