import type { Entity } from "../../lib/types";

export function createEntity(
  id: string,
  name: string,
  tag = "untagged"
): Entity {
  return { id, name, tag };
}