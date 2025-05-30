import type { Entity } from "../../lib/types";
import { createBoxCollider } from "../builders/createBoxCollider";
import { createCircleCollider } from "../builders/createCircleCollider";
import { createEntity } from "../builders/createEntity";
import { createSpriteRender } from "../builders/createSpriteRender";
import { createTransform } from "../components/transform";
import type { ECSComponents } from "../ecs/ecs-components";
import type { Sprite } from "../types/sprite";
import type { Vector2 } from "../types/vector2";

export function entity_create_grass(ecs: ECSComponents, pos: Vector2, sprite: Sprite, layer: number, scale: number, id: string) {
    const entity: Entity = createEntity(id, "grass");
    ecs.addComponent(entity, createTransform(entity, pos), false);
    ecs.addComponent(entity, createSpriteRender(entity, { sprite, scale, layer }), false);
    return entity;
}

export function entity_create_tree(ecs: ECSComponents, pos: Vector2, sprite: Sprite, layer: number, scale: number, id: string) {
    const entity: Entity = createEntity(id, "tree", "tree");
    ecs.addComponent(entity, createTransform(entity, pos), false);
    ecs.addComponent(entity, createSpriteRender(entity, { sprite, scale, layer }), false);
    ecs.addComponent(entity, createCircleCollider(entity, {isTrigger: true}));
    return entity;
}

export function entity_create_trunk(ecs: ECSComponents, pos: Vector2, sprite: Sprite, layer: number, scale: number, id: string) {
    const entity: Entity = createEntity(id, "trunk");
    ecs.addComponent(entity, createTransform(entity, pos), false);
    ecs.addComponent(entity, createSpriteRender(entity, { sprite, scale, layer }), false);
    ecs.addComponent(entity, createBoxCollider(entity, { offset: { x: 0, y: 64 }, height: 32, isTrigger: false, collisionGroup: "tree" }))
    return entity;
}

export function entity_create_dry(ecs: ECSComponents, pos: Vector2, sprite: Sprite, layer: number, scale: number, id: string) {
    const entity: Entity = createEntity(id, "dry");
    ecs.addComponent(entity, createTransform(entity, pos), false);
    ecs.addComponent(entity, createSpriteRender(entity, { sprite, scale, layer }), false);
    return entity;
}
