/**
 * Predefined context keys for common use cases
 */

import { ContextKey } from '@pas7/request-context-core';

/** Context key for request ID */
export const REQUEST_ID_KEY = new ContextKey<string>('requestId');

/** Context key for route path */
export const ROUTE_KEY = new ContextKey<string>('route');

/** Context key for HTTP method */
export const METHOD_KEY = new ContextKey<string>('method');

/** Context key for client IP address */
export const IP_KEY = new ContextKey<string>('ip');
