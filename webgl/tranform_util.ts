import type { TransformComponent } from "../engine/types";
import { generic_manager_get } from "./managers/generic_manager";
import { matrixManager } from "./managers/matrix_manager";
import { scaleMatrix, setTranslation, translateMatrix } from "./mat4";
import type { Vec3 } from "./vec3";

export function transform_translate(transform: TransformComponent, translation: Vec3) {
  const mat = generic_manager_get(matrixManager, transform.instanceId);
  if (mat != null) {
    translateMatrix(mat, translation);
  }
}

export function transform_set_position(transform: TransformComponent, position: Vec3) {
  const mat = generic_manager_get(matrixManager, transform.instanceId);
  if (mat != null) {
    setTranslation(mat, position);
  }
}

export function transform_remove_translation(transform: TransformComponent, translation: Vec3) {
  const mat = generic_manager_get(matrixManager, transform.instanceId);
  if (mat != null) {
    translateMatrix(mat, translation);
  }
}


export function transform_scale(transform: TransformComponent, scale: Vec3) {
  const mat = generic_manager_get(matrixManager, transform.instanceId);
  if (mat != null) {
    scaleMatrix(mat, scale);
  }
}
