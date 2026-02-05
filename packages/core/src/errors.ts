/**
 * Custom error classes for context management
 */

/**
 * Error thrown when trying to access context but no context is active
 */
export class ContextNotActiveError extends Error {
  constructor() {
    super('No active context. Use run() to create a context before accessing it.');
    this.name = 'ContextNotActiveError';
    Object.setPrototypeOf(this, ContextNotActiveError.prototype);
  }
}

/**
 * Error thrown when a key collision occurs with 'deny' policy
 */
export class ContextKeyCollisionError extends Error {
  constructor(key: string) {
    super(`Key "${key}" already exists in store and policy is set to 'deny'.`);
    this.name = 'ContextKeyCollisionError';
    Object.setPrototypeOf(this, ContextKeyCollisionError.prototype);
  }
}

/**
 * Error thrown when a required key is missing from the context
 */
export class ContextMissingError extends Error {
  constructor(key: string) {
    super(`Required key "${key}" is missing from the context.`);
    this.name = 'ContextMissingError';
    Object.setPrototypeOf(this, ContextMissingError.prototype);
  }
}
