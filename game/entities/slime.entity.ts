import { SLIME_ANIMATOR_CONTROLLER } from "../controllers/slime.animator.controller";
import type { ECSComponentState } from "../../core/gears/ecs/component";
import { Builders, ECS } from "../../engine/TwoD";

export function createSlime(componentState: ECSComponentState, name: string) {
  const gameEntity = Builders.createGameEntity(name, "Enemy");

  const transform = Builders.createTransformComponent(gameEntity);
  ECS.Component.addComponent(componentState, gameEntity, transform);

  const spriteReder = Builders.createSpriteRenderComponent(gameEntity, { layer: 1, materialName: "advanced_material" });
  ECS.Component.addComponent(componentState, gameEntity, spriteReder);

  const animator = Builders.createAnimatorComponent(gameEntity, { controller: SLIME_ANIMATOR_CONTROLLER });
  ECS.Component.addComponent(componentState, gameEntity, animator);

  const circleCollider = Builders.createBoxColliderComponent(gameEntity);
  ECS.Component.addComponent(componentState, gameEntity, circleCollider);

  const rigidBody = Builders.createRigidBodyComponent(gameEntity, { useGravity: false });
  ECS.Component.addComponent(componentState, gameEntity, rigidBody);
  return gameEntity;

}