import { Render } from "../../../../engine/TwoD.ts";
import type { Color } from "../../../../game/systems/procedural-world/biome.ts";
import type { Component, ComponentOptions } from "../../component/component.ts";
import type { Sprite } from "../../sprite/sprite.types.ts";

export type SpriteRenderOptions = ComponentOptions<SpriteRenderComponent>;

export interface Render extends Component {
  color: Color;
  alpha?: number;
}

export interface SpriteRenderComponent extends Render {
  sprite: Sprite | null;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  materialName: string;
  meshName: string;
  layer: number;
}

