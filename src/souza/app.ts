import { engine } from "../lib/engine";
import { ECSComponents } from "./ecs/ecs-components";
import Input from "./input/Input";
import AnimatorSystem from "./systems/animator-system";
import { cameraSystem } from "./systems/camera-system";
import { BoxColliderSystem } from "./systems/box-collider-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import Time from "./time/time";
import { ECSSystems } from "./ecs/ecs-system";
import CharacterControllerAnimationSystem from "./systems/character-controller-animations";
import CharacterControlerSystem from "./systems/character-controller-system";
import { createPlayer } from "./entities/player-entity";
import { createSlime } from "./entities/slime-entity";
import { createCamera } from "./entities/camera-entity";
import { TerrainSystem } from "./systems/terrain-system";
import { resourceManager } from "./managers/resources-manager";
import { Gizmos } from "./systems/gizmos";
import FollowSystem from "./systems/follow-system";
import Noise from "noise-ts";
import { PerlinNoise2D } from "./algorithms/perlin-noise-2d";
import { Mulberry32 } from "./algorithms/mulberry32";

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
// systems.addSystem(FollowSystem(player, [slime], 40, 200));
systems.addSystem(cameraSystem(engine.ctx, player));

await resourceManager.loadImages({
  tilemap_img: "/tilemap.png",
  tree_img: "/Oak_Tree.png",
  grass_img: "/Grass_Middle.png",
  water_img: "/Water_Tile.png",
  player_img: "/Player.png",
  pig_img: "/Pig.png",
  outdoorDeco_img: "/Outdoor_Decor_Free.png",
  slime_img: "/Slime.png",
  slimeGreen_img: "/Slime_Green.png",
  skeleton_img: "/Skeleton.png",
  base: "[Base]BaseChip_pipo.png",
  mushroomAttack: "/mushroom/Mushroom-Attack.png",
  mushroomIdle: "/mushroom/Mushroom-Idle.png",
  mushroomRun: "/mushroom/Mushroom-Run.png"
});

const time = new Time();

time.on("start", () => {
  Input.start();
  systems.callStart();

});

time.on("fixedUpdate", () => {
  systems.callFixedUpdate();

});

time.on("lateUpdate", () => {
  systems.callLatedUpdate();

});

time.on("render", () => {
  engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);

  systems.callRender();
  // systems.callDrawGizmos();
  Gizmos.render(engine.ctx);
  Input.clearInputs();
  Gizmos.clear();
});


time.on("update", () => {
  systems.callUpdate(Time.deltaTime);
  debug.textContent = "DELTA: " + Time.deltaTime.toString() + " FPS: " + Time.fps;

});


time.start();

// console.log(JSON.stringify(ecs.serializePersistentComponents(), null, 2))

