import type TransformComponent from "../../transform/transform.types";
import { engine2d } from "../../../Engine2d";
import Draw from "../../../helpers/draw-helper";
import Vec2Math from "../../../helpers/vec2-math";
import { resourceManager } from "../../../managers/resources-manager";
import { Result } from "../../../managers/result";
import { ComponentType } from "../../../types/component-type";
import type { SpriteRenderComponent } from "./sprite.render.types";

import type { Vec2 } from "../../../Vec2/Vec2";
import type { System } from "../../ecs/system";
import type { ECSComponentState } from "../../ecs/component";
import { ECS } from "../../../../engine/TwoD";
import type { GameEntity } from "../../../types/EngineEntity";

const origin: Vec2 = { x: 0.5, y: 0.5 };

export function SpriteRenderSystem(componentState: ECSComponentState, camera: GameEntity): System {
  return {
    render() {

      const cameraTransform = ECS.Component.getComponent<TransformComponent>(
        componentState,
        camera,
        ComponentType.TRANSFORM
      );
      if (!cameraTransform) return;

      const spriteRenderers = ECS.Component.getComponentsByType<SpriteRenderComponent>(
        componentState,
        ComponentType.SPRITE_RENDER,
      );
      spriteRenderers.sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender || !spriteRender.enabled) continue;

        const transform = ECS.Component.getComponent<TransformComponent>(
          componentState,
          spriteRender.gameEntity,
          ComponentType.TRANSFORM,
        );
        if (!transform) continue;

        const sprite = spriteRender.sprite;

        const position = Vec2Math.subtract(
          transform.position,
          cameraTransform.position,
        );
        const scale: Vec2 = {
          x: spriteRender.scale ?? 32,
          y: spriteRender.scale ?? 32,
        };
        const ctx = engine2d.getContext();
        if (sprite) {
          const textureResult = resourceManager.getTextureSafe(sprite.texture);

          if (Result.isErr(textureResult)) {
            console.warn(`Texture not found: ${textureResult.error}`);
            continue;
          }

          const texture = textureResult.value;

          Draw.drawSprite(
            ctx,
            texture,
            sprite,
            position,
            scale,
            0,
            spriteRender.flipHorizontal ?? false,
            spriteRender.flipVertical ?? false,
            spriteRender.alpha ?? 1.0,

          );


        } else {
          Draw.drawFillRect(
            ctx,
            position,
            scale,
            origin,
            spriteRender.color ?? " #ffffff",

          );
        }
      }
    },
  };
}
