export default class PCG32 {
    private state: bigint = 0n;
    private inc: bigint = 0n;
    private static readonly MASK_64 = (1n << 64n) - 1n;
    private static readonly MASK_32 = 0xFFFFFFFFn;

    constructor(initState: bigint = 42n, initSeq: bigint = 54n) {
        this.srandom(initState, initSeq);
    }

    random(): number {
        const oldstate: bigint = this.state;
        this.state = (oldstate * 6364136223846793005n + this.inc) & PCG32.MASK_64;

        const xorshifted: bigint = ((oldstate >> 18n) ^ oldstate) >> 27n;
        const rot: bigint = oldstate >> 59n;

        const rot32 = Number(rot);
        const x = xorshifted & PCG32.MASK_32;

        const result = ((x >> BigInt(rot32)) | (x << BigInt((32 - rot32) & 31))) & PCG32.MASK_32;

        return Number(result);
    }

    srandom(initState: bigint, initSeq: bigint): void {
        this.state = 0n;
        this.inc = (initSeq << 1n) | 1n;
        this.random();
        this.state = (this.state + initState) & PCG32.MASK_64;
        this.random();
    }

    randomFloat(): number {
        return this.random() / 0xFFFFFFFF;
    }
}