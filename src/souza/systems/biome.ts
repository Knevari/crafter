import { isInRange } from "../algorithms/isInRange";
import type { TerrainCell } from "./Word";

export enum Biome {
    DEEP_WATER = "deep_water",         // Água profunda: oceanos e mares profundos
    SHALLOW_WATER = "shallow_water",   // Água rasa: margens e áreas costeiras
    SAND = "sand",                     // Areia: praias e desertos arenosos
    GRASSLAND = "grassland",           // Campo: áreas abertas cobertas de grama
    FLOWER_FIELD = "flower_field",     // Campo florido: campos com muitas flores
    SPARSE_FOREST = "sparse_forest",   // Floresta esparsa: poucas árvores espaçadas
    FOREST = "forest",                 // Floresta: vegetação densa com árvores médias
    DENSE_FOREST = "dense_forest",     // Floresta densa: muitas árvores próximas, difícil de atravessar
    SWAMP = "swamp",                   // Pântano: solo encharcado, vegetação baixa e densa
    SAVANNA = "savanna",               // Savana: grama alta com árvores isoladas
    TAIGA = "taiga",                   // Taiga: floresta fria com coníferas (pinheiros, abetos)
    MOUNTAIN = "mountain",             // Montanha: regiões elevadas e rochosas
    SNOW = "snow",                     // Neve: áreas cobertas por neve constante
    TUNDRA = "tundra"                  // Tundra: região fria, com vegetação rasteira e solo congelado
}

interface BiomeRange {
    min: number; max: number;
}
interface BiomeDef {
    biome: Biome;
    range: BiomeRange;
    color: string;
}

const BIOME_DEFAULT: BiomeDef[] = [
    { biome: Biome.DEEP_WATER,    range: { min: 0.0,  max: 0.15 }, color: "rgb(1, 22, 39)" },
    { biome: Biome.SHALLOW_WATER, range: { min: 0.15, max: 0.25 }, color: "rgb(3, 48, 78)" },
    { biome: Biome.SAND,          range: { min: 0.25, max: 0.3  }, color: "rgb(4, 179, 156)" },
    { biome: Biome.GRASSLAND,     range: { min: 0.3,  max: 0.45 }, color: "rgb(76, 175, 145)" },
    { biome: Biome.FLOWER_FIELD,  range: { min: 0.45, max: 0.52 }, color: "rgb(109, 187, 116)" },
    { biome: Biome.SPARSE_FOREST, range: { min: 0.52, max: 0.58 }, color: "rgb(137, 198, 99)" },
    { biome: Biome.FOREST,        range: { min: 0.58, max: 0.65 }, color: "rgb(170, 215, 81)" },
    { biome: Biome.DENSE_FOREST,  range: { min: 0.65, max: 0.72 }, color: "rgb(200, 227, 110)" },
    { biome: Biome.SWAMP,         range: { min: 0.72, max: 0.78 }, color: "rgb(231, 201, 107)" },
    { biome: Biome.SAVANNA,       range: { min: 0.78, max: 0.83 }, color: "rgb(215, 180, 140)" },
    { biome: Biome.TAIGA,         range: { min: 0.83, max: 0.88 }, color: "rgb(170, 117, 81)" },
    { biome: Biome.MOUNTAIN,      range: { min: 0.88, max: 0.95 }, color: "rgb(91, 91, 91)" },
    { biome: Biome.SNOW,          range: { min: 0.95, max: 1.0  }, color: "rgb(187, 187, 187)" }
];

const FALLBACK_COLOR = "rgb(183, 0, 255)";

export function classifyBiomes(cells: TerrainCell[]): void {
    for (const cell of cells) {
        const def = BIOME_DEFAULT.find(def => isInRange(cell.value, def.range.min, def.range.max));
        if (def) {
            cell.biome = def.biome;
        } else {
            cell.biome = Biome.TUNDRA;
        }
    }
}


export function getBiomeColor(val: Biome): string {
   for(const biomeDef of BIOME_DEFAULT) {
        if(biomeDef.biome === val) {
            return biomeDef.color;
        }
   }
   return FALLBACK_COLOR;
}
