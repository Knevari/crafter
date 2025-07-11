import type { GameEntity } from "../../../core/types/EngineEntity";
import type { Vec2 } from "../../../core/Vec2/Vec2";
import { createGameEntity, createTransformComponent, createSpriteRenderComponent } from "../../../engine/builders";
import { Layer } from "../../../engine/enums";
import type { System } from "../../../engine/resources";
import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState} from "../../../engine/types";
import { ChunkManager } from "./chunk/ChunkManager";
import { World, type TerrainCell } from "./Word";
import { OAK_TRE_0 } from "../../sprites/oak.trees.sprite";
import { BiomeName, getBiomeColor } from "./biome";
import { Mulberry32 } from "../../../core/algorithms/mulberry32";
import { createTreeEntity } from "../../entities/tree.entity";
import { get_transform } from "../../../core/builders/get_component";


export function TerrainSystem(componentState: ECSComponentState, player: GameEntity): System {
  let playerPos: Vec2;
  const world = new World(1221435);
  return {
    start() {
      
      const transform = get_transform(player);
      if(!transform) return;

      playerPos = transform.position;

      ChunkManager.on("chunkLoaded", (pos: Vec2) => {
        const chunk = ChunkManager.getChunk(pos.x, pos.y);
        if (chunk) {
          generateTerrainEntities(componentState, chunk.cells, chunk.gameEntities);
          generateTrees(componentState, chunk.cells, chunk.gameEntities, chunk.position);

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

    render() {
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

    if (cell.biome === BiomeName.SHALLOW_WATER) {

      const gameEntity: GameEntity = createGameEntity(`ground`, "Ground", Layer.IgnoreDepthSorting);

      const transform = createTransformComponent(gameEntity, { position: cell.position, });
      ECS.Component.addComponent(componentState, gameEntity, transform, false);

      const spriteReder = createSpriteRenderComponent(gameEntity, { materialName: "water_material" });
      ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);

      gameEntities.push(gameEntity);
    } else {

      const gameEntity: GameEntity = createGameEntity(`ground`, "Ground", Layer.IgnoreDepthSorting);

      const transform = createTransformComponent(gameEntity, { position: cell.position });
      ECS.Component.addComponent(componentState, gameEntity, transform, false);

      const spriteReder = createSpriteRenderComponent(gameEntity, { sprite: null, color: getBiomeColor(cell.biome ?? BiomeName.DEEP_WATER) });
      ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);

      gameEntities.push(gameEntity);
    }
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
    const treeChance = rng.nextFloat();
    if (cell.biome === BiomeName.DENSE_FOREST || cell.biome === BiomeName.SPARSE_FOREST) {
      if (treeChance < 0.1) {

        const treeEntity = createTreeEntity(componentState, "tree", OAK_TRE_0, cell.position);
        gameEntities.push(treeEntity);
      } 
    }
  }
}

