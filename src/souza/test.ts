
import ECSComponents, { ECSSystems, ComponentType } from "./ecs";
import type { BaseEntity } from "../lib/types";
import type { PositionComponent } from "./components/component-position";
import CharacterMovementSystem from "./systems/character-movement-system";
import StaticSpriteRenderSystem from "./systems/static-sprite-render-system";
import { ctx } from "../lib/engine";
import type { StaticSpriteComponent } from "./types/sprite";

const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(CharacterMovementSystem());
systems.addSystem(StaticSpriteRenderSystem(ctx))


export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);
}



export function callSouzaSystem(entity: BaseEntity) {

  const image = new Image();
  image.src = "/Player.png";

  image.onload = () => {
    ecs.addComponent< StaticSpriteComponent>(entity, ComponentType.StaticSprite, {
      image,
      width: 64,
      height: 64,
      tileSize: 32,
      spriteX: 3, 
      spriteY: 0, 
    });
  }

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
    x: 0,
    y: 0,
  });
}
