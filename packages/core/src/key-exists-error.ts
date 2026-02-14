/**
 * Thrown when attempting to set a key that already exists in the context
 * and the operation is not idempotent.
 */
export class KeyExistsError extends Error {
  public readonly key: string;

  constructor(key: string, message?: string) {
    super(message ?? `Key "${key}" already exists in context`);
    this.key = key;
    this.name = 'KeyExistsError';
    Object.setPrototypeOf(this, KeyExistsError.prototype);
  }
}
