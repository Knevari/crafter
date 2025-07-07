import type { Material } from "../material/material";
import { createGenericManager } from "./generic_manager";

export const materialManager = createGenericManager<Material, string>("material_manager");