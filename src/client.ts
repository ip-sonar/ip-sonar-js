import { HttpClient } from './http';
import type {
  IPSonarConfig,
  LookupIPResponse,
  BatchLookupIPResponse,
  BatchLookupRequest,
  RequestOptions,
  LookupParams,
} from './types';

/**
 * IP-Sonar SDK Client
 * 
 * Provides methods for interacting with the IP-Sonar geolocation API
 */
export class IPSonarClient {
  private readonly http: HttpClient;
  private readonly defaultParams: LookupParams | undefined;

  /**
   * Creates a new IP-Sonar client instance
   * 
   * @param config Configuration options for the client
   */
  constructor(config: IPSonarConfig = {}) {
    const {
      apiKey,
      baseUrl = 'https://api.ip-sonar.com',
      defaultParams,
      timeout = 10000,
    } = config;

    this.http = new HttpClient(baseUrl, apiKey, timeout);
    this.defaultParams = defaultParams;
  }

  /**
   * Looks up geolocation information for the client's IP address
   * 
   * @param options Request options
   * @returns Promise resolving to IP geolocation data
   * 
   * @example
   * ```typescript
   * const client = new IPSonarClient({ apiKey: 'your-api-key' });
   * const myIpInfo = await client.lookupMyIP();
   * console.log(myIpInfo.country_name); // e.g., "United States"
   * ```
   */
  async lookupMyIP(options: RequestOptions = {}): Promise<LookupIPResponse> {
    const params = this.mergeParams(options.params);
    
    return this.http.get<LookupIPResponse>(
      '/v1/myip',
      params,
      options.timeout
    );
  }

  /**
   * Looks up geolocation information for a specific IP address
   * 
   * @param ip The IP address to look up
   * @param options Request options
   * @returns Promise resolving to IP geolocation data
   * 
   * @example
   * ```typescript
   * const client = new IPSonarClient({ apiKey: 'your-api-key' });
   * const ipInfo = await client.lookupIP('8.8.8.8');
   * console.log(ipInfo.city_name); // e.g., "Mountain View"
   * ```
   */
  async lookupIP(ip: string, options: RequestOptions = {}): Promise<LookupIPResponse> {
    if (!ip || typeof ip !== 'string') {
      throw new Error('IP address is required and must be a string');
    }

    const params = this.mergeParams(options.params);
    
    return this.http.get<LookupIPResponse>(
      `/v1/${encodeURIComponent(ip)}`,
      params,
      options.timeout
    );
  }

  /**
   * Looks up geolocation information for multiple IP addresses in a single request
   * 
   * @param ips Array of IP addresses to look up (1-100 items)
   * @param options Request options
   * @returns Promise resolving to batch IP geolocation data
   * 
   * @example
   * ```typescript
   * const client = new IPSonarClient({ apiKey: 'your-api-key' });
   * const results = await client.batchLookup(['8.8.8.8', '1.1.1.1']);
   * results.data.forEach(result => {
   *   console.log(`${result.ip}: ${result.country_name}`);
   * });
   * ```
   */
  async batchLookup(ips: string[], options: RequestOptions = {}): Promise<BatchLookupIPResponse> {
    if (!Array.isArray(ips) || ips.length === 0) {
      throw new Error('IPs array is required and must not be empty');
    }

    if (ips.length > 100) {
      throw new Error('Maximum of 100 IP addresses allowed per batch request');
    }

    // Validate IP addresses are strings
    ips.forEach((ip, index) => {
      if (!ip || typeof ip !== 'string') {
        throw new Error(`IP at index ${index} must be a non-empty string`);
      }
    });

    const requestBody: BatchLookupRequest = { data: ips };
    const params = this.mergeParams(options.params);
    
    return this.http.post<BatchLookupIPResponse>(
      '/v1/batch',
      requestBody,
      params,
      options.timeout
    );
  }

  /**
   * Merges default parameters with request-specific parameters
   */
  private mergeParams(requestParams?: LookupParams): LookupParams | undefined {
    if (!this.defaultParams && !requestParams) {
      return undefined;
    }

    return {
      ...this.defaultParams,
      ...requestParams,
    };
  }
}

/**
 * Creates a new IP-Sonar client instance
 * 
 * @param config Configuration options for the client
 * @returns New IPSonarClient instance
 * 
 * @example
 * ```typescript
 * import { createClient } from 'ip-sonar-js';
 * 
 * const client = createClient({
 *   apiKey: 'your-api-key',
 *   defaultParams: { locale_code: 'en' }
 * });
 * ```
 */
export function createClient(config?: IPSonarConfig): IPSonarClient {
  return new IPSonarClient(config);
} 