import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState } from "../ecs/component";
import type { System } from "../ecs/system";
import type { TransformComponent } from "../transform";
import type { RigidBodyComponent } from "../rigid_body/rigid.body";
import { ComponentType } from "../../types/component-type";
import Time from "../../time/time";

const GRAVITY = { x: 0, y: 9.8 };

export function PhysicsSystem(componentState: ECSComponentState): System {
    return {
        fixedUpdate() {
            const rigidbodies = ECS.Component.getComponentsByCategory<RigidBodyComponent>(
                componentState,
                ComponentType.RigidBody
            );

            for (const rigid of rigidbodies) {
                if (rigid.isStatic) continue;

                const transform = ECS.Component.getComponent<TransformComponent>(
                    componentState,
                    rigid.gameEntity,
                    ComponentType.TRANSFORM
                );

                if (!transform) continue;

                if (rigid.useGravity) {
                    rigid.velocity.x += GRAVITY.x * Time.fixedDeltaTime;
                    rigid.velocity.y += GRAVITY.y * Time.fixedDeltaTime;
                }
     
                const decay = Math.exp(-rigid.drag * Time.fixedDeltaTime);
                rigid.velocity.x *= decay;
                rigid.velocity.y *= decay;

                transform.position.x -= rigid.velocity.x * Time.fixedDeltaTime;
                transform.position.y -= rigid.velocity.y * Time.fixedDeltaTime;
            }
        }
    };
}
