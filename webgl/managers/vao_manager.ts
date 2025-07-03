import type { MeshGL } from "../mesh_gl";
import { createGenericManager } from "./generic_manager";

export const vaoManager = createGenericManager<MeshGL, string>("vao_manager");
