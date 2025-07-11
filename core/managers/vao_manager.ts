import type { MeshGL } from "../webgl/mesh_gl";
import { createGenericManager } from "./generic_manager";

export const VAO_MANAGER = createGenericManager<MeshGL, string>("vao_manager");
