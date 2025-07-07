import type { Vec2 } from "../../core/Vec2/Vec2";
import type { Material } from "./material";

export interface TexturedMaterial extends Material {
    textureName: string;
    scale: Vec2;
    offset: Vec2;
}
