import type { ShaderSystem } from "../system/shader_system";
import { createGenericManager } from "./generic_manager";

export const shaderSystemManager = createGenericManager<ShaderSystem, string>("shader_system_manager");
