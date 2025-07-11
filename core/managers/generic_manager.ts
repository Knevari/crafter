// Interface usando chave genérica K corretamente
export interface GenericManager<T, K> {
    name: string;
    values: Map<K, T>;
}

export function createGenericManager<T, K>(name: string): GenericManager<T, K> {
    return {
        name: name,
        values: new Map<K, T>(),
    };
}

export function generic_manager_set<T, K>(
    manager: GenericManager<T, K>,
    key: K,
    value: T
): void {
    manager.values.set(key, value);
}


export function generic_manager_add<T, K>(
    manager: GenericManager<T, K>,
    key: K,
    value: T
): void {
    if (manager.values.has(key)) {
        console.warn(`Key '${String(key)}' already exists. Skipping registration.`);
        return;
    }
    manager.values.set(key, value);
}

export function generic_manager_get<T, K>(
    manager: GenericManager<T, K>,
    key: K
): T | null {
    const value = manager.values.get(key);
    if (value === undefined) {
        console.warn(`[GenericManager] Key "${String(key)}" not found in manager "${manager.name ?? "unknown"}".`);
        return null;
    }
    return value;
}


export function generic_manager_has<T, K>(
    manager: GenericManager<T, K>,
    key: K
): boolean {
    return manager.values.has(key);
}

export function generic_manager_remove<T, K>(
    manager: GenericManager<T, K>,
    key: K
): void {
    manager.values.delete(key);
}

export function generic_manager_get_all<T, K>(
    manager: GenericManager<T, K>
): T[] {
    return Array.from(manager.values.values());
}
