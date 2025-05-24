/**
 * Continent codes used in IP geolocation
 */
export type ContinentCode = 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA';

/**
 * Language codes supported for geolocation names
 */
export type LocaleCode = 'de' | 'en' | 'es' | 'fr' | 'ja' | 'pt-br' | 'ru' | 'zh-cn';

/**
 * IP Geolocation information
 */
export interface IPGeolocation {
  /** IP address */
  ip?: string;
  
  /** Latitude coordinate */
  latitude?: number;
  
  /** Longitude coordinate */
  longitude?: number;
  
  /** Postal/ZIP code */
  postal_code?: string;
  
  /** 
   * The geographic radius, measured in kilometers, within which 
   * the IP address is expected to be located 
   */
  accuracy_radius?: number;
  
  /** 
   * Continent code
   * AF - Africa, AN - Antarctica, AS - Asia, EU - Europe,
   * NA - North America, OC - Oceania, SA - South America
   */
  continent_code?: ContinentCode;
  
  /** Continent name */
  continent_name?: string;
  
  /** ISO 3166-1 country code (2 characters) */
  country_code?: string;
  
  /** Country name */
  country_name?: string;
  
  /** ISO 3166-2 region code for first subdivision (1-3 characters) */
  subdivision_1_code?: string;
  
  /** Name of first subdivision (state/province) */
  subdivision_1_name?: string;
  
  /** ISO 3166-2 region code for second subdivision */
  subdivision_2_code?: string;
  
  /** Name of second subdivision */
  subdivision_2_name?: string;
  
  /** City name */
  city_name?: string;
  
  /** IANA Timezone (e.g., "America/New_York") */
  timezone?: string;
  
  /** Whether the IP address's country belongs to the European Union */
  is_in_eu?: boolean;
}

/**
 * Request body for batch IP lookup
 */
export interface BatchLookupRequest {
  /** Array of IP addresses (1-100 items) */
  data: string[];
}

/**
 * Response for single IP lookup
 */
export type LookupIPResponse = IPGeolocation

/**
 * Response for batch IP lookup
 */
export interface BatchLookupIPResponse {
  /** Array of IP geolocation data */
  data: IPGeolocation[];
}

/**
 * Query parameters for lookup requests
 */
export interface LookupParams {
  /** 
   * Comma-separated list of fields to include in response
   * @example "continent_name,country_code,city_name,timezone"
   */
  fields?: string;
  
  /** 
   * Language code for geolocation names
   * @example "en"
   */
  locale_code?: LocaleCode;
}

/**
 * Configuration options for the IP Sonar client
 */
export interface IPSonarConfig {
  /** API key for authentication (optional) */
  apiKey?: string;
  
  /** Base URL for the API (defaults to https://api.ip-sonar.com) */
  baseUrl?: string;
  
  /** Default parameters to include in all requests */
  defaultParams?: LookupParams;
  
  /** Request timeout in milliseconds (defaults to 10000) */
  timeout?: number;
}

/**
 * Error message response from the API
 */
export interface ErrorMessageResponse {
  /** Error message */
  message: string;
}

/**
 * HTTP error response from the API
 */
export interface APIError extends Error {
  /** HTTP status code */
  status?: number;
  
  /** Response body */
  body?: unknown;
  
  /** Structured error message from API */
  apiMessage?: string;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /** Override default parameters for this request */
  params?: LookupParams;
  
  /** Override timeout for this request */
  timeout?: number;
}
