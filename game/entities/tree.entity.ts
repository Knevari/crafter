import { Builders, ECS, Types } from "../../engine/TwoD";
import type { Sprite } from "../../engine/types";
import type { Vec3 } from "../../core/webgl/vec3";


export function createTreeEntity(
    componentState: Types.ECSComponentState,
    name: string,
    sprite: Sprite,
    position: Vec3
) {
    const gameEntity = Builders.createGameEntity(name, "Tree");

    const transform = Builders.createTransformComponent(gameEntity, {
        position: position,
        scale: { x: 2, y: 3, z: 0 }
    });

    ECS.Component.addComponent(componentState, gameEntity, transform);

    const spriteRener = Builders.createSpriteRenderComponent(gameEntity, {
        sprite: sprite,
        layer: 1,
        materialName: "advanced_material",
    });

    ECS.Component.addComponent(componentState, gameEntity, spriteRener);

    return gameEntity;
}
