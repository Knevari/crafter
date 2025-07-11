import { SYSTEM_STATE } from "../core/gears/ecs/system";
import { MANAGER } from "../core/managers/entity_manager";
import { COMPONENT_STATE } from "./types";

export const ENGINE = {
    DEFAULT_COMPONENT_STATE: COMPONENT_STATE,
    DEFAULT_SYSTEM_STATE: SYSTEM_STATE,
    MANAGER: MANAGER
}