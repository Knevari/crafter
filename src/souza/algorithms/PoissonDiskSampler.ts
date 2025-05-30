import { Mulberry32 } from "./mulberry32";

type Point = { x: number; y: number };

export class PoissonDiskSampler {
  private width: number;
  private height: number;
  private radius: number;
  private k: number;
  private cellSize: number;
  private grid: (Point | null)[][];
  private points: Point[] = [];
  private active: Point[] = [];
  private rng: Mulberry32;

  constructor(width: number, height: number, radius: number, seed: number, k: number = 30) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.k = k;
    this.cellSize = radius / Math.SQRT2;
    const cols = Math.ceil(width / this.cellSize);
    const rows = Math.ceil(height / this.cellSize);
    this.grid = Array.from({ length: cols }, () => Array(rows).fill(null));

    this.rng = new Mulberry32(seed);
  }

  public sample(): Point[] {
    const initial: Point = {
      x: this.rng.next() * this.width,
      y: this.rng.next() * this.height,
    };
    this.points.push(initial);
    this.active.push(initial);
    this.insertIntoGrid(initial);

    while (this.active.length > 0) {
      const i = Math.floor(this.rng.next() * this.active.length);
      const point = this.active[i];
      let found = false;

      for (let n = 0; n < this.k; n++) {
        const newPoint = this.generateRandomAround(point);
        if (this.isValid(newPoint)) {
          this.points.push(newPoint);
          this.active.push(newPoint);
          this.insertIntoGrid(newPoint);
          found = true;
          break;
        }
      }

      if (!found) {
        this.active.splice(i, 1);
      }
    }

    return this.points;
  }

  private generateRandomAround(p: Point): Point {
    const r = this.radius * (1 + this.rng.next());
    const angle = 2 * Math.PI * this.rng.next();
    return {
      x: p.x + r * Math.cos(angle),
      y: p.y + r * Math.sin(angle),
    };
  }

  private insertIntoGrid(p: Point) {
    const gx = Math.floor(p.x / this.cellSize);
    const gy = Math.floor(p.y / this.cellSize);
    if (this.grid[gx] && this.grid[gx][gy] !== undefined) {
      this.grid[gx][gy] = p;
    }
  }

  private isValid(p: Point): boolean {
    if (p.x < 0 || p.x >= this.width || p.y < 0 || p.y >= this.height) return false;

    const gx = Math.floor(p.x / this.cellSize);
    const gy = Math.floor(p.y / this.cellSize);

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const nx = gx + i;
        const ny = gy + j;
        if (this.grid[nx]?.[ny]) {
          const neighbor = this.grid[nx][ny]!;
          const dx = neighbor.x - p.x;
          const dy = neighbor.y - p.y;
          if (dx * dx + dy * dy < this.radius * this.radius) return false;
        }
      }
    }

    return true;
  }
}
