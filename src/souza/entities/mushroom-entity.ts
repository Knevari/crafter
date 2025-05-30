// import type { Entity } from "../../lib/types";
// import type { ECSComponents } from "../ecs/ecs-components";
// import type { AnimatorComponent } from "../types/animator";
// import { ComponentType } from "../types/component-type";
// import { createSpriteRender } from "../builders/createSpriteRender";
// import { createAnimator } from "../builders/createAnimator";
// import { createPosition } from "../builders/createPosition";
// import { MUSHROOM_CONTROLLER } from "../animator/controllers/mushroom-controller";

// export function createMushroom(ecs: ECSComponents, name: string) {

//   const entity: Entity = { id: name };

//   const position = createPosition();
//   ecs.addComponent(entity, ComponentType.POSITION, position);

//   const spriteRener = createSpriteRender(entity, { scale: 2, layer: 10 });
//   ecs.addComponent(entity, ComponentType.SPRITE_RENDER, spriteRener);

//   const animator = createAnimator(entity, MUSHROOM_CONTROLLER);
//   ecs.addComponent<AnimatorComponent>(entity, ComponentType.ANIMATOR, animator);

//   return entity;
// }

