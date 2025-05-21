export class ResourceManager {
  private images = new Map<string, HTMLImageElement>();

  async loadImages(assets: Record<string, string>): Promise<void> {
    const promises = Object.entries(assets).map(([key, src]) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(key, img);
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });

    await Promise.all(promises);
  }

  getImage(key: string): HTMLImageElement {
    const img = this.images.get(key);
    if (!img) throw new Error(`Image not found: ${key}`);
    return img;
  }

  hasImage(key: string): boolean {
    return this.images.has(key);
  }

  clear(): void {
    this.images.clear();
  }
}

export const resourceManager = new ResourceManager();
