
import { createSpriteRender } from "../builders/createSpriteRender";
import { createGameEntity } from "../builders/createGameEntity";
import { BiomeName, getBiomeColor } from "./biome";
import { type TerrainCell, World } from "./Word";
import { ChunkManager } from "./ChunkManager";
import { ComponentType } from "../types/component-type";
import type TransformComponent from "../gears/transform/transform.types";
import { createTransform } from "../gears/transform/transform.types";
import type { Vec2 } from "../Vec2/Vec2";
import type { GameEntity } from "../types/EngineEntity";
import { OAK_TRE_0 } from "../../game/sprites/oak.tree";
import { Mulberry32 } from "../algorithms/mulberry32";
import { OAK_TRE_SHADOW } from "../../game/sprites/oak.tree.shadow";
import type { System } from "../gears/ecs/system";
import type { ECSComponentState } from "../gears/ecs/component";
import { ECS } from "../../engine/TwoD";
import { getId } from "../builders/createId";

export function TerrainSystem(componentState: ECSComponentState): System {
  let playerPos: Vec2;
  const world = new World(1221435);
  return {
    start() {
      playerPos =
        ECS.Component.getComponentsByType<TransformComponent>(componentState, ComponentType.TRANSFORM)
          .find((c) => c.gameEntity?.name === "player")?.position ??
        { x: 0, y: 0 };

      ChunkManager.on("chunkLoaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          generateTerrainEntities(componentState, chunk.cells, chunk.gameEntities);
          generateTrees(componentState, chunk.cells, chunk.gameEntities, pos);

        }
      });

      ChunkManager.on("chunkUnloaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          for (const entity of chunk.gameEntities) {
            ECS.Component.destroyEntityAndComponents(componentState, entity);
          }
          chunk.gameEntities = [];
        }
      });

      ChunkManager.updateAround(playerPos, 1, world);
    },

    update() {
      ChunkManager.updateAround(playerPos, 1, world);
    },
  };
}

function generateTerrainEntities(
  componentState: ECSComponentState,
  terrainCells: TerrainCell[],
  gameEntities: GameEntity[],
): void {
  for (const cell of terrainCells) {
    const gameEntity: GameEntity = createGameEntity(`ground_${cell.x}_${cell.y}`, "ground");

    const transform = createTransform(gameEntity, { x: cell.x, y: cell.y });
    ECS.Component.addComponent(componentState, gameEntity, transform, false);

    const spriteReder = createSpriteRender(gameEntity, {
      color: getBiomeColor(cell.biome ?? BiomeName.DEEP_WATER),
      layer: -1,
      scale: cell.scale,
    });

    ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);

    gameEntities.push(gameEntity);
  }
}

function seedFromXY(x: number, y: number): number {
  const PRIME1 = 73856093;
  const PRIME2 = 19349663;
  return (x * PRIME1) ^ (y * PRIME2);
}

export function generateTrees(
  componentState: ECSComponentState,
  terrainCells: TerrainCell[],
  gameEntities: GameEntity[],
  chunkPos: Vec2
) {


  const seed = seedFromXY(chunkPos.x, chunkPos.y);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {


    if (cell.biome === BiomeName.DENSE_FOREST || cell.biome === BiomeName.FOREST) {

      if (rng.nextFloat() < 0.1) {
        const gameEntity: GameEntity = createGameEntity(`tree_${cell.x}_${cell.y}`, "tree");

        const transform = createTransform(gameEntity, { x: cell.x, y: cell.y });
        ECS.Component.addComponent(componentState, gameEntity, transform, false);

        const spriteReder = createSpriteRender(gameEntity, {
          layer: -1,
          sprite: OAK_TRE_0,
          scale: 3,
        });

        ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);

        gameEntities.push(gameEntity);
      }

    }


  }
}