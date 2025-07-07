import type { RgbColor } from "../../game/systems/procedural-world/biome";

export interface Material {
    name: string;
    shaderName: string | null;
    color: RgbColor;
}

