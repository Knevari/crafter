import { ComponentType } from "../../types/component-type";
import type { BoxColliderComponent } from "../../gears/collider/box/BoxCollider";
import type TransformComponent from "../../gears/transform/transform.types";
import { SpatialHash } from "../../algorithms/SpatialHash";
import type { CircleColliderComponent } from "../../collider/types/CircleCollider";
import type { Collider } from "../../collider/types/Collider";
import { testOverlap } from "../../collider/overlap/testOverlap";
import { resolveOverlap } from "../../collider/resolution/resolveOverlap";
import type { Vec2 } from "../../Vec2/Vec2";
import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState } from "../../gears/ecs/component";
import type { System } from "../../gears/ecs/system";
// import { Gizmos } from "./gizmos";


// Util
function makePairKey(id1: number, id2: number): string {
  return id1 < id2 ? `${id1}::${id2}` : `${id2}::${id1}`;
}

interface CollisionPair {
  a: Collider;
  b: Collider;
}


function getColliderMinMax(
  collider: Collider,
  position: Vec2,
  outMin: Vec2,
  outMax: Vec2
) {
  const offset = collider.offset ?? { x: 0, y: 0 };
  const centerX = position.x + offset.x;
  const centerY = position.y + offset.y;

  if (collider.type === ComponentType.BOX_COLLIDER) {
    const box = collider as BoxColliderComponent;
    const halfW = box.size.x / 2;
    const halfH = box.size.y / 2;

    outMin.x = centerX - halfW;
    outMin.y = centerY - halfH;
    outMax.x = centerX + halfW;
    outMax.y = centerY + halfH;
  }

  else if (collider.type === ComponentType.CIRCLE_COLLIDER) {
    const circle = collider as CircleColliderComponent;
    const r = circle.radius;

    outMin.x = centerX - r;
    outMin.y = centerY - r;
    outMax.x = centerX + r;
    outMax.y = centerY + r;
  }
}


export interface CollisionState {
  previous: Map<string, CollisionPair>;
  current: Map<string, CollisionPair>;
  checked: Set<string>;
  collision: Set<string>;
}

export function ColliderSystem(componentState: ECSComponentState, state: ECS.System.ECSSystemState): System {

  const tempMin = { x: 0, y: 0 };
  const tempMax = { x: 0, y: 0 };

  const spatialHash = new SpatialHash<Collider>(64);

  const collisionState: CollisionState = {
    previous: new Map<string, CollisionPair>(),
    current: new Map<string, CollisionPair>(),
    checked: new Set<string>(),
    collision: new Set<string>(),
  };

  return {
    fixedUpdate() {

      collisionState.current.clear();
      collisionState.checked.clear();
      collisionState.collision.clear();
      spatialHash.clear();

      const colliders = ECS.Component.getComponentsByCategory<Collider>(componentState, ComponentType.COLLIDER);

      for (const collider of colliders) {

        const transform = ECS.Component.getComponent<TransformComponent>(componentState, collider.gameEntity, ComponentType.TRANSFORM);
        if (!transform) continue;

        getColliderMinMax(collider, transform.position, tempMin, tempMax);
        spatialHash.insert(tempMin, tempMax, collider);
      }

      detectCollisions(
        componentState,
        spatialHash,
        collisionState,
        state,
      );
    },

    onDrawGizmos() {
      // const collidersColliding = collisionState.collision;

      // const colliders = component.getComponentsByCategory<Collider>(ComponentType.COLLIDER);

      // for (const collider of colliders) {
      //   const transform = component.getComponent<TransformComponent>(collider.gameEntity, ComponentType.TRANSFORM);
      //   if (!transform) continue;

      //   const posX = transform.position.x + (collider.offset?.x ?? 0);
      //   const posY = transform.position.y + (collider.offset?.y ?? 0);

      //   const isColliding = collidersColliding.has(collider.instanceId.toString());

      //   let color = 'rgba(0, 255, 0, 0.5)';
      //   if (collider.isTrigger) {
      //     color = 'rgba(255, 0, 0, 0.5)';
      //   }
      //   if (isColliding) {
      //     color = 'rgba(255, 255, 0, 0.8)';
      //   }

      //   if (collider.type === ComponentType.BOX_COLLIDER) {
      //     const box = collider as BoxColliderComponent;
      //     Gizmos.drawRect({
      //       x: posX,
      //       y: posY,
      //       width: box.size.x,
      //       height: box.size.y,
      //       color,
      //     });
      //   }
      //   else if (collider.type === ComponentType.CIRCLE_COLLIDER) {
      //     const circle = collider as CircleColliderComponent;
      //     Gizmos.drawCircle({
      //       x: posX,
      //       y: posY,
      //       radius: circle.radius,
      //       color,
      //     });
      //   }
      // }
    }

  };
}

function detectCollisions(
  componentState: ECSComponentState,
  spatialHash: SpatialHash<Collider>,
  collisionState: CollisionState,
  systems: ECS.System.ECSSystemState,
) {
  for (const collidersInCell of spatialHash.getBuckets()) {
    const length = collidersInCell.length;

    for (let i = 0; i < length; i++) {
      const a = collidersInCell[i];
      const aT = ECS.Component.getComponent<TransformComponent>(componentState, a.gameEntity, ComponentType.TRANSFORM);
      if (!aT) continue;

      for (let j = i + 1; j < length; j++) {
        const b = collidersInCell[j];
        if (a.gameEntity.id === b.gameEntity.id) continue;

        const bT = ECS.Component.getComponent<TransformComponent>(componentState,b.gameEntity, ComponentType.TRANSFORM);
        if (!bT) continue;

        const pairKey = makePairKey(a.instanceId, b.instanceId);

        if (collisionState.checked.has(pairKey)) continue;
        collisionState.checked.add(pairKey);

        if (!testOverlap(aT.position, a, bT.position, b)) {
          continue;
        }

        collisionState.current.set(pairKey, { a, b });

        collisionState.collision.add(a.instanceId.toString());
        collisionState.collision.add(b.instanceId.toString());

        const wasColliding = collisionState.previous.has(pairKey);

        const aIsTrigger = a.isTrigger;
        const bIsTrigger = b.isTrigger;
        const isTriggerInteraction = aIsTrigger || bIsTrigger;

        if (isTriggerInteraction) {
          if (!wasColliding) ECS.System.callTriggerEnterEvents(systems, { a, b });
          ECS.System.callTriggerStayEvents(systems, { a, b });
          continue;
        }

        if (!wasColliding) ECS.System.callCollisionEnterEvents(systems, { a, b });
        ECS.System.callCollisionStayEvents(systems, { a, b });

        const resolution = resolveOverlap(
          aT.position,
          a,
          bT.position,
          b,
        );

        if (resolution) {
          aT.position.x += resolution.x;
          aT.position.y += resolution.y;
        }
      }
    }
  }

  for (const [pairKey, pair] of collisionState.previous.entries()) {
    if (!collisionState.current.has(pairKey)) {
      if (pair.a.isTrigger || pair.b.isTrigger) {
        ECS.System.callTriggerExitEvents(systems, pair);
      } else {
        ECS.System.callCollisionExitEvents(systems,pair);
      }
    }
  }

  collisionState.previous.clear();
  for (const [pairKey, pair] of collisionState.current.entries()) {
    collisionState.previous.set(pairKey, pair);
  }
}
