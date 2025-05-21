import type { Entity } from "../../lib/types";
import type { AnimatorComponent } from "../animation";

export default class ECS {
    public static readonly animatorComponents = new Map<Entity, AnimatorComponent>();
}