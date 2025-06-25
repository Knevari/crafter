import { ECS } from "../../engine/TwoD";
import { engine2d } from "../Engine2d";
import type { BoxColliderComponent } from "../gears/collider/box/BoxCollider";
import type { ECSComponentState } from "../gears/ecs/component";
import type { System } from "../gears/ecs/system";
import type TransformComponent from "../gears/transform/transform.types";

import Draw from "../helpers/draw-helper";
import Vec2Math from "../helpers/vec2-math";
import { ComponentType } from "../types/component-type";

export function DebugSystem(componentState: ECSComponentState): System {
  let cameraTransform: TransformComponent | null = null;

  return {
    start() {
      const cameras = ECS.Component.getComponentsByType<TransformComponent>(
        componentState,
        ComponentType.TRANSFORM
      );

      for (const camera of cameras) {
        if (camera.gameEntity.tag === "MainCamera") {
          cameraTransform = camera;
          break;
        }
      }

      if (!cameraTransform) {
        console.warn("DebugSystem: Nenhuma câmera principal (MainCamera) encontrada.");
      }
    },

    onDrawGizmos() {
      if (!cameraTransform) return;

      const colliders = ECS.Component.getComponentsByCategory(
        componentState,
        ComponentType.COLLIDER
      );

      for (const collider of colliders) {
        const transform = ECS.Component.getComponent<TransformComponent>(
          componentState,
          collider.gameEntity,
          ComponentType.TRANSFORM
        );

        if (!transform) continue;

        if (collider.type === ComponentType.BOX_COLLIDER) {
          const box = collider as BoxColliderComponent;
          const worldPosition = Vec2Math.subtract(
            Vec2Math.add(transform.position, box.offset),
            cameraTransform.position
          );

          Draw.drawWireSquare(
            engine2d.getContext(),
            worldPosition,
            box.size,
            { x: 0.5, y: 0.5 }
          );
        }
      }
    },
  };
}
