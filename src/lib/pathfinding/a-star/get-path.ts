import { TILE_SIZE } from "../../constants";
import { getTileFromWorldPosition, getTileIsWalkable } from "../../tiles";
import { Node } from "./Node.ts";

const MAX_TRIES = 500;

export function getPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const startTile = getTileFromWorldPosition(startX, startY);

  const startNode = new Node(
    { x: startX, y: startY },
    getTileIsWalkable(startTile),
  );
  startNode.setG(0);
  startNode.setH(0);

  const open = [startNode];
  const closed = new Set();

  let attempt = 0;
  while (open.length > 0) {
    if (attempt >= MAX_TRIES) break;
    attempt++;

    let current = open[0];
    let currentIndex = 0;

    for (let i = 0; i < open.length; i++) {
      const node = open[i];
      if (node.F < current.F || (node.F === current.F && node.H < current.H)) {
        current = node;
        currentIndex = i;
      }
    }

    const tileX = Math.floor(current.position.x / TILE_SIZE);
    const tileY = Math.floor(current.position.y / TILE_SIZE);
    const targetTileX = Math.floor(endX / TILE_SIZE);
    const targetTileY = Math.floor(endY / TILE_SIZE);

    if (tileX === targetTileX && tileY === targetTileY) {
      return current.buildPath();
    }

    open.splice(currentIndex, 1);
    closed.add(current);

    for (const neighbor of current.getNeighbors(
      (n) => n.walkable && !closed.has(n),
    )) {
      const costToNeighbor = current.G + current.getCost(neighbor);
      const inSearch = open.findIndex((p) => p === neighbor) > -1;

      if (!inSearch || costToNeighbor < neighbor.G) {
        neighbor.setG(costToNeighbor);
        neighbor.setParent(current);

        if (!inSearch) {
          neighbor.setH(neighbor.getDistance(endX, endY));
          open.push(neighbor);
        }
      }
    }
  }
}
