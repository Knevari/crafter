import type { Entity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { System } from "../types/system";
import { createSpriteRender } from "../builders/createSpriteRender";

import { entity_create_tree, entity_create_trunk } from "../entities/grass-entity";
import { TREE_SPRITE, TREE_TRUNK_SPRITE } from "../sprites/tree-sprite";
import { Mulberry32 } from "../algorithms/mulberry32";
import { createEntity } from "../builders/createEntity";
import { Biome, getBiomeColorSmoothHSL } from "./biome";
import { World, type TerrainCell } from "./Word";
import { ChunkManager } from "./ChunkManager";
import { ComponentType } from "../types/component-type";
import type TransformComponent from "../components/transform";
import { createTransform } from "../components/transform";
import type { Vector2 } from "../types/vector2";

export function TerrainSystem(): System {

  let playerPos: Vector2;
  const world = new World(1234);

  return {
    start(ecs) {

      playerPos = ecs.getComponentsByType<TransformComponent>(ComponentType.TRANSFORM).find(c => c.entityRef?.name === "player")?.position ?? { x: 0, y: 0 };

      ChunkManager.on("chunkLoaded", (pos: Vector2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          const entities = generateTerrainEntities(ecs, chunk.cells);
          const trees = generateTreeEntities(ecs, chunk.cells, pos.x, pos.y);
          chunk.entities = [...entities, ...trees];
        }
      });

      ChunkManager.on("chunkUnloaded", (pos: Vector2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          for (const entity of chunk.entities) {
            ecs.removeEntity(entity);
          }
          chunk.entities = [];
        }
      });


      ChunkManager.updateAround(playerPos, 1, world);
    },

    update() {

      ChunkManager.updateAround(playerPos, 1, world);

    }
  };
}




function generateTerrainEntities(
  ecs: ECSComponents,
  terrainCells: TerrainCell[],
): Entity[] {
  const entities: Entity[] = [];

  for (const cell of terrainCells) {
    const entity: Entity = createEntity("ground");

    ecs.addComponent(entity,
      createTransform(entity, {
        x: cell.x,
        y: cell.y,
      }),
      false
    );

    ecs.addComponent(entity,
      createSpriteRender(entity, {
        color: getBiomeColorSmoothHSL(cell),
        layer: -1,
        scale: cell.scale,
      }),
      false
    );

    entities.push(entity);
  }

  return entities;
}


























function generateTreeEntities(
  ecs: ECSComponents,
  terrainCells: TerrainCell[],
  chunkX: number,
  chunkY: number
): Entity[] {
  const entities: Entity[] = [];

  const treeSeed = hashChunk(chunkX, chunkY);
  const treeRgn = new Mulberry32(treeSeed);

  for (const cell of terrainCells) {
    const chance = treeRgn.nextFloat();
    if (chance < 0.2 && cell.biome === Biome.DENSE_FOREST) {
      const tree = entity_create_tree(ecs, { x: cell.x, y: cell.y }, TREE_SPRITE, 11, 4);
      const trunk = entity_create_trunk(ecs, { x: cell.x, y: cell.y }, TREE_TRUNK_SPRITE, 9, 4);
      entities.push(tree, trunk);
    }
  }

  return entities;
}

function hashChunk(x: number, y: number): number {
  return ((x * 73856093) ^ (y * 19349663)) >>> 0;
}