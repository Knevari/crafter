import { Builders, ECS, Types } from "../../engine/TwoD";
import { PLAYER_ANIMATOR_CONTROLLER } from "../controllers/player.animator.controller";
import type { CharacterControlerComponent } from "../systems/character-controller/character-controller";

export function createPlayer(componentState: Types.ECSComponentState, name: string) {

  const gameEntity = Builders.createGameEntity(name, "Player");

  const transform = Builders.createTransformComponent(gameEntity);
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
    speed: 80,
    runSpeed: 100

  });

  const spriteRener = Builders.createSpriteRender(gameEntity, { scale: 2, layer: 1 });
  ECS.Component.addComponent(componentState, gameEntity, spriteRener);


  const animator = Builders.createAnimatorComponent(gameEntity, { controller: PLAYER_ANIMATOR_CONTROLLER });
  ECS.Component.addComponent(componentState, gameEntity, animator);

  return gameEntity;
}

