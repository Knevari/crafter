import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import { ComponentType } from "../types/component-type";
import type { BoxColliderComponent } from "../collider/IBoxCollider";
import { systems } from "../app";
import type { Entity } from "../../lib/types";
import { Gizmos } from "./gizmos";
import type TransformComponent from "../components/transform";
import { SpatialHash } from "./SpatialHash";
import type { ECSSystems } from "../ecs/ecs-system";
import type { CircleColliderComponent } from "../collider/circle-collider";
import type { Collider } from "../collider/collider";
import { testOverlap } from "../collider/overlap/testOverlap";
import { resolveOverlap } from "../collider/resolution/resolveOverlap";

// Util
function makePairKey(id1: string, id2: string): string {
  return id1 < id2 ? `${id1}::${id2}` : `${id2}::${id1}`;
}

interface ColliderData {
  collider: Collider;
  entity: Entity;
  t: TransformComponent;
}

interface CollisionPair {
  a: Collider;
  b: Collider;
}

// Reusáveis
const previousCollisions = new Map<string, CollisionPair>();
const currentCollisions = new Map<string, CollisionPair>();

const cellSize = 64;
const spatialHash = new SpatialHash<ColliderData>(cellSize);

const colliderData: ColliderData[] = [];
const checkedPairs = new Set<string>();
const min = { x: 0, y: 0 };
const max = { x: 0, y: 0 };

export function BoxColliderSystem(): System {
  return {
    fixedUpdate(ecs: ECSComponents) {
      // Limpeza
      currentCollisions.clear();
      colliderData.length = 0;
      spatialHash.clear();
      checkedPairs.clear();

      const boxColliders = ecs.getComponentsByType<BoxColliderComponent>(ComponentType.BOX_COLLIDER);
      const circleColliders = ecs.getComponentsByType<CircleColliderComponent>(ComponentType.CIRCLE_COLLIDER);

      const colliders = [...boxColliders, ...circleColliders];

      for (const collider of colliders) {
        if (!collider.enabled) continue;

        const entity = ecs.getEntityByComponent(collider);
        if (!entity) continue;

        const t = ecs.getComponent<TransformComponent>(entity, ComponentType.TRANSFORM);
        if (!t) continue;

        const offset = collider.offset ?? { x: 0, y: 0 }

        if (collider.type === ComponentType.BOX_COLLIDER) {
          const box = collider as BoxColliderComponent;

          min.x = t.position.x + offset.x - box.width / 2;
          min.y = t.position.y + offset.y - box.height / 2;
          max.x = t.position.x + offset.x + box.width / 2;
          max.y = t.position.y + offset.y + box.height / 2;

        } else if (collider.type === ComponentType.CIRCLE_COLLIDER) {
          const circle = collider as CircleColliderComponent;

          min.x = t.position.x + offset.x - circle.radius;
          min.y = t.position.y + offset.y - circle.radius;
          max.x = t.position.x + offset.x + circle.radius;
          max.y = t.position.y + offset.y + circle.radius;
        }



        const data = { collider: collider, entity, t };
        colliderData.push(data);
        spatialHash.insert(min, max, data);
      }

      detectCollisions(spatialHash, checkedPairs, currentCollisions, previousCollisions, systems);
    },

    onDrawGizmos() {

      for (const { collider, t } of colliderData) {
        const offset = collider.offset ?? { x: 0, y: 0 };

        if (collider.type === ComponentType.BOX_COLLIDER) {
          const box = collider as BoxColliderComponent;
          Gizmos.drawRect({
            x: t.position.x + offset.x - box.width / 2,
            y: t.position.y + offset.y - box.height / 2,
            width: box.width,
            height: box.height,
            color: "rgb(124, 255, 2)",
          });
        } else if (collider.type === ComponentType.CIRCLE_COLLIDER) {
          const circle = collider as CircleColliderComponent;
          Gizmos.drawCircle({
            x: t.position.x + offset.x,
            y: t.position.y + offset.y,
            radius: circle.radius,
            color: "rgb(255, 196, 0)",
          });
        }
      }
    }
  }
}

function detectCollisions(
  spatialHash: SpatialHash<ColliderData>,
  checkedPairs: Set<string>,
  currentCollisions: Map<string, CollisionPair>,
  previousCollisions: Map<string, CollisionPair>,
  systems: ECSSystems
) {

  for (const collidersInCell of spatialHash.getBuckets()) {
    const length = collidersInCell.length;

    for (let i = 0; i < length; i++) {
      const a = collidersInCell[i];

      for (let j = i + 1; j < length; j++) {
        const b = collidersInCell[j];

        if (a.entity.id === b.entity.id) continue;

        const pairKey = makePairKey(
          a.collider.instanceId.toString(),
          b.collider.instanceId.toString()
        );
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);


        if (!testOverlap(a.t.position, a.collider, b.t.position, b.collider)) continue;

        const aIsTrigger = a.collider.isTrigger;
        const bIsTrigger = b.collider.isTrigger;

        const isTriggerInteraction = aIsTrigger || bIsTrigger;

        currentCollisions.set(pairKey, { a: a.collider, b: b.collider });
        const wasColliding = previousCollisions.has(pairKey);


        if (isTriggerInteraction) {
          if (!wasColliding) systems.callTriggerEnterEvents({ a: a.collider, b: b.collider });
          systems.callTriggerStayEvents({ a: a.collider, b: b.collider });
          continue;
        }


        if (!wasColliding) systems.callCollisionEnterEvents({ a: a.collider, b: b.collider });
        systems.callCollisionStayEvents({ a: a.collider, b: b.collider });

        const resolution = resolveOverlap(a.t.position, a.collider, b.t.position, b.collider);
        if (resolution) {
          a.t.position.x += resolution.dx;
          a.t.position.y += resolution.dy;
        }
      }
    }
  }

  for (const [pairKey, pair] of previousCollisions.entries()) {
    if (!currentCollisions.has(pairKey)) {
      if (pair.a.isTrigger || pair.b.isTrigger) {
        systems.callTriggerExitEvents(pair);
      } else {
        systems.callCollisionExitEvents(pair);
      }
    }
  }

  previousCollisions.clear();
  for (const [pairKey, pair] of currentCollisions.entries()) {
    previousCollisions.set(pairKey, pair);
  }
}