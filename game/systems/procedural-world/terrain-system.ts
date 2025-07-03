import { ComponentType } from "../../../core/types/component-type";
import type { GameEntity } from "../../../core/types/EngineEntity";
import type { Vec2 } from "../../../core/Vec2/Vec2";
import { createGameEntity, createTransformComponent, createSpriteRenderComponent } from "../../../engine/builders";
import { Layer } from "../../../engine/enums";
import type { System } from "../../../engine/resources";
import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState, Sprite, TransformComponent } from "../../../engine/types";
import { matrixManager } from "../../../webgl/managers/matrix_manager";
import { translateMatrix } from "../../../webgl/mat4";
import { generic_manager_get } from "../../../webgl/managers/generic_manager";
import { type Vec3 } from "../../../webgl/vec3";
import { ChunkManager } from "./chunk/ChunkManager";
import { World, type TerrainCell } from "./Word";
import { PLAYER_ANIMATIONS } from "../../animations/player.animations";
import { OAK_TRE_0, OAK_TRE_SHADOW, OAK_TREE_1 } from "../../sprites/oak.trees.sprite";
import { BiomeName, getBiomeColor } from "./biome";
import { Mulberry32 } from "../../../core/algorithms/mulberry32";


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

    if (cell.biome === BiomeName.SHALLOW_WATER) {

      const gameEntity: GameEntity = createGameEntity(`ground`, "Ground", Layer.IgnoreDepthSorting);

      const transform = createTransformComponent(gameEntity, { position: cell.position, });
      ECS.Component.addComponent(componentState, gameEntity, transform, false);

      const spriteReder = createSpriteRenderComponent(gameEntity, { materialName: "water_material", sprite: OAK_TRE_0 });
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

    const busheChance = rng.nextFloat();
    const treeChance = rng.nextFloat();


    if (cell.biome === BiomeName.DENSE_FOREST || cell.biome === BiomeName.SPARSE_FOREST) {
      if (treeChance < 0.1) {

        // const treeShadow = createTreeShadow(componentState, cell.position);
        const treeEntity = createTree(componentState, cell.position);
        gameEntities.push(treeEntity);

      } else if (busheChance < 0.1) {
        // const bushIndex = Math.floor(rng.nextFloat() * BUSHES.length);
        // const bushSprite = BUSHES[bushIndex];
        // const busheEntity = createBushes(componentState, cell.position, bushSprite);
        // gameEntities.push(busheEntity);
      }
    }


  }

}

function createTree(componentState: ECSComponentState, position: Vec3): GameEntity {

  const gameEntity: GameEntity = createGameEntity(`tree`, "Tree");


  const scale = { x: 1, y: 1.5, z: 0 };
  const offSetX = position.x + scale.x / 2;
  const offSetY = position.y + scale.y / 2;
  const transform = createTransformComponent(gameEntity, { position: { x: offSetX, y: offSetY, z: 0 }, scale: scale });
  ECS.Component.addComponent(componentState, gameEntity, transform, false);




  const spriteReder = createSpriteRenderComponent(gameEntity, {
    materialName: "advanced_material",
    layer: 1,
    sprite: OAK_TREE_1
  });

  ECS.Component.addComponent(componentState, gameEntity, spriteReder, false);
  return gameEntity;
}
