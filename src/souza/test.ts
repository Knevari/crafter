import { engine } from "../lib/engine";
import type { BaseEntity } from "../lib/types";
import { PLAYER_IDLE_DOWN_CLIP } from "./game/player-animations";
import { SLIME_IDLE_CLIP } from "./game/slime_animations";
import AnimatorSystem from "./systems/animator-system";
import CharacterControllerComponent from "./systems/character-controller-system";
import { ECSComponents } from "./ecs/ecs-components";
import { ECSSystems } from "./ecs/ecs-system";
import FollowSystem from "./systems/follow-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import type { AnimatorComponent } from "./types/animator";
import type { PositionComponent, CharacterControlerComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";


const playerEntity: BaseEntity = { id: "player" }
const slimeEntity: BaseEntity = { id: "slime" }

const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControllerComponent())
systems.addSystem(FollowSystem(playerEntity, [slimeEntity], 40))



export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);
}

function createPlayer() {


  ecs.addComponent<SpriteRenderComponent>(playerEntity, ComponentType.SpriteRender, {
    sprite: PLAYER_IDLE_DOWN_CLIP.frames[0].sprite,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(playerEntity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

  ecs.addComponent<CharacterControlerComponent>(playerEntity, ComponentType.CharacterControler, {
    direction: { x: 0, y: 0 },
    lastDirection: "left",
    moving: false,
    speed: 80,

  });

  ecs.addComponent<AnimatorComponent>(playerEntity, ComponentType.Animator, {
    playbackSpeed: 1.0,
    locked: false,
    currentClip: PLAYER_IDLE_DOWN_CLIP,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0


  });
}

function createSlime() {

  ecs.addComponent<SpriteRenderComponent>(slimeEntity, ComponentType.SpriteRender, {
    sprite: SLIME_IDLE_CLIP.frames[0].sprite,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(slimeEntity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

  ecs.addComponent<AnimatorComponent>(slimeEntity, ComponentType.Animator, {
    playbackSpeed: 1.0,
    locked: false,
    currentClip: SLIME_IDLE_CLIP,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0


  });
}
export function start() {
  createPlayer();
  createSlime()
}



