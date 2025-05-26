import { engine } from "../lib/engine";
import { ECSComponents } from "./ecs/ecs-components";
import Input from "./input/Input";
import AnimatorSystem from "./systems/animator-system";
import { cameraSystem } from "./systems/camera-system";
import { BoxColliderSystem } from "./systems/box-collider-system";
import FollowSystem from "./systems/follow-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import Time from "./time/time";
import { ECSSystems } from "./ecs/ecs-system";
import CharacterControllerAnimationSystem from "./systems/character-controller-animations";
import CharacterControlerSystem from "./systems/character-controller-system";
import { createPlayer } from "./entities/player-entity";
import { createSlime } from "./entities/slime-entity";
import { createCamera } from "./entities/camera-entity";
import { TerrainSystem } from "./systems/terrain-system";

const debug = document.querySelector("#debug") as HTMLElement;

export const ecs = new ECSComponents();
export const systems = new ECSSystems(ecs);

const player = createPlayer(ecs, "player");
const slime = createSlime(ecs, "slime");
createCamera(ecs);

systems.addSystem(TerrainSystem());
systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(BoxColliderSystem());
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControlerSystem());
systems.addSystem(CharacterControllerAnimationSystem())
systems.addSystem(FollowSystem(player, [slime], 40, 200));
systems.addSystem(cameraSystem(engine.ctx, player));

export function app() {

  const time = new Time();

  time.on("start", () => {
    Input.start();
    systems.callStart();

  });

  time.on("fixedUpdate", () => {
    systems.callFixedUpdate();
    debug.textContent = "DELTA: " + Time.deltaTime.toString() + " FPS: " + Time.fps;
  });

  time.on("lateUpdate", () => {
    systems.callLatedUpdate();

  });

  time.on("render", () => {
    engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    systems.callRender();
    systems.callDrawGizmos();
    Input.clearInputs();

  });

  time.on("update", () => {
    systems.callUpdate(Time.deltaTime);

  });

  time.start();
}