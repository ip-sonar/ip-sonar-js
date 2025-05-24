import type { APIError, LookupParams, ErrorMessageResponse } from './types';

/**
 * Creates an APIError with additional context
 */
function createAPIError(message: string, status?: number, body?: unknown, apiMessage?: string): APIError {
  const error = new Error(message) as APIError;
  if (status !== undefined) {
    error.status = status;
  }
  error.body = body;
  if (apiMessage) {
    error.apiMessage = apiMessage;
  }
  return error;
}

/**
 * Builds query string from parameters
 */
function buildQueryString(params: LookupParams = {}): string {
  const searchParams = new URLSearchParams();
  
  if (params.fields !== undefined) {
    searchParams.append('fields', params.fields);
  }
  
  if (params.locale_code !== undefined) {
    searchParams.append('locale_code', params.locale_code);
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * HTTP client for making API requests
 */
export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
    private readonly defaultTimeout: number = 10000
  ) {}

  /**
   * Makes a GET request to the specified endpoint
   */
  async get<T>(
    endpoint: string,
    params?: LookupParams,
    timeout?: number
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${buildQueryString(params)}`;
    
    return this.request<T>(url, {
      method: 'GET',
      timeout: timeout ?? this.defaultTimeout,
    });
  }

  /**
   * Makes a POST request to the specified endpoint
   */
  async post<T>(
    endpoint: string,
    body: unknown,
    params?: LookupParams,
    timeout?: number
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${buildQueryString(params || {})}`;
    
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      timeout: timeout || this.defaultTimeout,
    });
  }

  /**
   * Makes an HTTP request with proper error handling
   */
  private async request<T>(url: string, options: RequestInit & { timeout?: number }): Promise<T> {
    const { timeout, ...fetchOptions } = options;
    
    // Set up headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'ip-sonar-js/1.0.0',
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // Add API key if provided
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    // Set up abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout || this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        let errorBody: unknown;
        let apiMessage: string | undefined;
        
        try {
          errorBody = await response.json();
          // Try to extract the API error message if it follows the ErrorMessageResponse schema
          if (errorBody && typeof errorBody === 'object' && 'message' in errorBody) {
            const errorResponse = errorBody as ErrorMessageResponse;
            apiMessage = errorResponse.message;
          }
        } catch {
          try {
            errorBody = await response.text();
          } catch {
            errorBody = null;
          }
        }

        // Use API message if available, otherwise use HTTP status text
        const errorMessage = apiMessage || `HTTP ${response.status}: ${response.statusText}`;
        
        throw createAPIError(
          errorMessage,
          response.status,
          errorBody,
          apiMessage
        );
      }

      // Parse JSON response
      try {
        return await response.json() as T;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        throw createAPIError('Failed to parse response as JSON', response.status);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw createAPIError('Network error: Failed to connect to API');
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw createAPIError('Request timeout');
      }
      
      // Re-throw API errors as-is
      if ((error as APIError).status !== undefined) {
        throw error;
      }
      
      // Wrap other errors
      throw createAPIError(`Request failed: ${(error as Error).message}`);
    }
  }
}
