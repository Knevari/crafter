import { ENGINE } from "../../engine/engine.manager";
import { generic_manager_get } from "./generic_manager";

export function matrix_get(key: number) {
    return generic_manager_get(ENGINE.MANAGER.MAT4, key);
}