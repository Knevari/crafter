import { Mulberry32 } from "../../../core/algorithms/mulberry32";
import type TransformComponent from "../../../core/gears/transform/transform.types";
import { ComponentType } from "../../../core/types/component-type";
import type { GameEntity } from "../../../core/types/EngineEntity";
import type { Vec2 } from "../../../core/Vec2/Vec2";
import { createGameEntity, createTransformComponent, createSpriteRender } from "../../../engine/builders";
import { Layer } from "../../../engine/enums";
import type { System } from "../../../engine/resources";
import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState, Sprite } from "../../../engine/types";
import { BUSHES } from "../../sprites/bushes.sprite";
import { OAK_TRE_0, OAK_TRE_SHADOW } from "../../sprites/oak.trees.sprite";
import { getBiomeColor, BiomeName } from "./biome";
import { ChunkManager } from "./chunk/ChunkManager";
import { World, type TerrainCell } from "./Word";


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
    const gameEntity: GameEntity = createGameEntity(`ground`, "Ground", Layer.IgnoreDepthSorting);

    const transform = createTransformComponent(gameEntity, cell.position);
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

    const busheChance = rng.nextFloat();
    const treeChance = rng.nextFloat();

    if (cell.biome === BiomeName.DENSE_FOREST || cell.biome === BiomeName.FOREST) {

      if (treeChance < 0.1) {

        const treeShadow = createTreeShadow(componentState, cell.position);
        const treeEntity = createTree(componentState, cell.position);
        gameEntities.push(treeEntity, treeShadow);

      } else if (busheChance < 0.1) {
        const bushIndex = Math.floor(rng.nextFloat() * BUSHES.length);
        const bushSprite = BUSHES[bushIndex];
        const busheEntity = createBushes(componentState, cell.position, bushSprite);
        gameEntities.push(busheEntity);
      }
    }

  }

}

function createTree(componentState: ECSComponentState, position: Vec2): GameEntity {

  const gameEntity: GameEntity = createGameEntity(`tree`, "Tree");

  const transform = createTransformComponent(gameEntity, position);
  ECS.Component.addComponent(componentState, gameEntity, transform, false);

  const spriteReder = createSpriteRender(gameEntity, {
    layer: -1,
    sprite: OAK_TRE_0,
    scale: 2,
  });

  ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);
  return gameEntity;
}

function createTreeShadow(componentState: ECSComponentState, position: Vec2): GameEntity {

  const gameEntity: GameEntity = createGameEntity(`tree_shadow`, "Shadow", Layer.IgnoreDepthSorting);

  const transform = createTransformComponent(gameEntity, position);
  ECS.Component.addComponent(componentState, gameEntity, transform, false);

  const spriteReder = createSpriteRender(gameEntity, {
    layer: 2,
    sprite: OAK_TRE_SHADOW,
    scale: 3,
  });

  ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);
  return gameEntity;
}




function createBushes(componentState: ECSComponentState, position: Vec2, sprite: Sprite): GameEntity {
  const gameEntity: GameEntity = createGameEntity("bushe", "Bushe");

  const transform = createTransformComponent(gameEntity, position);
  ECS.Component.addComponent(componentState, gameEntity, transform, false);

  const spriteRender = createSpriteRender(gameEntity, {
    layer: -1,
    sprite,
    scale: 2,
  });

  ECS.Component.addComponent(componentState, gameEntity, spriteRender, false);
  return gameEntity;
}
