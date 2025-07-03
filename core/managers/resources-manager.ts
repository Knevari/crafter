import { Result } from "./result";


export interface Resource {
  name: string;
  path: string;
}
export type ImageFile = Resource;
export type TextFile = Resource;

export class ResourceManager {
  public images = new Map<string, HTMLImageElement>();
  private textFiles = new Map<string, string>();

  async loadImageFiles(assets: ImageFile[]): Promise<void> {
    const promises = assets.map((asset) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(asset.name, img);
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${asset.path}`));
        img.src = asset.path;
      });
    });
    await Promise.all(promises);
  }

  async loadTextFiles(assets: TextFile[]): Promise<void> {
    const promises = assets.map(async (asset) => {
      try {
        const response = await fetch(asset.path);
        if (!response.ok) {
          throw new Error(`Failed to load text file: ${asset.path}`);
        }
        const text = await response.text();
        this.textFiles.set(asset.name, text);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
    await Promise.all(promises);
  }

  getImageSafe(name: string): Result<HTMLImageElement> {
    const img = this.images.get(name);
    if (!img) {
      return Result.err(`Texture "${name}" not found.`);
    }
    return Result.ok(img);
  }

  getTextFileSafe(name: string): Result<string> {
    const text = this.textFiles.get(name);
    if (!text) {
      return Result.err(`Text file "${name}" not found.`);
    }
    return Result.ok(text);
  }

  clear(): void {
    this.images.clear();
    this.textFiles.clear();
  }
}

export const resourceManager = new ResourceManager();