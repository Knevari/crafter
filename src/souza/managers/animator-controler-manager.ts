import type { AnimatorController } from "../types/animator";

class AnimatorControllerManager {
  private readonly controllers = new Map<string, AnimatorController>();

  register(controller: AnimatorController): void {
    this.controllers.set(controller.id, controller);
  }

  get(id: string): AnimatorController {
    const controller = this.controllers.get(id);
    if (!controller) throw new Error(`AnimatorController not found: ${id}`);
    return controller;
  }
}

export const animatorControllerManager = new AnimatorControllerManager();
