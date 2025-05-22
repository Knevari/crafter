import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { BoxColliderComponent } from "../types/collider-box";
import Draw from "../helpers/draw-helper";

export function createColliderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const entities = ecs.queryEntitiesWithComponents(
        ComponentType.Position,
        ComponentType.BoxCollider
      );

      for (let i = 0; i < entities.length; i++) {
        const a = entities[i];
        const aPos = ecs.getComponent<PositionComponent>(a, ComponentType.Position);
        if(!aPos) continue;
        const aCol = ecs.getComponent<BoxColliderComponent>(a, ComponentType.BoxCollider);
        if (!aCol || aCol.enabled === false) continue;

        Draw.drawWireSquare(
          ctx,
          aPos.x + (aCol.offsetX ?? 0),
          aPos.y + (aCol.offsetY ?? 0),
          aCol.width,
          aCol.height,
          "lime",
          1     
        );

        for (let j = i + 1; j < entities.length; j++) {
          const b = entities[j];
          const bPos = ecs.getComponent<PositionComponent>(b, ComponentType.Position);
          if(!bPos) continue;
          const bCol = ecs.getComponent<BoxColliderComponent>(b, ComponentType.BoxCollider);
          if (!bCol || bCol.enabled === false) continue;

          if (checkAABBCollision(aPos, aCol, bPos, bCol)) {
            console.log(`Collision detected between ${a.id} and ${b.id}`);

            Draw.drawWireSquare(
              ctx,
              bPos.x + (bCol.offsetX ?? 0),
              bPos.y + (bCol.offsetY ?? 0),
              bCol.width,
              bCol.height,
              "red",
              2
            );
          }
        }
      }
    }
  };
}

function checkAABBCollision(
  aPos: PositionComponent,
  aCol: BoxColliderComponent,
  bPos: PositionComponent,
  bCol: BoxColliderComponent
): boolean {
  const ax = aPos.x + (aCol.offsetX ?? 0);
  const ay = aPos.y + (aCol.offsetY ?? 0);
  const bx = bPos.x + (bCol.offsetX ?? 0);
  const by = bPos.y + (bCol.offsetY ?? 0);

  return (
    ax < bx + bCol.width &&
    ax + aCol.width > bx &&
    ay < by + bCol.height &&
    ay + aCol.height > by
  );
}
