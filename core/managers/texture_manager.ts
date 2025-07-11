import type { Texture } from "../webgl/texture";
import { createGenericManager } from "./generic_manager";

export const TEXTURE_MANAGER = createGenericManager<Texture, string>("texture_manager");