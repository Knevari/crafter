import type { Mulberry32 } from "./mulberry32";

export class PerlinNoise2D {
    private permutation: number[] = [];
    private gradients: [number, number][] = [];

    constructor(private rng: Mulberry32) {
        this.generatePermutation();
        this.generateGradients();
        console.log(this.gradients)
    }

    private generatePermutation() {
        const p = Array.from({ length: 256 }, (_, i) => i);
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(this.rng.nextFloat() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        this.permutation = [...p, ...p];
    }

    private generateGradients() {
        for (let i = 0; i < 256; i++) {
            const angle = this.rng.nextFloat() * (2 * Math.PI);
            this.gradients[i] = [Math.cos(angle), Math.sin(angle)];
        }
    }

    private dotGridGradient(ix: number, iy: number, x: number, y: number): number {
        const idx = this.permutation[(this.permutation[ix & 255] + iy) & 255];
        const grad = this.gradients[idx];
        const dx = x - ix;
        const dy = y - iy;
        return dx * grad[0] + dy * grad[1];
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    noise(x: number, y: number): number {
        const x0 = Math.floor(x);
        const x1 = x0 + 1;
        const y0 = Math.floor(y);
        const y1 = y0 + 1;

        const sx = this.fade(x - x0);
        const sy = this.fade(y - y0);

        const n0 = this.dotGridGradient(x0, y0, x, y);
        const n1 = this.dotGridGradient(x1, y0, x, y);
        const ix0 = this.lerp(n0, n1, sx);

        const n2 = this.dotGridGradient(x0, y1, x, y);
        const n3 = this.dotGridGradient(x1, y1, x, y);
        const ix1 = this.lerp(n2, n3, sx);

        const value = this.lerp(ix0, ix1, sy);
       
        return value;
    }

    public fractalNoise(
        x: number,
        y: number,
        octaves = 4,
        amplitudeGain = 0.5,
        baseFrequency = 1,
        lacunarity = 2
    ): number {
        let total = 0;
        let frequency = baseFrequency;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;

            amplitude *= amplitudeGain;
            frequency *= lacunarity;
        }

        return total / maxValue;
    }


}
