import { createClient } from 'ip-sonar-js';

/**
 * Basic usage example of the IP-Sonar JS SDK
 */
async function basicExample() {
  // Create a client (API key is optional for testing)
  const client = createClient({
    // apiKey: 'your-api-key-here', // Uncomment and add your API key
    timeout: 5000, // 5 second timeout
  });

  try {
    console.log('🔍 Looking up your IP address...');
    
    // Look up your own IP
    const myIpInfo = await client.lookupMyIP({
      params: {
        fields: 'ip,country_code,country_name,city_name,timezone',
        locale_code: 'en'
      }
    });

    console.log('✅ Your IP information:');
    console.log(`   IP: ${myIpInfo.ip}`);
    console.log(`   Country: ${myIpInfo.country_name} (${myIpInfo.country_code})`);
    console.log(`   City: ${myIpInfo.city_name}`);
    console.log(`   Timezone: ${myIpInfo.timezone}`);

  } catch (error) {
    console.error('❌ Error looking up IP:', error);
  }

  try {
    console.log('\n🔍 Looking up Google DNS IP (8.8.8.8)...');
    
    // Look up a specific IP
    const googleDns = await client.lookupIP('8.8.8.8', {
      params: {
        fields: 'ip,country_name,city_name,latitude,longitude'
      }
    });

    console.log('✅ Google DNS IP information:');
    console.log(`   IP: ${googleDns.ip}`);
    console.log(`   Location: ${googleDns.city_name}, ${googleDns.country_name}`);
    console.log(`   Coordinates: ${googleDns.latitude}, ${googleDns.longitude}`);

  } catch (error) {
    console.error('❌ Error looking up Google DNS IP:', error);
  }

  try {
    console.log('\n🔍 Batch lookup of multiple IPs...');
    
    // Batch lookup multiple IPs
    const ips = ['8.8.8.8', '1.1.1.1', '208.67.222.222'];
    const batchResults = await client.batchLookup(ips, {
      params: {
        fields: 'ip,country_name,city_name'
      }
    });

    console.log('✅ Batch lookup results:');
    batchResults.data.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.ip}: ${result.city_name}, ${result.country_name}`);
    });

  } catch (error) {
    console.error('❌ Error in batch lookup:', error);
  }
}

// Run the example if this file is executed directly
if (typeof window === 'undefined') {
  basicExample().catch(console.error);
}

export { basicExample }; 
