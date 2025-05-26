export type EventCallback = () => void;

export class EventEmitter {
    private listeners: Map<string, EventCallback[]> = new Map();

    public on(event: string, callback: EventCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    public off(event: string, callback: EventCallback): void {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event)!.filter(cb => cb !== callback);
        this.listeners.set(event, callbacks);
    }

    public emit(event: string): void {
        if (!this.listeners.has(event)) return;
        for (const cb of this.listeners.get(event)!) {
            cb();
        }
    }

    public clear(event: string): void {
        this.listeners.delete(event);
    }

    public clearAll(): void {
        this.listeners.clear();
    }

    public once(event: string, callback: EventCallback): void {
        const wrapper = () => {
            callback();
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}
