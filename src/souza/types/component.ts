import type { BaseEntity } from "../../lib/types";

export interface Component {
  entity?: BaseEntity;
  enabled: boolean;
}