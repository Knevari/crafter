import type { Texture } from "../texture";
import { createGenericManager } from "./generic_manager";

export const textureManager = createGenericManager<Texture, string>("texture_manager");