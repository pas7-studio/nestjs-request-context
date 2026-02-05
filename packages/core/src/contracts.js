/**
 * Core contracts and type definitions for request context management
 */
/**
 * Typed key for accessing store values without stringly-typed access
 * @template T - The type of value stored under this key
 */
export class ContextKey {
    name;
    // Type parameter T is used for type-safe access, not runtime
    _type;
    constructor(name) {
        this.name = name;
    }
}
//# sourceMappingURL=contracts.js.map