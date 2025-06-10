import type { Vec2 } from "../src/souza/Vec2/Vec2";

export class PoissonDiskSampler {
  private width: number;
  private height: number;
  private minDist: number;
  private cellSize: number;
  private grid: (Vec2 | null)[];
  private gridWidth: number;
  private gridHeight: number;
  private activeList: Vec2[];
  private samples: Vec2[];
  private maxAttempts: number;
  private rng: () => number;

  constructor(
    width: number,
    height: number,
    minDist: number,
    maxAttempts = 30,
    rng?: () => number
  ) {
    this.width = width;
    this.height = height;
    this.minDist = minDist;
    this.maxAttempts = maxAttempts;
    this.rng = rng ?? Math.random;

    this.cellSize = minDist / Math.SQRT2;
    this.gridWidth = Math.ceil(width / this.cellSize);
    this.gridHeight = Math.ceil(height / this.cellSize);
    this.grid = Array(this.gridWidth * this.gridHeight).fill(null);

    this.activeList = [];
    this.samples = [];

    this.init();
  }

  private init() {
    const x = this.rng() * this.width;
    const y = this.rng() * this.height;
    const point: Vec2 = { x, y };

    this.samples.push(point);
    this.activeList.push(point);
    this.insertGrid(point);
  }

  private insertGrid(point: Vec2) {
    const gx = Math.floor(point.x / this.cellSize);
    const gy = Math.floor(point.y / this.cellSize);
    this.grid[gy * this.gridWidth + gx] = point;
  }

  private isValid(point: Vec2): boolean {
    if (
      point.x < 0 || point.x >= this.width ||
      point.y < 0 || point.y >= this.height
    ) {
      return false;
    }

    const gx = Math.floor(point.x / this.cellSize);
    const gy = Math.floor(point.y / this.cellSize);

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const nx = gx + i;
        const ny = gy + j;

        if (nx < 0 || ny < 0 || nx >= this.gridWidth || ny >= this.gridHeight) continue;

        const neighbor = this.grid[ny * this.gridWidth + nx];
        if (neighbor) {
          const dx = neighbor.x - point.x;
          const dy = neighbor.y - point.y;
          if (dx * dx + dy * dy < this.minDist * this.minDist) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private generateRandomPointAround(point: Vec2): Vec2 {
    const r = this.minDist * (1 + this.rng());
    const angle = 2 * Math.PI * this.rng();
    const x = point.x + r * Math.cos(angle);
    const y = point.y + r * Math.sin(angle);
    return { x, y };
  }

  public sample(): Vec2[] {
    while (this.activeList.length > 0) {
      const index = Math.floor(this.rng() * this.activeList.length);
      const point = this.activeList[index];
      let found = false;

      for (let i = 0; i < this.maxAttempts; i++) {
        const newPoint = this.generateRandomPointAround(point);
        if (this.isValid(newPoint)) {
          this.samples.push(newPoint);
          this.activeList.push(newPoint);
          this.insertGrid(newPoint);
          found = true;
          break;
        }
      }

      if (!found) {
        this.activeList.splice(index, 1);
      }
    }

    return this.samples;
  }
}
