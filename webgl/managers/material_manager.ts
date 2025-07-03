import type { Material } from "../material";
import { createGenericManager } from "./generic_manager";

export const materialManager = createGenericManager<Material, string>("material_manager");