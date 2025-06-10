import { SimplexNoise } from "../algorithms/SimplexNoise";
import { Biome, classifyBiomes } from "./biome";

export interface TerrainCell {
  x: number;
  y: number;
  scale: number;
  value: number;
  biome?: Biome;
  isWater?: boolean;
}

export class World {
  private readonly noise: SimplexNoise;
  private readonly OCTAVES = 6;
  private readonly PERSISTENCE = 0.4;
  public readonly NOISE_SCALE = 64;
  public readonly TILE_SIZE = 32;

  constructor(seed: number) {
    this.noise = new SimplexNoise(seed);
  }

  public generateCells(
    width: number,
    height: number,
    chunkX: number,
    chunkY: number
  ): TerrainCell[] {
    const terrain: TerrainCell[] = [];

    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);

    for (let y = -halfHeight; y < height - halfHeight; y++) {
      for (let x = -halfWidth; x < width - halfWidth; x++) {
        const tileX = chunkX * width + x;
        const tileY = chunkY * height + y;

        const value = this.noise.fractalNoise2D(
          tileX / this.NOISE_SCALE,
          tileY / this.NOISE_SCALE,
          this.OCTAVES,
          this.PERSISTENCE
        );

        terrain.push({
          x: tileX * this.TILE_SIZE,
          y: tileY * this.TILE_SIZE,
          scale: this.TILE_SIZE,
          value: (value + 1) / 2,
          biome: undefined,
        });
      }
    }

    classifyBiomes(terrain);

    return terrain;
  }


}
