/**
 * IP-Sonar JS SDK - Modern TypeScript SDK for IP geolocation
 * 
 * @example
 * ```typescript
 * import { IPSonarClient, createClient } from 'ip-sonar-js';
 * 
 * // Using the class directly
 * const client = new IPSonarClient({ apiKey: 'your-api-key' });
 * 
 * // Using the factory function
 * const client = createClient({ apiKey: 'your-api-key' });
 * 
 * // Look up your own IP
 * const myIpInfo = await client.lookupMyIP();
 * 
 * // Look up a specific IP
 * const ipInfo = await client.lookupIP('8.8.8.8');
 * 
 * // Batch lookup multiple IPs
 * const batchResults = await client.batchLookup(['8.8.8.8', '1.1.1.1']);
 * ```
 */

// Re-export the main client class and factory function
export { IPSonarClient, createClient } from './client';

// Re-export version information
export { SDK_VERSION, USER_AGENT } from './version';

// Re-export all types for TypeScript users
export type {
  IPGeolocation,
  BatchLookupRequest,
  BatchLookupIPResponse,
  LookupIPResponse,
  LookupParams,
  IPSonarConfig,
  RequestOptions,
  APIError,
  ErrorMessageResponse,
  ContinentCode,
  LocaleCode,
} from './types';

// Default export for convenience
export { createClient as default } from './client'; 