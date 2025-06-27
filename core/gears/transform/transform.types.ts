import type { Component } from "../component/component";
import type { Vec2 } from "../../Vec2/Vec2";

export default interface TransformComponent extends Component{
    position: Vec2,
    rotation: number,
    scale: Vec2
}


