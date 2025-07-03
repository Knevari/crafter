import type { ShaderProgram } from "../shader";
import { createGenericManager } from "./generic_manager";

export const shaderManager = createGenericManager<ShaderProgram, string>("shader_manager");
