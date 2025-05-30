import type { Entity } from "../../lib/types";
import PCG32 from "../algorithms/PCG32";
import { PerlinNoise2D } from "../algorithms/perlin-noise-2d";
import type { ECSComponents } from "../ecs/ecs-components";
import { getColorFromGradient } from "../terrain";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";
import { createSpriteRender } from "../builders/createSpriteRender";
import { createTransform } from "../components/transform";
import type TransformComponent from "../components/transform";
import type { Vector2 } from "../types/vector2";
import { isInRange } from "../algorithms/isInRange";
import { createBoxCollider } from "../builders/createBoxCollider";
import { entity_create_dry, entity_create_grass, entity_create_tree, entity_create_trunk } from "../entities/grass-entity";
import { DRY_VEGETATION_SPRITE, GRASS_SPRITE } from "../sprites/ground-sprite";
import { TREE_SPRITE, TREE_TRUNK_SPRITE } from "../sprites/tree-sprite";
import { Mulberry32 } from "../algorithms/mulberry32";
import { createEntity } from "../builders/createEntity";

const terrainColors = [
  " #011627", " #02243c", " #03304e", " #03496a", " #03587e", " #047399",
  " #058caa", " #04a3a5", " #04b39c", " #2ea78f", " #4caf91", " #5cb881",
  " #6dbb74", " #7ec26b", " #89c663", " #98d05c", " #aad751", " #bfe062",
  " #c8e36e", " #d6e962", " #dedf60", " #e2d566", " #e7c96b", " #dcba73",
  " #d2b48c", " #c7aa7d", " #c1a76d", " #b18f60", " #a47551", " #bb8a63",
  " #d6ae77", " #aa8155", " #855e42", " #6b544a", " #5b5b5b", " #6c6c6c",
  " #777777", " #888888", " #999999", " #aaaaaa", " #bbbbbb", " #cccccc",
  " #dddddd", " #eeeeee", " #ffffff"
];


class World {
  private seed: number;
  private rgn: Mulberry32;
  private perlin: PerlinNoise2D;
  private readonly OCTAVES = 6;
  private readonly PERSISTENCE = 0.2;
  private readonly SCALE = 32;

  constructor(seed: number) {
    this.seed = seed;
    this.rgn = new Mulberry32(seed);
    this.perlin = new PerlinNoise2D(this.rgn);
  }

  public generateChunk(width: number, height: number, chunkX: number, chunkY: number): TerrainCell[] {
    const terrain: TerrainCell[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const worldX = chunkX * width + x;
        const worldY = chunkY * height + y;

        let value = this.perlin.fractalNoise(worldX / this.SCALE, worldY / this.SCALE, this.OCTAVES, this.PERSISTENCE);
        value = Math.pow(value, 1.5);

        terrain.push({
          x: worldX,
          y: worldY,
          value,
          biome: undefined,
          isWater: value < 0.3,
        });
      }
    }

    this.classifyBiomes(terrain);

    return terrain;
  }

  private classifyBiomes(cells: TerrainCell[]): void {
    for (const cell of cells) {
      if (cell.value < 0.3) {
        cell.biome = "water";
      } else if (cell.value < 0.45) {
        cell.biome = "sand";
      } else if (cell.value < 0.65) {
        cell.biome = "grassland";
      } else {
        cell.biome = "mountain";
      }
    }
  }
}

const OBJECT_SIZE = 64;
const CHUNK_SIZE = 16;

export function TerrainSystem(): System {

  return {
    start(ecs) {
      const word = new World(23434);
      const terrain = word.generateChunk(32, 32, 0, 0);
      generateTerrainEntities(ecs, terrain, OBJECT_SIZE, 0, 0, 32, 32)
    },
    fixedUpdate(ecs) {

    },
  };
}

interface TerrainCell {
  x: number;
  y: number;
  value: number;
  biome?: string;
  isWater?: boolean;
}

function generateTerrainEntities(
  ecs: ECSComponents,
  terrainCells: TerrainCell[],
  scale: number,
  chunkX: number,
  chunkY: number,
  chunkWidth: number,
  chunkHeight: number
): Entity[] {
  const entities: Entity[] = [];

  for (const cell of terrainCells) {

    const worldX = (cell.x - chunkX * chunkWidth - chunkWidth / 2) * scale;
    const worldY = (cell.y - chunkY * chunkHeight - chunkHeight / 2) * scale;

    const id = `ground_${cell.x}_${cell.y}`;
    const entity: Entity = createEntity(id, "ground");

    ecs.addComponent(entity,
      createTransform(entity, {
        x: worldX,
        y: worldY,
      }),
      false
    );

    let color: string;
    switch (cell.biome) {
      case "water":
        color = "rgb(7, 151, 207)";
        break;
      case "sand":
        color = " #d2b48c";
        break;
      case "grassland":
        color = " #6dbb74";
        break;
      case "mountain":
        color = " #bbbbbb";
        break;
      default:
        color = getColorFromGradient(terrainColors, cell.value);
        break;
    }

    ecs.addComponent(entity,
      createSpriteRender(entity, {
        color,
        layer: -1,
        scale,
      }),
      false
    );

    entities.push(entity);

    generateTreeEntities(ecs, cell.value, worldX, worldY, entities);
  }

  return entities;
}













// function generateTerrainEntities(
//   ecs: ECSComponents,
//   terrain: number[][],
//   scale: number,
//   chunkX: number,
//   chunkY: number
// ): Entity[] {
//   const height = terrain.length;
//   const width = terrain[0].length;

//   const entities: Entity[] = [];

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const value = terrain[y][x];

//       const worldX = (chunkX * width + x - width / 2) * scale;
//       const worldY = (chunkY * height + y - height / 2) * scale;

//       // generateTreeEntities(ecs, value, worldX, worldY, entities)

//       const id = `ground_${chunkX}_${chunkY}_${x}_${y}`;
//       const entity: Entity = { id };
//       ecs.addComponent(entity, ComponentType.TRANSFORM,
//         createTransform(entity, {
//           x: worldX,
//           y: worldY
//         }),
//         false
//       );

//       ecs.addComponent(entity, ComponentType.SPRITE_RENDER,
//         createSpriteRender(entity, {

//           color: getColorFromGradient(terrainColors, value),
//           layer: -1,
//           scale: scale
//         }),
//         false
//       );

//       entities.push(entity);
//     }
//   }

//   return entities;
// }
function generateTreeEntities(
  ecs: ECSComponents,
  value: number,
  screenX: number,
  screenY: number,
  entities: Entity[]
) {
  const pos = { x: Math.floor(screenX), y: Math.floor(screenY) };
  const idPrefix = `${pos.x}_${pos.y}`;


  switch (true) {
    case isInRange(value, 0.3, 0.4) : {
      const scale = 1;
      const tree = entity_create_tree(ecs, pos, TREE_SPRITE, 10, scale, `tree_${idPrefix}`);
      entities.push(tree);

      // const trunk = entity_create_trunk(ecs, pos, TREE_TRUNK_SPRITE, 9, scale, `trunk_${idPrefix}`);
      // entities.push(trunk);
      break;
    }
  }
}

