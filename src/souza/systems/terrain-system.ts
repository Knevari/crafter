import type { ECSComponents } from "../ecs/ecs-components";
import type { System } from "../types/system";
import { createSpriteRender } from "../builders/createSpriteRender";
import { entity_create_tree } from "../entities/grass-entity";
import {
  FIR_TREE_0,
  FIR_TREE_1,
  FIR_TREE_3,
  FIR_TREE_4,
} from "../sprites/tree-sprite";
import { createGameEntity } from "../builders/createGameEntity";
import { BiomeName, getBiomeColor } from "./biome";
import { type TerrainCell, World } from "./Word";
import { ChunkManager } from "./ChunkManager";
import { ComponentType } from "../types/component-type";
import type TransformComponent from "../components/transform";
import { createTransform } from "../components/transform";
import type { Vec2 } from "../Vec2/Vec2";
import { BUSHE_2 } from "../sprites/grass";
import type { Sprite } from "../types/sprite";
import { Mulberry32 } from "../algorithms/mulberry32";
import type { GameEntity } from "../types/EngineEntity";

export function TerrainSystem(): System {
  let playerPos: Vec2;
  const world = new World(123);
  return {
    start(ecs) {
      playerPos =
        ecs.getComponentsByType<TransformComponent>(ComponentType.TRANSFORM)
          .find((c) => c.gameEntity?.name === "player")?.position ??
          { x: 0, y: 0 };

      ChunkManager.on("chunkLoaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          generateTerrainEntities(ecs, chunk.cells, chunk.gameEntities);
          generateTreeEntities(
            ecs,
            chunk.cells,
            chunk.position.x,
            chunk.position.y,
            chunk.gameEntities,
          );
        }
      });

      ChunkManager.on("chunkUnloaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          for (const entity of chunk.gameEntities) {
            ecs.removeEntity(entity);
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
  ecs: ECSComponents,
  terrainCells: TerrainCell[],
  gameEntityes: GameEntity[],
): void {
  for (const cell of terrainCells) {
    const gameEntity: GameEntity = createGameEntity(`ground_${cell.x}_${cell.y}`, "ground");

    const transform = createTransform(gameEntity, { x: cell.x, y: cell.y });
    ecs.addComponent(gameEntity, transform, false);

    const spriteReder = createSpriteRender(gameEntity, {
      color: getBiomeColor(cell.biome ?? BiomeName.DEEP_WATER),
      layer: -1,
      scale: cell.scale,
    });

    ecs.addComponent(gameEntity, spriteReder, false);

    gameEntityes.push(gameEntity);
  }
}

function generateTreeEntities(
  ecs: ECSComponents,
  terrainCells: TerrainCell[],
  chunkX: number,
  chunkY: number,
  gameEntityes: GameEntity[],
): void {
  const seed = hashChunk(chunkX, chunkY);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {
    const chance = rng.nextFloat();
    const variant = rng.nextFloat();
    const treeSprite = getTreeSprite(variant);

    if (cell.biome === BiomeName.DENSE_FOREST) {
      if (chance < 0.1) {
        const tree = entity_create_tree(
          ecs,
          { x: cell.x, y: cell.y },
          treeSprite,
          11,
          3,
        );
        gameEntityes.push(tree);
      } else if (chance > 0.9) {
        // const bushe = entity_create_static(ecs, { x: cell.x, y: cell.y }, BUSHE_2, 10, 2);
        //  entities.push(bushe);
      }
    } else if (cell.biome === BiomeName.GRASSLAND && chance < 0.5) {
      // const mu = entity_create_static(ecs, { x: cell.x, y: cell.y }, BUSHE_2, 10, 4);
      // entities.push(mu);
    }
  }
}

function hashChunk(x: number, y: number): number {
  return ((x * 73856093) ^ (y * 19349663)) >>> 0;
}

const treeSprites: Sprite[] = [FIR_TREE_0, FIR_TREE_1, FIR_TREE_3, FIR_TREE_4];

const grassSprites: Sprite[] = [BUSHE_2];

export function getTreeSprite(val: number): Sprite {
  const index = Math.floor(val * treeSprites.length);
  return treeSprites[index] ?? FIR_TREE_0;
}
