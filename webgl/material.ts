import type { RgbColor } from "../game/systems/procedural-world/biome";

export interface Material {
    name: string;
    shaderName: string | null;
    color: RgbColor;
}

export interface TexturedMaterial extends Material {
    textureName: string;
}
