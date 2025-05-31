import { isInRange } from "../algorithms/isInRange";
import { lerpHSL, type HSL } from "./hsl";
import { hslToRgb } from "./rgb";
import type { TerrainCell } from "./Word";

export enum Biome {
    // Águas oceânicas profundas, geralmente intransitáveis
    DEEP_WATER = "deep_water",

    // Águas rasas, como lagos ou margens oceânicas
    SHALLOW_WATER = "shallow_water",

    // Areia, típico de praias ou desertos costeiros
    SAND = "sand",

    // Campos abertos com grama baixa
    GRASSLAND = "grassland",

    // Campos com presença de flores coloridas
    FLOWER_FIELD = "flower_field",

    // Floresta rala com árvores esparsas
    SPARSE_FOREST = "sparse_forest",

    // Floresta densa comum, com muitas árvores
    FOREST = "forest",

    // Floresta muito densa, difícil de atravessar
    DENSE_FOREST = "dense_forest",

    // Pântano, com solo úmido e vegetação densa
    SWAMP = "swamp",

    // Savana com gramíneas e árvores esparsas
    SAVANNA = "savanna",

    // Floresta boreal com pinheiros e clima frio
    TAIGA = "taiga",

    // Montanhas rochosas e terreno elevado
    MOUNTAIN = "mountain",

    // Áreas cobertas por neve constante
    SNOW = "snow",

    // Terreno frio e árido, com vegetação escassa
    TUNDRA = "tundra",
}

const biomeColorGradientHSL: [number, HSL][] = [
  // Água profunda
  [0.00, { h: 210, s: 0.95, l: 0.15 }],  // Azul profundo quase preto
  [0.05, { h: 205, s: 0.90, l: 0.22 }],
  [0.10, { h: 200, s: 0.85, l: 0.30 }],  // Azul oceano

  // Água rasa
  [0.15, { h: 190, s: 0.85, l: 0.40 }], // Azul turquesa
  [0.18, { h: 180, s: 0.70, l: 0.50 }], // Verde água clara

  // Areia e praia
  [0.22, { h: 45,  s: 0.65, l: 0.62 }], // Areia clara
  [0.25, { h: 40,  s: 0.70, l: 0.55 }], // Areia amarelada
  [0.28, { h: 35,  s: 0.75, l: 0.50 }], // Areia dourada

  // Campo aberto / pradaria
  [0.32, { h: 90,  s: 0.80, l: 0.45 }], // Verde vibrante
  [0.35, { h: 95,  s: 0.90, l: 0.50 }], // Verde forte

  // Campo de flores
  [0.40, { h: 45,  s: 0.80, l: 0.65 }], // Amarelo florido
  [0.43, { h: 55,  s: 0.85, l: 0.60 }], // Amarelo esverdeado
  [0.46, { h: 70,  s: 0.90, l: 0.55 }], // Verde amarelado

  // Floresta clara
  [0.50, { h: 120, s: 0.70, l: 0.40 }], // Verde floresta claro
  [0.54, { h: 130, s: 0.75, l: 0.35 }], // Verde floresta média

  // Floresta densa
  [0.58, { h: 160, s: 0.85, l: 0.30 }], // Verde floresta densa
  [0.62, { h: 170, s: 0.90, l: 0.25 }], // Verde escuro

  // Pântano
  [0.67, { h: 110, s: 0.65, l: 0.28 }], // Verde pântano
  [0.70, { h: 100, s: 0.60, l: 0.22 }], // Verde musgo escuro

  // Savana / cerrado
  [0.75, { h: 45,  s: 0.90, l: 0.58 }], // Amarelo vibrante
  [0.78, { h: 50,  s: 0.85, l: 0.50 }], // Amarelo alaranjado

  // Taiga / coníferas
  [0.82, { h: 140, s: 0.50, l: 0.38 }], // Verde frio
  [0.85, { h: 145, s: 0.45, l: 0.35 }], // Verde azulado

  // Montanhas rochosas
  [0.88, { h: 15,  s: 0.30, l: 0.35 }], // Marrom escuro
  [0.91, { h: 10,  s: 0.20, l: 0.45 }], // Marrom claro

  // Tundra / neve fina
  [0.94, { h: 0,   s: 0.05, l: 0.65 }], // Cinza gelo
  [0.97, { h: 210, s: 0.20, l: 0.85 }], // Azul gelo claro

  // Neve espessa
  [1.00, { h: 210, s: 0.15, l: 0.95 }], // Branco azulado
];


export function classifyBiomes(cells: TerrainCell[]): void {
    for (const cell of cells) {
        const v = cell.value;

        if (isInRange(v, 0.0, 0.15)) {
            cell.biome = Biome.DEEP_WATER;
        } else if (isInRange(v, 0.15, 0.25)) {
            cell.biome = Biome.SHALLOW_WATER;
        } else if (isInRange(v, 0.25, 0.3)) {
            cell.biome = Biome.SAND;
        } else if (isInRange(v, 0.3, 0.45)) {
            cell.biome = Biome.GRASSLAND;
        } else if (isInRange(v, 0.45, 0.52)) {
            cell.biome = Biome.FLOWER_FIELD;
        } else if (isInRange(v, 0.52, 0.58)) {
            cell.biome = Biome.SPARSE_FOREST;
        } else if (isInRange(v, 0.58, 0.65)) {
            cell.biome = Biome.FOREST;
        } else if (isInRange(v, 0.65, 0.72)) {
            cell.biome = Biome.DENSE_FOREST;
        } else if (isInRange(v, 0.72, 0.78)) {
            cell.biome = Biome.SWAMP;
        } else if (isInRange(v, 0.78, 0.83)) {
            cell.biome = Biome.SAVANNA;
        } else if (isInRange(v, 0.83, 0.88)) {
            cell.biome = Biome.TAIGA;
        } else if (isInRange(v, 0.88, 0.95)) {
            cell.biome = Biome.MOUNTAIN;
        } else {
            cell.biome = Biome.SNOW;
        }
    }
}

export function getBiomeColorSmoothHSL(cell: TerrainCell): string {
  const v = cell.value;

  for (let i = 0; i < biomeColorGradientHSL.length - 1; i++) {
    const [startV, startHSL] = biomeColorGradientHSL[i];
    const [endV, endHSL] = biomeColorGradientHSL[i + 1];

    if (v >= startV && v <= endV) {
      const t = (v - startV) / (endV - startV);
      const c = lerpHSL(startHSL, endHSL, t);
      const rgbColor = hslToRgb(c);
      return `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
    }
  }

  return "rgb(255, 0, 255)"; 
}


