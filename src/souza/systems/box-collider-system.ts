import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { BoxColliderComponent } from "../types/collider-box";
import { systems } from "../test";
import { checkAABBCollision, resolveAABBCollision } from "../algorithms/AABB/AABB";
import type { BaseEntity } from "../../lib/types";

const previousCollisions = new Set<string>();
const cellSize = 64;

interface ColliderData { collider: BoxColliderComponent, entity: BaseEntity, pos: PositionComponent };

function shouldCollide(a: BoxColliderComponent, b: BoxColliderComponent): boolean {
  if (a.collisionGroup === "tree" && b.collisionGroup === "tree") return false;
  return true;
}

function getCellKeyFromCell(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

function makePairKey(id1: string, id2: string): string {
  return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
}

function buildSpatialHash(data: ColliderData[]) {
  const spatialHash = new Map<string, typeof data>();

  for (const { collider, pos, entity } of data) {
    const minX = pos.x - collider.width / 2;
    const maxX = pos.x + collider.width / 2;
    const minY = pos.y - collider.height / 2;
    const maxY = pos.y + collider.height / 2;

    const minCellX = Math.floor(minX / cellSize);
    const maxCellX = Math.floor(maxX / cellSize);
    const minCellY = Math.floor(minY / cellSize);
    const maxCellY = Math.floor(maxY / cellSize);

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const key = getCellKeyFromCell(cx, cy);
        if (!spatialHash.has(key)) spatialHash.set(key, []);
        spatialHash.get(key)!.push({ collider, pos, entity });
      }
    }
  }
  return spatialHash;
}

export function BoxColliderSystem(): System {
  return {
    fixedUpdate(ecs: ECSComponents) {
      const currentCollisions = new Set<string>();
      const boxColliders = ecs.getComponentsByType<BoxColliderComponent>(ComponentType.BoxCollider);

      const colliderData = boxColliders.flatMap(c => {
        if (!c.enabled) return [];
        const entity = ecs.getEntityByComponent(c);
        if (!entity) return [];
        const pos = ecs.getComponent<PositionComponent>(entity, ComponentType.Position);
        if (!pos) return [];
        return [{ collider: c, entity, pos }];
      });

      const spatialHash = buildSpatialHash(colliderData);
      const checkedPairs = new Set<string>();

      for (const collidersInCell of spatialHash.values()) {
        for (let i = 0; i < collidersInCell.length; i++) {
          const a = collidersInCell[i];
          for (let j = i + 1; j < collidersInCell.length; j++) {
            const b = collidersInCell[j];

            const pairKey = makePairKey(a.entity.id, b.entity.id);
            if (checkedPairs.has(pairKey)) continue;
            checkedPairs.add(pairKey);

            if (!shouldCollide(a.collider, b.collider)) continue;

            if (checkAABBCollision(a.pos, a.collider, b.pos, b.collider)) {
              currentCollisions.add(pairKey);

              const wasColliding = previousCollisions.has(pairKey);
              if (!wasColliding) {
                systems.callCollisionEnterEvents({ a: a.collider, b: b.collider });
              }

              systems.callCollisionStayEvents({ a: a.collider, b: b.collider });

              if (a.collider.trigger || b.collider.trigger) continue;
              resolveAABBCollision(a.pos, a.collider, b.pos, b.collider);
            }
          }
        }
      }

      for (const pairKey of previousCollisions) {
        if (!currentCollisions.has(pairKey)) {
          const [id1, id2] = pairKey.split("-");
          const colliderA = colliderData.find(d => d.entity.id === id1)?.collider;
          const colliderB = colliderData.find(d => d.entity.id === id2)?.collider;
          if (colliderA && colliderB) {
            systems.callCollisionExitEvents({ a: colliderA, b: colliderB });
          }
        }
      }

      previousCollisions.clear();
      for (const pairKey of currentCollisions) {
        previousCollisions.add(pairKey);
      }
    }
  };
}