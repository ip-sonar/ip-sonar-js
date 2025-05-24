/**
 * SDK version information
 */

// This will be replaced during the build process with the actual version from package.json
export const SDK_VERSION = __SDK_VERSION__ as string;

/**
 * User-Agent string for HTTP requests
 */
export const USER_AGENT = `ip-sonar-js/${SDK_VERSION}`; 