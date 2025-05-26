import type { System } from "./system";
import type { ECSComponents } from "../ecs/ecs-components";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { BoxColliderComponent } from "../types/collider-box";
import { systems } from "../test";
import { checkAABBCollision, resolveAABBCollision } from "../algorithms/AABB/AABB";

export function createColliderSystem(): System {
  return {
    fixedUpdate(ecs: ECSComponents) {

      const boxColliders = ecs.getComponentsByType<BoxColliderComponent>(ComponentType.BoxCollider);

      for (let i = 0; i < boxColliders.length; i++) {
        const aCol = boxColliders[i];
        if (!aCol.enabled) continue;

        const entityA = ecs.getEntityByComponent(aCol);
        if (!entityA) continue;

        const aPos = ecs.getComponent<PositionComponent>(entityA, ComponentType.Position);
        if (!aPos) continue;

        for (let j = i + 1; j < boxColliders.length; j++) {
          const bCol = boxColliders[j];
          if (!bCol.enabled) continue;

          const entityB = ecs.getEntityByComponent(bCol);
          if (!entityB) continue;

          const bPos = ecs.getComponent<PositionComponent>(entityB, ComponentType.Position);
          if (!bPos) continue;

          if (checkAABBCollision(aPos, aCol, bPos, bCol)) {
            resolveAABBCollision(aPos, aCol, bPos, bCol);
            systems.callCollisionStayEvents({ a: aCol, b: bCol });
          }
        }
      }
    }
  };
}