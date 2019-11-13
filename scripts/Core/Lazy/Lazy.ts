export class Lazy<T> {
    private readonly factory: () => T; 
    private value: T | null;

    private constructor(factory: () => T) {
        this.factory = factory;
    }

    get Value(): T {
        return this.value || (this.value = this.factory()); 
    }

    get isCreated(): boolean {
        return !!this.value;
    }

    public static create<T>(factory: () => T) {
        return new Lazy<T>(factory);
    }
}