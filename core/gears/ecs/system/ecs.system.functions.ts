import type { ECSSystemState, System } from "./ecs.system.types";

export function addSystem(state: ECSSystemState, system: System): void {
    state.systems.push(system);
}


export let SYSTEM_STATE: ECSSystemState = createState();

export function createState(): ECSSystemState {
    const state = { systems: [] };
    return state;
}