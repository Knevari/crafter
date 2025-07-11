import { ComponentType } from "../../../types/component-type";
import type { SpriteRenderComponent } from "./sprite.render.types";
import type { System } from "../../ecs/system";
import type { ECSComponentState } from "../../ecs/component";
import { ECS } from "../../../../engine/TwoD";
import type { TransformComponent } from "../../transform";
import { generic_manager_get } from "../../../managers/generic_manager";
import { MESH_MANAGER } from "../../../managers/mesh_manager";
import { VAO_MANAGER } from "../../../managers/vao_manager";
import { SHADER_SYSTEM_MANAGER } from "../../../managers/shader_system_manager";
import { material_get } from "../../../builders/create_material";
import { ENGINE } from "../../../../engine/engine.manager";

export function SpriteRenderSystem(
  gl: WebGL2RenderingContext,
  componentState: ECSComponentState
): System {
  return {
    render() {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      let spriteRenderers = ECS.Component.getComponentsByType<SpriteRenderComponent>(
        componentState,
        ComponentType.SPRITE_RENDER
      );

      spriteRenderers = spriteRenderers.sort((a, b) => a.layer - b.layer);
   
      for (const spriteRender of spriteRenderers) {
        if (!spriteRender.enabled) continue;

        const material = material_get(spriteRender.materialName);
        if (!material) continue;

        const shader = generic_manager_get(ENGINE.MANAGER.SHADER, material.shaderName)!;
        gl.useProgram(shader.program);

        const transform = ECS.Component.getComponent<TransformComponent>(
          componentState,
          spriteRender.gameEntity,
          ComponentType.TRANSFORM
        );

        if (!transform) continue;

        const shaderSystem = generic_manager_get(SHADER_SYSTEM_MANAGER, material.name);
        if (!shaderSystem) continue;
        shaderSystem.global?.();

        shaderSystem.local?.(spriteRender.gameEntity);

        const mesh = generic_manager_get(MESH_MANAGER, spriteRender.meshName);
        if (!mesh) continue;

        const vao = generic_manager_get(VAO_MANAGER, mesh.name);
        if (!vao) continue;

        gl.bindVertexArray(vao.vao);
        gl.drawElements(gl.TRIANGLES, vao.indexCount, gl.UNSIGNED_SHORT, 0);

        gl.drawElements(gl.LINES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
      }
    },
  };
}