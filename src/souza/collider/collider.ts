import type { Component } from "../types/component";
import type { Vector2 } from "../types/vector2";

export interface Collider extends Component {
  offset?: Vector2;
  isTrigger?: boolean;
  collisionGroup?: string;
  ignoreGroups?: Set<string>; 
  ignoreSelfCollisions: boolean;
}
