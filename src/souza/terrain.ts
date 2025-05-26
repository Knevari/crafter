import type { BaseEntity } from "../lib/types";
import Draw from "./helpers/draw-helper";
import { TREE_TRUNK_SPRITE } from "./sprites/tree-sprite";
import type { System } from "./types/system";
import { ecs } from "./test";
import type { BoxColliderComponent } from "./types/collider-box";
import type { PositionComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import type { PerlinNoise2D } from "./algorithms/perlin-noise-2d/perlin-noise-2d";

export function generateTerrainMatrix(
  perlin: PerlinNoise2D,
  width: number,
  height: number,
  octaves: number,
  persistence: number,
  scaleFactor: number
): number[][] {
  const terrain: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const xf = x / scaleFactor;
      const yf = y / scaleFactor;

      let value = perlin.fractalNoise(xf, yf, octaves, persistence);
      value = Math.pow(value, 1.5);
      row.push(value);
    }
    terrain.push(row);
  }

  return terrain;
}


function lerpColor(a: string, b: string, t: number): string {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  if (!c1 || !c2) return a;
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b_ = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b_})`;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  } : null;
}

export function getColorFromGradient(colors: string[], t: number): string {
  if (colors.length === 0) return "#000000";
  if (colors.length === 1) return colors[0];

  t = Math.max(0, Math.min(1, t));

  const total = colors.length - 1;
  const scaledT = t * total;
  const index = Math.floor(scaledT);
  const localT = scaledT - index;

  const colorA = colors[index];
  const colorB = colors[index + 1] ?? colorA;

  return lerpColor(colorA, colorB, localT);
}

export function generateTrees(
  terrain: number[][],
  tileSize: number,
) {
  const height = terrain.length;
  const width = terrain[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const elevation = terrain[y][x];


      if (elevation > 0.4) {
        const entity: BaseEntity = { id: `tree_${x}_${y}` };

        const position: PositionComponent = {
          enabled: true,
          x: x * tileSize + tileSize / 2,
          y: y * tileSize + tileSize / 2
        };

        ecs.addComponent<PositionComponent>(entity, ComponentType.Position, position);
        ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
          entity,
          enabled: true,
          color: " white",
          sprite: TREE_TRUNK_SPRITE,
          scale: 1,
          rotation: 0,
          flipHorizontal: false,
          flipVertical: false,
          layer: 3,
        });
       
      }
    }
  }
}




