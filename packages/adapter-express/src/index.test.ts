/**
 * Tests for adapter-express package exports
 */

import { describe, it, expect } from 'vitest';
import {
  requestContextMiddleware,
  UseRequestContextExpress,
  DEFAULT_EXPRESS_OPTIONS,
} from './index.js';

describe('Express Adapter Package Exports', () => {
  it('should export requestContextMiddleware', () => {
    expect(requestContextMiddleware).toBeDefined();
    expect(typeof requestContextMiddleware).toBe('function');
  });

  it('should export UseRequestContextExpress', () => {
    expect(UseRequestContextExpress).toBeDefined();
    expect(typeof UseRequestContextExpress).toBe('function');
  });

  it('should export DEFAULT_EXPRESS_OPTIONS', () => {
    expect(DEFAULT_EXPRESS_OPTIONS).toBeDefined();
    expect(typeof DEFAULT_EXPRESS_OPTIONS).toBe('object');
    expect(DEFAULT_EXPRESS_OPTIONS.header).toBe('x-request-id');
    expect(DEFAULT_EXPRESS_OPTIONS.addResponseHeader).toBe(true);
    expect(typeof DEFAULT_EXPRESS_OPTIONS.idGenerator).toBe('function');
  });
});

