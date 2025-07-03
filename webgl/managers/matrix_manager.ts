import type { Mat4 } from "../mat4";
import { createGenericManager } from "./generic_manager";

export const matrixManager = createGenericManager<Mat4, number>("matrix_manager");