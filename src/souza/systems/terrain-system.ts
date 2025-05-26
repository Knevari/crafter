import type { BaseEntity } from "../../lib/types";
import PCG32 from "../algorithms/PCG32/PCG32";
import { PerlinNoise2D } from "../algorithms/perlin-noise-2d/perlin-noise-2d";
import type { ECSComponents } from "../ecs/ecs-components";
import { DRY_VEGETATION_SPRITE, GRASS_SPRITE } from "../sprites/ground-sprite";
import { TREE_SPRITE, TREE_TRUNK_SPRITE as TREE_TRUNK_SPRITE } from "../sprites/tree-sprite";
import { generateTerrainMatrix, generateTrees, getColorFromGradient } from "../terrain";
import type { BoxColliderComponent } from "../types/collider-box";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export function TerrainSystem(): System {

  return {
    start(ecs) {
      const seed = new PCG32(1234567890123456789n, 9876543210987654321n);
      const perlin = new PerlinNoise2D(seed);

      const width = 64;
      const height = 64;
      const persistence = 0.2;
      const octaves = 5;
      const scale = 32;
      const terrainMatrix = generateTerrainMatrix(perlin, width, height, octaves, persistence, scale);
      generateTerrainEntities(ecs, terrainMatrix, scale);
      generateTreeEntities(ecs, terrainMatrix, scale, 64 + 32)
    },
  }
}

const terrainColors = [
  "#011627", // mar profundo
  "#02243c",
  "#03304e", // mar médio
  "#03496a",
  "#03587e", // mar raso
  "#047399",
  "#058caa", // enseadas
  "#04a3a5",
  "#04b39c", // costa tropical
  "#2ea78f",
  "#4caf91", // pradarias costeiras
  "#5cb881",
  "#6dbb74", // floresta tropical
  "#7ec26b",
  "#89c663", // floresta temperada
  "#98d05c",
  "#aad751", // planícies verdes
  "#bfe062",
  "#c8e36e", // campos cultiváveis
  "#d6e962",
  "#dedf60", // pradarias secas
  "#e2d566",
  "#e7c96b", // savana
  "#dcba73",
  "#d2b48c", // terra seca
  "#c7aa7d",
  "#c1a76d", // semideserto
  "#b18f60",
  "#a47551", // deserto rochoso
  "#bb8a63",
  "#d6ae77", // areia fofa
  "#aa8155",
  "#855e42", // penhascos e ravinas
  "#6b544a",
  "#5b5b5b", // pedra
  "#6c6c6c",
  "#777777", // montanhas baixas
  "#888888",
  "#999999", // montanhas médias
  "#aaaaaa",
  "#bbbbbb", // montanhas altas
  "#cccccc",
  "#dddddd", // picos de montanhas
  "#eeeeee", // neve fina
  "#ffffff"  // neve espessa
];

function generateTerrainEntities(
  ecs: ECSComponents,
  terrain: number[][],
  scale: number
) {
  const height = terrain.length;
  const width = terrain[0].length;

  const offsetX = (width * scale) / 2;
  const offsetY = (height * scale) / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = terrain[y][x];
      const screenX = x * scale - offsetX;
      const screenY = y * scale - offsetY;

      const entity: BaseEntity = { id: `ground_${x}_${y}` };
      ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
        entity: entity,
        x: screenX,
        y: screenY,
        enabled: true
      });

      ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
        entity: entity,
        color: getColorFromGradient(terrainColors, value),
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

function generateTreeEntities(
  ecs: ECSComponents,
  terrain: number[][],
  scale: number,
  minDistance: number = 64 // distância mínima entre árvores
) {
  const height = terrain.length;
  const width = terrain[0].length;

  const offsetX = (width * scale) / 2;
  const offsetY = (height * scale) / 2;

  const placedPositions: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = terrain[y][x];
      const screenX = x * scale - offsetX + scale / 2;
      const screenY = y * scale - offsetY + scale / 2;

      if (value > 0.3 && value < 0.4) 
        {
        const tooClose = placedPositions.some(pos => {
          const dx = pos.x - screenX;
          const dy = pos.y - screenY;
          return dx * dx + dy * dy < minDistance * minDistance;
        });

        if (tooClose) continue;


        placedPositions.push({ x: screenX, y: screenY });

        const tree: BaseEntity = { id: `tree_${x}_${y}` };
        ecs.addComponent<PositionComponent>(tree, ComponentType.Position, {
          entity: tree,
          x: screenX,
          y: screenY,
          enabled: true
        });

        ecs.addComponent<SpriteRenderComponent>(tree, ComponentType.SpriteRender, {
          entity: tree,
          sprite: TREE_SPRITE,
          scale: 5,
          rotation: 0,
          flipHorizontal: false,
          flipVertical: false,
          layer: 11,
          enabled: true,
        });

        ecs.addComponent<BoxColliderComponent>(tree, ComponentType.BoxCollider, {
          enabled: true,
          width: 32,
          height: 80,
          trigger: true,
          collisionGroup: "tree"
        });
      } else if(value > 0.5 && value < 0.6 && 0.5 < Math.random()) {
         const tree: BaseEntity = { id: `tree_${x}_${y}` };
        ecs.addComponent<PositionComponent>(tree, ComponentType.Position, {
          entity: tree,
          x: screenX,
          y: screenY,
          enabled: true
        });

        ecs.addComponent<SpriteRenderComponent>(tree, ComponentType.SpriteRender, {
          entity: tree,
          sprite: DRY_VEGETATION_SPRITE,
          scale: 1,
          rotation: 0,
          flipHorizontal: false,
          flipVertical: false,
          layer: 3,
          enabled: true,
        });

       
      } else if(value > 0.3 && value < 0.5  && 0.5 < Math.random()) {
         const tree: BaseEntity = { id: `tree_${x}_${y}` };
        ecs.addComponent<PositionComponent>(tree, ComponentType.Position, {
          entity: tree,
          x: screenX,
          y: screenY,
          enabled: true
        });

        ecs.addComponent<SpriteRenderComponent>(tree, ComponentType.SpriteRender, {
          entity: tree,
          sprite: GRASS_SPRITE,
          scale: 3,
          rotation: 0,
          flipHorizontal: false,
          flipVertical: false,
          layer: 2,
          enabled: true,
        });
      }
    }
  }
}
