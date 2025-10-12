export class DIContainer {

    private bindings = new Map<string, any>();

    bind<T>(key: string, value: T) {
        this.bindings.set(key, value);
    }

    resolve<T>(key: string): T {
        const instance = this.bindings.get(key);
        if (!instance) throw new Error(`Dependency ${key} not found`);
        return instance;
    }

    has(key: string): boolean {
        return this.bindings.has(key);
    }
}