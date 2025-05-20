import { gameState } from "../game-state";
import type { DebugRenderer } from "./debug-renderer";
import type { EntityRenderer } from "./entity-renderer";
import type { MapRenderer } from "./map-renderer";
import type { PlayerRenderer } from "./player-renderer";
import type { UIRenderer } from "./ui-renderer";

export class Renderer {
  private ctx?: CanvasRenderingContext2D;

  constructor(
    private mapRenderer: MapRenderer,
    private debugRenderer: DebugRenderer,
    private entityRenderer: EntityRenderer,
    private playerRenderer: PlayerRenderer,
    private uiRenderer: UIRenderer,
  ) {}

  injectContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    return this;
  }

  draw() {
    if (this.ctx) {
      this.mapRenderer.draw(this.ctx);
      this.playerRenderer.draw(this.ctx);
      this.entityRenderer.draw(this.ctx);

      if (gameState.debug) {
        this.debugRenderer.draw(this.ctx);
      }

      this.uiRenderer.draw(this.ctx);
    }
  }
}
