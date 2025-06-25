export interface EngineEntity {
    readonly id: number;
}

export interface GameEntity extends EngineEntity {
    tag: string;
    acitve: boolean;
    name: string;
}
