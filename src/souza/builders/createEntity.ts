import type { Entity } from "../../lib/types";
import { getId } from "./createId";

export function createEntity(
  name: string,
  tag = "untagged"
): Entity {
  return { id: getId(), name, tag };
}