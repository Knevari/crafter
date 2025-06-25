export default class PCG32 {
    private state: bigint = 0n;
    private inc: bigint = 0n;
    private static readonly MASK_64 = (1n << 64n) - 1n;
    private static readonly MASK_32 = 0xFFFFFFFFn;

    constructor(initState: bigint = 42n, initSeq: bigint = 54n) {
        this.srandom(initState, initSeq);
    }

    private advanceState(oldState: bigint): bigint {
        return (oldState * 6364136223846793005n + this.inc) & PCG32.MASK_64;
    }

    private calculateXorshifted(state: bigint): bigint {
        return ((state >> 18n) ^ state) >> 27n;
    }

    private calculateRotation(state: bigint): number {
        return Number(state >> 59n);
    }

    private rotateRight(x: bigint, rot: number): bigint {
        return ((x >> BigInt(rot)) | (x << BigInt((32 - rot) & 31))) & PCG32.MASK_32;
    }

    private random(): number {
        const oldstate = this.state;
        this.state = this.advanceState(oldstate);

        const xorshifted = this.calculateXorshifted(oldstate);
        const rot = this.calculateRotation(oldstate);
        const result = this.rotateRight(xorshifted & PCG32.MASK_32, rot);

        return Number(result);
    }

    private makeOddIncrement(seq: bigint): bigint {
        return (seq << 1n) | 1n;
    }

    private srandom(initState: bigint, initSeq: bigint): void {
        this.state = 0n;
        this.inc =  this.makeOddIncrement(initSeq);
        this.random();
        this.state = (this.state + initState) & PCG32.MASK_64;
        this.random();
    }

    public randomFloat(): number {
        return this.random() / (0x100000000);
    }

    public randomInRange(min: number, max: number): number {
        return min + this.randomFloat() * (max - min);
    }

    getState(): { state: bigint, inc: bigint } {
        return { state: this.state, inc: this.inc };
    }
}