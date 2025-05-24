# IP-Sonar JS SDK

## Installation

```bash
npm install @ip-sonar/ip-sonar-js
```

## Example

```typescript
import {createClient} from '@ip-sonar/ip-sonar-js';

const client = new createClient();

// Look up your own IP
const myIpInfo = await client.lookupMyIP();
console.log(`Your location: ${myIpInfo.city_name}, ${myIpInfo.country_name}`);

// Look up a specific IP address
const ipInfo = await client.lookupIP('216.8.112.107');
console.log(`IP ${ipInfo.ip} is located in ${ipInfo.country_name}`);

// Batch lookup multiple IPs
const batchResults = await client.batchLookup(['215.8.112.107', '216.8.112.108']);
batchResults.data.forEach(result => {
    console.log(`${result.ip}: ${result.country_name}`);
});

```

Or use the SDK in a browser:

```html
<script type="module">
  import { createClient } from 'https://unpkg.com/@ip-sonar/ip-sonar-js/dist/index.esm.js';

  const client = createClient();

  client.lookupMyIP()
    .then(result => {
      console.log('My IP:', result.ip);
      console.log('Location:', result.city_name, result.country_name);
      console.log('Timezone:', result.timezone);
    })
    .catch(error => {
      console.error('Error looking up IP:', error);
    });
</script>
```

## Learn More

- [Documentation](https://docs.ip-sonar.com)
- [API Specification](https://api.ip-sonar.com/docs)
