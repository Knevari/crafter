import type { GameEntity } from "../types/EngineEntity";
import type { Mat4 } from "../webgl/mat4";
import type { Material } from "../webgl/material/material";
import type { Mesh } from "../webgl/mesh";
import type { Shader } from "../webgl/shader";
import type { ShaderSystem } from "../webgl/system/shader_system";
import { createGenericManager } from "./generic_manager";

const GAME_ENTITY = createGenericManager<GameEntity, number>("entity_manager");
const MATERIAL = createGenericManager<Material, string>("material_manager");
const MAT4 = createGenericManager<Mat4, number>("mat4_manager");
const MESH = createGenericManager<Mesh, string>("mesh_manager");
const SHADER = createGenericManager<Shader, string>("shader_manager");
const SHADER_SYSTEM = createGenericManager<ShaderSystem, string>("shader_system_manager");

export const MANAGER = {
    MATERIAL,
    GAME_ENTITY,
    MAT4,
    MESH,
    SHADER,
    SHADER_SYSTEM
}

