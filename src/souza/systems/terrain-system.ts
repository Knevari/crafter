import type { Entity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { System } from "../types/system";
import { createSpriteRender } from "../builders/createSpriteRender";
import { entity_create_static, entity_create_tree } from "../entities/grass-entity";
import { FIR_TREE_0, FIR_TREE_1, FIR_TREE_3, FIR_TREE_4 } from "../sprites/tree-sprite";
import { createEntity } from "../builders/createEntity";
import { Biome, getBiomeColor } from "./biome";
import { World, type TerrainCell } from "./Word";
import { ChunkManager } from "./ChunkManager";
import { ComponentType } from "../types/component-type";
import type TransformComponent from "../components/transform";
import { createTransform } from "../components/transform";
import { Mulberry32 } from "../algorithms/Mulberry32";
import type { Vec2 } from "../Vec2/Vec2";
import { isInRange } from "../algorithms/isInRange";
import { BUSHE_2 } from "../sprites/grass";
import type { Sprite } from "../types/sprite";

export function TerrainSystem(): System {

  let playerPos: Vec2;
  const world = new World(16032003);

  return {
    start(ecs) {
      playerPos = ecs.getComponentsByType<TransformComponent>(ComponentType.TRANSFORM).find(c => c.entityRef?.name === "player")?.position ?? { x: 0, y: 0 };

      ChunkManager.on("chunkLoaded", (pos: Vec2) => {
        // const chunk = ChunkManager.getChunk(pos.x, pos.y);
        // if (chunk) {
        //   const entities = generateTerrainEntities(ecs, chunk.cells);
        //   const trees = generateTreeEntities(ecs, chunk.cells, world, pos.x, pos.y);
        //   chunk.entities = [...entities, ...trees];
        // }
      });

      ChunkManager.on("chunkUnloaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          for (const entity of chunk.entities) {
            ecs.removeEntity(entity);
          }
          chunk.entities = [];
        }
      })


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
    const entity: Entity = createEntity("ground", "ground");

    ecs.addComponent(entity,
      createTransform(entity, {
        x: cell.x,
        y: cell.y,
      }),
      false
    );

    ecs.addComponent(entity,
      createSpriteRender(entity, {
        color: getBiomeColor(cell.biome ?? Biome.DEEP_WATER),
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
  world: World,
  chunkX: number,
  chunkY: number
): Entity[] {
  const entities: Entity[] = [];

  const seed = hashChunk(chunkX, chunkY);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {


    const chance = rng.nextFloat();
    const variant = rng.nextFloat();
    const treeSprite = getTreeSprite(variant);

    if (cell.biome === Biome.DENSE_FOREST) {

      if (chance < 0.1) {
        const tree = entity_create_tree(ecs, { x: cell.x, y: cell.y }, treeSprite, 11, 3);
        entities.push(tree);
      } else if(chance > 0.9) {
        // const bushe = entity_create_static(ecs, { x: cell.x, y: cell.y }, BUSHE_2, 10, 2);
        //  entities.push(bushe);
      }


    } else if (cell.biome === Biome.GRASSLAND && chance < 0.5) {
      // const mu = entity_create_static(ecs, { x: cell.x, y: cell.y }, BUSHE_2, 10, 4);
      // entities.push(mu);
    }
  }

  return entities;
}

function hashChunk(x: number, y: number): number {
  return ((x * 73856093) ^ (y * 19349663)) >>> 0;
}


const treeSprites: Sprite[] = [FIR_TREE_0, FIR_TREE_1, FIR_TREE_3, FIR_TREE_4];

const grassSprites: Sprite[] = [BUSHE_2,]

export function getTreeSprite(val: number): Sprite {

  const index = Math.floor(val * treeSprites.length);
  return treeSprites[index] ?? FIR_TREE_0;
}