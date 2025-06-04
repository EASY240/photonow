// netlify/functions/lightx-proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
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
    
    // Construct the LightX API URL
    const lightxUrl = `https://api.lightxeditor.com/external/api/${endpoint}`;
    
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
    
    // Make the request to the LightX API
    const response = await fetch(lightxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim()
      },
      body: JSON.stringify(body)
    });

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