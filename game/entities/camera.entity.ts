import { Builders, ECS, Types } from "../../engine/TwoD";

export function createCamera(componentState: Types.ECSComponentState) {

  const entity = Builders.createGameEntity("camera", "MainCamera");

  const camera = Builders.createCameraComponent(entity);
  ECS.Component.addComponent(componentState, entity, camera);

  const transform = Builders.createTransformComponent(entity, { position: { x: 0, y: 0, z: 5 } });
  ECS.Component.addComponent(componentState, entity, transform);

  return entity;
}