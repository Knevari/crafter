import type { Sprite } from "../../engine/types";
import { createGenericManager } from "./generic_manager";

export const spriteManager = createGenericManager<Sprite, string>("sprite_manager");
