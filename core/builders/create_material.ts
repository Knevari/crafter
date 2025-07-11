import { ENGINE } from "../../engine/engine.manager";
import { rgba, type Color } from "../../game/systems/procedural-world/biome";
import { generic_manager_add, generic_manager_get } from "../managers/generic_manager";
import type { Material } from "../webgl/material/material";

export function material_create(name: string, color: Color = rgba(255, 255, 255, 1)) {
    const material: Material = {
        name: name,
        shaderName: null,
        props: [
            { name: "color", type: "color", value: color }
        ]
    }

    generic_manager_add(ENGINE.MANAGER.MATERIAL, name, material);
}

export function material_get(name: string) {
    return generic_manager_get(ENGINE.MANAGER.MATERIAL, name);
}