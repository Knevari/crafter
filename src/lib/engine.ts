import { Renderer } from "./renderers/renderer";
import { UIRenderer } from "./renderers/ui-renderer";
import { MapRenderer } from "./renderers/map-renderer";
import { DebugRenderer } from "./renderers/debug-renderer";
import { EntityRenderer } from "./renderers/entity-renderer";
import { PlayerRenderer } from "./renderers/player-renderer";
import { gameState } from "./game-state";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const mapRenderer = new MapRenderer();
const debugRenderer = new DebugRenderer();
const entityRenderer = new EntityRenderer();
const playerRenderer = new PlayerRenderer();
const uiRenderer = new UIRenderer();

const renderer = new Renderer(
  mapRenderer,
  debugRenderer,
  entityRenderer,
  playerRenderer,
  uiRenderer,
).injectContext(ctx);

export const engine = {
  state: gameState,
  canvas,
  ctx,
  renderer,
};
