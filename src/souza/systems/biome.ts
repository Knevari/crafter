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
        height: { min: 0.0, max: 0.15 },
        temperature: { min: 0.0, max: 1.0 },
        color: "rgb(1, 22, 39)",
    },
    {
        name: BiomeName.SHALLOW_WATER,
        height: { min: 0.15, max: 0.25 },
        temperature: { min: 0.0, max: 1.0 },
        color: "rgb(3, 48, 78)",
    },
    {
        name: BiomeName.SAND,
        height: { min: 0.25, max: 0.3 },
        temperature: { min: 0.6, max: 1.0 },
        color: "rgb(4, 179, 156)",
    },
    {
        name: BiomeName.GRASSLAND,
        height: { min: 0.3, max: 0.45 },
        temperature: { min: 0.4, max: 0.8 },
        color: "rgb(76, 175, 145)",
    },
    {
        name: BiomeName.FLOWER_FIELD,
        height: { min: 0.45, max: 0.52 },
        temperature: { min: 0.4, max: 0.7 },
        color: "rgb(109, 187, 116)",
    },
    {
        name: BiomeName.SPARSE_FOREST,
        height: { min: 0.52, max: 0.58 },
        temperature: { min: 0.4, max: 0.75 },
        color: "rgb(137, 198, 99)",
    },
    {
        name: BiomeName.FOREST,
        height: { min: 0.58, max: 0.65 },
        temperature: { min: 0.35, max: 0.7 },
        color: "rgb(170, 215, 81)",
    },
    {
        name: BiomeName.DENSE_FOREST,
        height: { min: 0.65, max: 0.72 },
        temperature: { min: 0.3, max: 0.7 },
        color: "rgb(200, 227, 110)",
    },
    {
        name: BiomeName.SWAMP,
        height: { min: 0.72, max: 0.78 },
        temperature: { min: 0.5, max: 1.0 },
        color: "rgb(231, 201, 107)",
    },
    {
        name: BiomeName.SAVANNA,
        height: { min: 0.78, max: 0.83 },
        temperature: { min: 0.6, max: 1.0 },
        color: "rgb(215, 180, 140)",
    },
    {
        name: BiomeName.TAIGA,
        height: { min: 0.83, max: 0.88 },
        temperature: { min: 0.15, max: 0.4 },
        color: "rgb(170, 117, 81)",
    },
    {
        name: BiomeName.MOUNTAIN,
        height: { min: 0.88, max: 0.95 },
        temperature: { min: 0.1, max: 0.6 },
        color: "rgb(91, 91, 91)",
    },
    {
        name: BiomeName.SNOW,
        height: { min: 0.95, max: 1.0 },
        temperature: { min: 0.0, max: 0.3 },
        color: "rgb(255, 255, 255)",
    },
    {
        name: BiomeName.TUNDRA,
        height: { min: 0.3, max: 0.95 },
        temperature: { min: 0.0, max: 0.2 },
        color: "rgb(200, 200, 255)",
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
