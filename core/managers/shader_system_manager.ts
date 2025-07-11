import type { ShaderSystem } from "../webgl/system/shader_system";
import { createGenericManager } from "./generic_manager";

export const SHADER_SYSTEM_MANAGER = createGenericManager<ShaderSystem, string>("shader_system_manager");