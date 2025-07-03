import type { Mesh } from "../mesh";
import { createGenericManager } from "./generic_manager";

export const meshManager = createGenericManager<Mesh, string>("mesh_manager");
