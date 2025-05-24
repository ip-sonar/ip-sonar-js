# IP-Sonar JS SDK

## Installation

```bash
npm install ip-sonar-js
```

## Quick Start

```typescript
import { IPSonarClient } from 'ip-sonar-js';

const client = new IPSonarClient({
  apiKey: 'your-api-key', // Optional
});

// Look up your own IP
const myIpInfo = await client.lookupMyIP();
console.log(`Your location: ${myIpInfo.city_name}, ${myIpInfo.country_name}`);

// Look up a specific IP address
const ipInfo = await client.lookupIP('8.8.8.8');
console.log(`IP ${ipInfo.ip} is located in ${ipInfo.country_name}`);

// Batch lookup multiple IPs
const batchResults = await client.batchLookup(['8.8.8.8', '1.1.1.1']);
batchResults.data.forEach(result => {
  console.log(`${result.ip}: ${result.country_name}`);
});
```

## API Reference

### Creating a Client

#### Using the constructor

```typescript
import { IPSonarClient } from 'ip-sonar-js';

const client = new IPSonarClient({
  apiKey: 'your-api-key',              // Optional API key
  baseUrl: 'https://api.ip-sonar.com', // Custom base URL
  timeout: 10000,                      // Request timeout in ms
  defaultParams: {                     // Default parameters for all requests
    locale_code: 'en',
    fields: 'ip,country_name,city_name'
  }
});
```

#### Using the factory function

```typescript
import { createClient } from 'ip-sonar-js';

const client = createClient({
  apiKey: 'your-api-key'
});
```

### Methods

#### `lookupMyIP(options?)`

Looks up geolocation information for the client's IP address.

```typescript
const result = await client.lookupMyIP({
  params: {
    fields: 'ip,country_code,city_name',
    locale_code: 'en'
  },
  timeout: 5000
});
```

#### `lookupIP(ip, options?)`

Looks up geolocation information for a specific IP address.

```typescript
const result = await client.lookupIP('203.0.113.1', {
  params: {
    fields: 'ip,country_name,timezone'
  }
});
```

#### `batchLookup(ips, options?)`

Looks up geolocation information for multiple IP addresses (1-100 IPs per request).

```typescript
const results = await client.batchLookup([
  '8.8.8.8', 
  '1.1.1.1', 
  '208.67.222.222'
], {
  params: {
    locale_code: 'es'
  }
});

// results.data is an array of IPGeolocation objects
```

### Field Selection

You can specify which fields to include in the response using the `fields` parameter:

```typescript
const result = await client.lookupIP('8.8.8.8', {
  params: {
    fields: 'ip,country_code,country_name,city_name,timezone'
  }
});

// Only the specified fields will be included in the response
```

### Localization

The API supports multiple languages for location names:

```typescript
const result = await client.lookupIP('8.8.8.8', {
  params: {
    locale_code: 'es' // Spanish
  }
});

// Location names will be returned in Spanish
```

Supported locale codes: `de`, `en`, `es`, `fr`, `ja`, `pt-br`, `ru`, `zh-cn`

### Error Handling

The SDK provides structured error handling:

```typescript
import type { APIError } from 'ip-sonar-js';

try {
  const result = await client.lookupIP('invalid-ip');
} catch (error) {
  if (error instanceof Error) {
    const apiError = error as APIError;
    
    console.log('Error message:', apiError.message);
    console.log('HTTP status:', apiError.status);
    console.log('Response body:', apiError.body);
    console.log('API error message:', apiError.apiMessage);
  }
}
```

Common error scenarios:
- Invalid IP address format (HTTP 400)
- Unauthorized access - invalid API key (HTTP 401)
- Resource not found (HTTP 404)
- Rate limiting exceeded (HTTP 429)
- Internal server errors (HTTP 500)
- Network connectivity issues
- Request timeout

The SDK automatically extracts structured error messages from the API response when available.

### Default Parameters

You can set default parameters that will be applied to all requests:

```typescript
const client = new IPSonarClient({
  apiKey: 'your-api-key',
  defaultParams: {
    locale_code: 'en',
    fields: 'ip,country_code,country_name,city_name'
  }
});

// All requests will include these parameters by default
// Individual request parameters will override defaults
```

## Examples

### Basic IP Lookup

```typescript
import { createClient } from 'ip-sonar-js';

const client = createClient();

async function lookupIP() {
  try {
    const result = await client.lookupIP('134.195.196.26');
    
    console.log('IP:', result.ip);
    console.log('Country:', result.country_name);
    console.log('City:', result.city_name);
    console.log('Timezone:', result.timezone);
  } catch (error) {
    console.error('Lookup failed:', error);
  }
}

lookupIP();
```

### Bulk IP Analysis

```typescript
import { createClient } from 'ip-sonar-js';

const client = createClient({ apiKey: 'your-api-key' });

async function analyzeTraffic(ipAddresses: string[]) {
  const results = await client.batchLookup(ipAddresses);
  
  // Group by country
  const byCountry = results.data.reduce((acc, item) => {
    const country = item.country_name || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('Traffic by country:', byCountry);
  
  // Find EU traffic
  const euTraffic = results.data.filter(item => item.is_in_eu);
  console.log('EU traffic:', euTraffic.length);
}

analyzeTraffic(['8.8.8.8', '1.1.1.1', '134.195.196.26']);
```

### Location-based Content

```typescript
import { createClient } from 'ip-sonar-js';

const client = createClient();

async function getLocalizedContent() {
  const location = await client.lookupMyIP();
  
  // Customize content based on location
  const currency = location.country_code === 'US' ? 'USD' : 'EUR';
  const language = location.country_code === 'ES' ? 'es' : 'en';
  
  console.log(`Detected location: ${location.country_name}`);
  console.log(`Using currency: ${currency}, language: ${language}`);
}

getLocalizedContent();
```

## Browser Usage

The SDK works in browsers:

```html
<!DOCTYPE html>
<html>
<head>
  <title>IP Lookup Demo</title>
</head>
<body>
  <script type="module">
    import { createClient } from 'https://unpkg.com/ip-sonar-js/dist/index.esm.js';
    
    const client = createClient();
    
    client.lookupMyIP().then(result => {
      document.body.innerHTML = `
        <h1>Your IP: ${result.ip}</h1>
        <p>Location: ${result.city_name}, ${result.country_name}</p>
        <p>Timezone: ${result.timezone}</p>
      `;
    });
  </script>
</body>
</html>
```
