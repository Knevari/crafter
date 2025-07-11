import { isInRange } from "../../../core/algorithms/isInRange";
import type { TerrainCell } from "./Word";

export enum BiomeName {
  DEEP_WATER = "deep_water",
  SHALLOW_WATER = "shallow_water",
  SAND = "sand",
  GRASSLAND = "grassland",
  FLOWER_FIELD = "flower_field",
  SPARSE_FOREST = "sparse_forest",
  FOREST = "forest",
  DENSE_FOREST = "dense_forest",
  SWAMP = "swamp",
  SAVANNA = "savanna",
  TAIGA = "taiga",
  MOUNTAIN = "mountain",
  SNOW = "snow",
  TUNDRA = "tundra",
}

interface BiomeRange {
  min: number;
  max: number;
}

interface Biome {
  name: BiomeName;
  height: BiomeRange;
  temperature: BiomeRange;
  color: Color;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function rgba(r: number, g: number, b: number, a: number = 1): Color {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a,
  };
}

export function rgb(r: number, g: number, b: number): Color {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: 1,
  };
}



const BIOME_DEFAULT: Biome[] = [
  {
    name: BiomeName.DEEP_WATER,
    height: { min: 0.0, max: 0.2 },
    temperature: { min: 0.0, max: 1.0 },
    color: rgba(0, 50, 255, 1),  // azul profundo
  },
  {
    name: BiomeName.SHALLOW_WATER,
    height: { min: 0.2, max: 0.3 },
    temperature: { min: 0.0, max: 1.0 },
    color: rgba(64, 164, 223, 1),  // azul claro
  },
  {
    name: BiomeName.SAND,
    height: { min: 0.3, max: 0.35 },
    temperature: { min: 0.5, max: 1.0 },
    color: rgba(244, 233, 156, 1),  // areia clara
  },
  {
    name: BiomeName.GRASSLAND,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.4, max: 0.8 },
    color: rgba(136, 192, 112, 1),  // verde claro
  },
  {
    name: BiomeName.FLOWER_FIELD,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.6, max: 0.9 },
    color: rgba(180, 217, 141, 1),  // verde amarelado
  },
  {
    name: BiomeName.SPARSE_FOREST,
    height: { min: 0.4, max: 0.65 },
    temperature: { min: 0.4, max: 0.75 },
    color: rgba(76, 166, 76, 1),  // verde floresta esparsa
  },
  {
    name: BiomeName.FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.3, max: 0.7 },
    color: rgba(53, 122, 56, 1),  // verde floresta
  },
  {
    name: BiomeName.DENSE_FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.2, max: 0.6 },
    color: rgba(45, 92, 45, 1),  // verde escuro
  },
  {
    name: BiomeName.SWAMP,
    height: { min: 0.3, max: 0.5 },
    temperature: { min: 0.6, max: 1.0 },
    color: rgba(91, 117, 83, 1),  // verde acinzentado pântano
  },
  {
    name: BiomeName.SAVANNA,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.8, max: 1.0 },
    color: rgba(214, 194, 111, 1),  // amarelo queimado
  },
  {
    name: BiomeName.TAIGA,
    height: { min: 0.4, max: 0.7 },
    temperature: { min: 0.2, max: 0.4 },
    color: rgba(140, 174, 147, 1),  // verde frio
  },
  {
    name: BiomeName.MOUNTAIN,
    height: { min: 0.7, max: 0.85 },
    temperature: { min: 0.0, max: 1.0 },
    color: rgba(136, 136, 136, 1),  // cinza pedra
  },
  {
    name: BiomeName.SNOW,
    height: { min: 0.85, max: 1.0 },
    temperature: { min: 0.0, max: 0.3 },
    color: rgba(255, 255, 255, 1),  // branco neve
  },
  {
    name: BiomeName.TUNDRA,
    height: { min: 0.4, max: 0.6 },
    temperature: { min: 0.0, max: 0.2 },
    color: rgba(194, 211, 194, 1),  // verde pálido
  },
];

const FALLBACK_COLOR = rgba(183, 0, 255, 1);

export function classifyBiomes(cells: TerrainCell[]): void {
  for (const cell of cells) {
    const biome = BIOME_DEFAULT.find((def) =>
      isInRange(cell.height, def.height.min, def.height.max) &&
      isInRange(cell.temperature, def.temperature.min, def.temperature.max)
    );
    if (biome) {
      cell.biome = biome.name;
    } else {
      cell.biome = BiomeName.TUNDRA;
    }
  }
}

export function getBiomeColor(val: BiomeName): Color {
  for (const biomeDef of BIOME_DEFAULT) {
    if (biomeDef.name === val) {
      return biomeDef.color;
    }
  }
  return FALLBACK_COLOR;
}

