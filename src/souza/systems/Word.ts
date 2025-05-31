import { SimplexNoise } from "../algorithms/SimplexNoise";
import type { Vector2 } from "../types/vector2";

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
    private readonly OCTAVES = 2;
    private readonly PERSISTENCE = 0.3;
    public readonly NOISE_SCALE = 256;
    public readonly TILE_SIZE = 64;

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

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const globalX = chunkX * width + x;
                const globalY = chunkY * height + y;

                const value = this.noise.fractalNoise2D(
                    globalX / this.NOISE_SCALE,
                    globalY / this.NOISE_SCALE,
                    this.OCTAVES,
                    this.PERSISTENCE
                )

                const wordPos = World.getWorldPosition(globalX, globalY, width, height, this.TILE_SIZE);
                terrain.push({
                    x: wordPos.x,
                    scale: this.TILE_SIZE,
                    y: wordPos.y,
                    value: (value + 1) / 2,
                    biome: undefined,

                });
            }
        }

        classifyBiomes(terrain);

        return terrain;
    }

  

    public static getWorldPosition(
        x: number, y: number,
        worldWidth: number, worldHeight: number,
        scale: number
    ): Vector2 {
        const worldX = (x - worldWidth / 2) * scale;
        const worldY = (y - worldHeight / 2) * scale;

        return { x: worldX, y: worldY };
    }



}
