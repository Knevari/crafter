import { Result } from "./result";

export interface Resource {
  name: string;
  path: string;
}
export type Texture = Resource;
export type TextFile = Resource;

export class ResourceManager {
  private images = new Map<string, HTMLImageElement>();

  async loadTextures(assets: Texture[]): Promise<void> {
    const promises = assets.map((asset) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(asset.name, img);
          resolve();
        };
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${asset.path}`));
        img.src = asset.path;
      });
    });

    await Promise.all(promises);
  }

  getTextureSafe(name: string): Result<HTMLImageElement> {
    const img = this.images.get(name);
    if (!img) {
      return Result.err(`Texture "${name}" not found.`);
    }
    return Result.ok(img);
  }


  tryGetImage(name: string): HTMLImageElement | null {
    return this.images.get(name) ?? null;
  }

  hasImage(name: string): boolean {
    return this.images.has(name);
  }

  getLoadedImages(): string[] {
    return Array.from(this.images.keys());
  }

  clear(): void {
    this.images.clear();
  }
}

export const resourceManager = new ResourceManager();
