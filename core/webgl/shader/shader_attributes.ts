import type { Shader } from "./shader";

export function shader_get_attribute(shader: Shader, name: string): GLint | null {
  return shader.attributes.get(name) ?? null;
}