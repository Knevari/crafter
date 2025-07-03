import { ComponentType } from "../../../types/component-type";
import type { SpriteRenderComponent } from "./sprite.render.types";
import type { System } from "../../ecs/system";
import type { ECSComponentState } from "../../ecs/component";
import { ECS } from "../../../../engine/TwoD";
import type { GameEntity } from "../../../types/EngineEntity";
import type { TransformComponent } from "../../transform";
import { materialManager } from "../../../../webgl/managers/material_manager";
import { generic_manager_get } from "../../../../webgl/managers/generic_manager";
import { meshManager } from "../../../../webgl/managers/mesh_manager";
import { vaoManager } from "../../../../webgl/managers/vao_manager";
import { shaderSystemManager } from "../../../../webgl/managers/shader_system_manager";
import { shaderManager } from "../../../../webgl/managers/shader_manager";

export function SpriteRenderSystem(
  gl: WebGL2RenderingContext,
  componentState: ECSComponentState,
  camera: GameEntity
): System {
  return {
    render() {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const spriteRenderers = ECS.Component.getComponentsByType<SpriteRenderComponent>(
        componentState,
        ComponentType.SPRITE_RENDER
      );

      spriteRenderers.sort((a, b) => a.layer - b.layer);

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender.enabled) continue;

        const material = generic_manager_get(materialManager, spriteRender.materialName);
        if (!material) continue;

        const shader = generic_manager_get(shaderManager, material.shaderName)!;
        gl.useProgram(shader.program);

        const shaderSystem = generic_manager_get(shaderSystemManager, material.name);
        if (!shaderSystem) continue;

        shaderSystem.global?.(gl, camera, componentState);

        const transform = ECS.Component.getComponent<TransformComponent>(
          componentState,
          spriteRender.gameEntity,
          ComponentType.TRANSFORM
        );
        if (!transform) continue;

        shaderSystem.local?.(gl, spriteRender, transform);

        const mesh = generic_manager_get(meshManager, spriteRender.meshName);
        if (!mesh) continue;

        const vao = generic_manager_get(vaoManager, mesh.name);
        if (!vao) continue;

        gl.bindVertexArray(vao.vao);
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
      }
    },
  };
}