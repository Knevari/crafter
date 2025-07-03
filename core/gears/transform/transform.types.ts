import type { Component, ComponentOptions } from "../component/component";
import type { Vec3 } from "../../../webgl/vec3";
import type { Quat } from "../../../webgl/mat4";


export type TransformOptions = ComponentOptions<TransformComponent>;

export interface TransformComponent extends Component {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
}


