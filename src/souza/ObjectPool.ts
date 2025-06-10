export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private cleaner: (obj: T) => void;

  constructor(factory: () => T, cleaner: (obj: T) => void) {
    this.factory = factory;
    this.cleaner = cleaner;
  }

  acquire(): T {
    return this.pool.pop() ?? this.factory();
  }

  release(obj: T): void {
    this.cleaner(obj);
    this.pool.push(obj);
  }
}
