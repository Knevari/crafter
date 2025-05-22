export class GenericManagerError extends Error {
  constructor(managerName: string, id: string) {
    super(`${managerName}: item com id "${id}" não foi encontrado.`);
    this.name = `${managerName}Error`;
  }
}

export interface Registable {
  itemId: string;
}

export class Manager<T> {
  private items = new Map<string, T>();

  constructor(private readonly managerName = "Manager") {}

  register(id: string, item: T): void {
    this.items.set(id, item);
  }

  get(id: string): T {
    const item = this.items.get(id);
    if (!item) throw new GenericManagerError(this.managerName, id);
    return item;
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  unregister(id: string): void {
    this.items.delete(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }
}

