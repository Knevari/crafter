export interface EngineEntity {
    readonly id: number;
}

export interface GameEntity extends EngineEntity {
    tag: string;
    active: boolean;
    name: string;
    parent: GameEntity | null;
    layerMask: number;
}