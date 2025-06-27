import type { Component } from "../../gears/component/component";
import type { Vec2 } from "../../Vec2/Vec2";

export interface Collider extends Component {
  offset: Vec2;
  isTrigger: boolean;
  collisionGroup?: string;
  ignoreGroups?: Set<string>; 
  ignoreSelfCollisions: boolean;
}
