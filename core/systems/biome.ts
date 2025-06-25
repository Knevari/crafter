import { isInRange } from "../algorithms/isInRange";
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
    color: string;
}

const BIOME_DEFAULT: Biome[] = [
  {
    name: BiomeName.DEEP_WATER,
    height: { min: 0.0, max: 0.2 },
    temperature: { min: 0.0, max: 1.0 },
    color: "#011627", // Azul marinho profundo
  },
  {
    name: BiomeName.SHALLOW_WATER,
    height: { min: 0.2, max: 0.3 },
    temperature: { min: 0.0, max: 1.0 },
    color: "#0369a1", // Azul claro oceânico
  },
  {
    name: BiomeName.SAND,
    height: { min: 0.3, max: 0.35 },
    temperature: { min: 0.5, max: 1.0 },
    color: "#f4e99c", // Areia clara
  },
  {
    name: BiomeName.GRASSLAND,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.4, max: 0.8 },
    color: "#88c070", // Verde claro
  },
  {
    name: BiomeName.FLOWER_FIELD,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.6, max: 0.9 },
    color: "#b4d98d", // Verde com toque de amarelo
  },
  {
    name: BiomeName.SPARSE_FOREST,
    height: { min: 0.4, max: 0.65 },
    temperature: { min: 0.4, max: 0.75 },
    color: "#4ca64c", // Verde floresta esparsa
  },
  {
    name: BiomeName.FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.3, max: 0.7 },
    color: "#357a38", // Verde floresta padrão
  },
  {
    name: BiomeName.DENSE_FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.2, max: 0.6 },
    color: "#2d5c2d", // Verde mais escuro
  },
  {
    name: BiomeName.SWAMP,
    height: { min: 0.3, max: 0.5 },
    temperature: { min: 0.6, max: 1.0 },
    color: "#5b7553", // Verde acinzentado pântano
  },
  {
    name: BiomeName.SAVANNA,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.8, max: 1.0 },
    color: "#d6c26f", // Amarelo queimado
  },
  {
    name: BiomeName.TAIGA,
    height: { min: 0.4, max: 0.7 },
    temperature: { min: 0.2, max: 0.4 },
    color: "#8cae93", // Verde frio
  },
  {
    name: BiomeName.MOUNTAIN,
    height: { min: 0.7, max: 0.85 },
    temperature: { min: 0.0, max: 1.0 },
    color: "#888888", // Cinza pedra
  },
  {
    name: BiomeName.SNOW,
    height: { min: 0.85, max: 1.0 },
    temperature: { min: 0.0, max: 0.3 },
    color: "#ffffff", // Branco neve
  },
  {
    name: BiomeName.TUNDRA,
    height: { min: 0.4, max: 0.6 },
    temperature: { min: 0.0, max: 0.2 },
    color: "#c2d3c2", // Verde pálido
  },
];


const FALLBACK_COLOR = "rgb(183, 0, 255)";

export function classifyBiomes(cells: TerrainCell[]): void {
    for (const cell of cells) {
        const biome = BIOME_DEFAULT.find((def) =>
            isInRange(cell.height, def.height.min, def.height.max) &&
            isInRange(
                cell.temperature,
                def.temperature.min,
                def.temperature.max,
            )
        );
        if (biome) {
            cell.biome = biome.name;
        } else {
            cell.biome = BiomeName.TUNDRA;
        }
    }
}

export function getBiomeColor(val: BiomeName): string {
    for (const biomeDef of BIOME_DEFAULT) {
        if (biomeDef.name === val) {
            return biomeDef.color;
        }
    }
    return FALLBACK_COLOR;
}
