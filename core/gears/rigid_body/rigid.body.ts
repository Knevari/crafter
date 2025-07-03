import type { Vec2 } from "../../Vec2/Vec2";
import type { Component, ComponentOptions } from "../component/component";

export type RigidBodyOptions = ComponentOptions<RigidBodyComponent>;

export interface RigidBodyComponent extends Component {
    mass: number;
    velocity: Vec2;
    acceleration: Vec2;
    drag: number;
    gravityScale: number;
    isStatic: boolean;
    useGravity: boolean;
}