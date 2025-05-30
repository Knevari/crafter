import type { Entity } from "../../lib/types";
import type { ComponentType } from "./component-type";

export interface Component {
  entityRef?: Entity;
  enabled: boolean;
  readonly type: ComponentType;
  readonly instanceId: number;
}