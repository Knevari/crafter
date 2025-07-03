import { ECS } from "../../../engine/TwoD";
import { ComponentType } from "../../types/component-type";
import type { ECSComponentState } from "../ecs/component";
import type { System } from "../ecs/system/ecs.system.types";
import type { RigidBodyComponent } from "./rigid.body";
import type { TransformComponent } from "../transform";
import Time from "../../time/time";

const gravity = { x: 0, y: 9.8 };

export function RigidBodySystem(state: ECSComponentState): System {
    return {
        fixedUpdate() {
            const rigidBodies = ECS.Component.getComponentsByType<RigidBodyComponent>(
                state,
                ComponentType.RigidBody
            );

            for (const body of rigidBodies) {
                if (body.isStatic || !body.enabled) continue;


                if (body.useGravity) {
                    body.acceleration.y += gravity.y * body.gravityScale;
                    body.acceleration.x += gravity.x * body.gravityScale;
                }


                const dragFactor = Math.max(0, 1 - body.drag);
                body.velocity.x *= dragFactor;
                body.velocity.y *= dragFactor;


                body.velocity.x += body.acceleration.x * Time.fixedDeltaTime;
                body.velocity.y += body.acceleration.y * Time.fixedDeltaTime;


                const transform = ECS.Component.getComponent<TransformComponent>(
                    state,
                    body.gameEntity,
                    ComponentType.TRANSFORM
                );

                if (transform) {
                    transform.position.x += body.velocity.x * Time.fixedDeltaTime;
                    transform.position.y += body.velocity.y * Time.fixedDeltaTime;
                }

                body.acceleration.x = 0;
                body.acceleration.y = 0;
            }
        },
    };
}