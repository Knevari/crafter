import type { Mesh } from "../webgl/mesh";
import { createGenericManager } from "./generic_manager";

export const MESH_MANAGER = createGenericManager<Mesh, string>("mesh_manager");
