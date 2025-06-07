// netlify/functions/lightx-proxy.js
exports.handler = async function(event, context) {
  // Dynamic import for node-fetch ES module
  const { default: fetch } = await import('node-fetch');
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { endpoint, body } = requestBody;
    
    if (!endpoint) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing endpoint parameter' })
      };
    }
    
    // Construct the LightX API URL based on version
    // For v1 endpoints, the URL structure is different than v2
    let lightxUrl;
    if (endpoint.startsWith('v1/')) {
      // v1 endpoints use a different URL structure
      lightxUrl = `https://api.lightxeditor.com/external/api/${Endpoint}`;
    } else {
      // v2 and other endpoints use the external/api path
      lightxUrl = `https://api.lightxeditor.com/external/api/${endpoint}`;
    }
    
    console.log(`Constructed URL: ${lightxUrl}`);
    
    // Use the API key from environment variables
    // IMPORTANT: You need to set this in your Netlify environment variables
    const apiKey = process.env.LIGHTX_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }
    
    // Log request details (excluding sensitive info)
    console.log(`Making request to: ${lightxUrl}`);
    console.log(`Request body: ${JSON.stringify(body)}`);
    console.log(`API key present: ${apiKey ? 'Yes' : 'No'}`);
    
    // Make the request to the LightX API
    const response = await fetch(lightxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim()
      },
      body: JSON.stringify(body)
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);
    console.log(`Response headers: ${JSON.stringify([...response.headers])}`);

    // Get the response data
    const data = await response.json();
    
    // Return the response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};