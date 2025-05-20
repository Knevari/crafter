import { TILE_SIZE } from "../../constants";
import { getCollisionBoxDimensions, getEntityCenter } from "../../entities";
import { gameState } from "../../game-state";
import { distance } from "../../math";
import { getTileFromWorldPosition, getTileIsWalkable } from "../../tiles";
import type { Position } from "../../types";
import { isColliding } from "../../utils/is-colliding";

export class Node {
  position: Position;
  G: number;
  H: number;
  parent: Node | null;
  walkable: boolean;

  constructor(position: Position, walkable: boolean) {
    this.G = Infinity;
    this.H = Infinity;
    this.parent = null;
    this.position = position;
    this.walkable = walkable;
  }

  get F() {
    return this.G + this.H;
  }

  setG(value: number) {
    this.G = value;
  }

  setH(value: number) {
    this.H = value;
  }

  setParent(p: Node) {
    this.parent = p;
  }

  getDistance(x: number | Node, y?: number) {
    if (x instanceof Node) {
      return distance(
        this.position.x,
        this.position.y,
        x.position.x,
        x.position.y,
      );
    } else {
      if (typeof y !== "number")
        throw new Error(
          "Pass either a single node or x and y coordinates to dist",
        );
      return distance(this.position.x, this.position.y, x, y);
    }
  }

  getCost(node: Node) {
    return distance(
      this.position.x,
      this.position.y,
      node.position.x,
      node.position.y,
    );
  }

  buildPath() {
    const path: Position[] = [];
    let current: Node | null = this;
    while (current) {
      current = current.parent;
      if (current) {
        path.push(current.position);
      }
    }
    return path.reverse();
  }

  getNeighbors(criteria: (n: Node) => boolean): Node[] {
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const neighbors = directions.map(([dx, dy]) => {
      const x = this.position.x + dx * TILE_SIZE;
      const y = this.position.y + dy * TILE_SIZE;

      const tile = getTileFromWorldPosition(x, y);

      let blocked = false;

      for (const entity of gameState.entities) {
        const [entityCenterX, entityCenterY] = getEntityCenter(entity);

        const collisionBoxDimensions = getCollisionBoxDimensions(entity);
        const collisionBoxOffsetY =
          (entity.collisionBox.yOffset ?? 0) *
          entity.dimensions.height *
          TILE_SIZE;

        if (
          isColliding(
            x + TILE_SIZE / 2,
            y + TILE_SIZE / 2,
            TILE_SIZE,
            TILE_SIZE,
            entityCenterX,
            entityCenterY + collisionBoxOffsetY,
            collisionBoxDimensions.width,
            collisionBoxDimensions.height,
          )
        ) {
          blocked = true;
        }
      }

      const walkable = getTileIsWalkable(tile) && !blocked;

      return new Node({ x, y }, walkable);
    });

    return neighbors.filter(criteria);
  }
}
