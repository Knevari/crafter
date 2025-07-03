import { Builders, ECS, Types } from "../../engine/TwoD";
import { PLAYER_ANIMATOR_CONTROLLER } from "../controllers/player.animator.controller";
import type { CharacterControlerComponent } from "../systems/character-controller/character.controller.types";

export function createPlayer(componentState: Types.ECSComponentState, name: string) {

  const gameEntity = Builders.createGameEntity(name, "Player");

  const transform = Builders.createTransformComponent(gameEntity, { scale: { x: 0.5, y: 0.5, z: 0 } });
  ECS.Component.addComponent(componentState, gameEntity, transform);

  ECS.Component.addComponent<CharacterControlerComponent>(componentState, gameEntity, {
    instanceId: Builders.createIncrementalId(),
    gameEntity: gameEntity,
    type: "CHARACTER_CONTROLLER",
    category: "CONTROLLER",
    enabled: true,
    facing: "side",
    state: "idle",
    direction: { x: 0, y: 0 },
    moving: false,
    speed: 0.5,
    runSpeed: 1

  });

  const rigidBody = Builders.createRigidBodyComponent(gameEntity, { useGravity: false, mass: 1000 });
  ECS.Component.addComponent(componentState, gameEntity, rigidBody);

  const spriteRener = Builders.createSpriteRenderComponent(gameEntity, { layer: 1, materialName: "advanced_material" });
  ECS.Component.addComponent(componentState, gameEntity, spriteRener);

  const animator = Builders.createAnimatorComponent(gameEntity, { controller: PLAYER_ANIMATOR_CONTROLLER });
  ECS.Component.addComponent(componentState, gameEntity, animator);

  const boxCollider = Builders.createBoxColliderComponent(gameEntity)
  ECS.Component.addComponent(componentState, gameEntity, boxCollider);

  return gameEntity;
}



export function createTest(componentState: Types.ECSComponentState, name: string) {

  const gameEntity = Builders.createGameEntity(name, "particles");

  const transform = Builders.createTransformComponent(gameEntity, { scale: { x: 10, y: 10, z: 0 } });
  ECS.Component.addComponent(componentState, gameEntity, transform);

  const spriteRener = Builders.createSpriteRenderComponent(gameEntity, { layer: -999, materialName: "water_material" });
  ECS.Component.addComponent(componentState, gameEntity, spriteRener);

  return gameEntity;
}