// netlify/functions/lightx-proxy.js

/**
 * Securely retrieves and validates environment variables at runtime
 * @param {string} key - Environment variable key
 * @param {boolean} required - Whether the variable is required
 * @returns {string|null} - The environment variable value or null if not found
 */
function getSecureEnvVar(key, required = true) {
  const value = process.env[key];
  
  if (!value || value.trim() === '') {
    if (required) {
      console.error(`Required environment variable ${key} is missing or empty`);
      return null;
    }
    console.warn(`Optional environment variable ${key} is not set`);
    return null;
  }
  
  // Basic validation for API key format (should be non-empty string)
  if (key.includes('API_KEY') && value.length < 10) {
    console.error(`Environment variable ${key} appears to be invalid (too short)`);
    return null;
  }
  
  return value.trim();
}

/**
 * Creates standardized error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} details - Optional error details
 * @returns {Object} - Netlify function response object
 */
function createErrorResponse(statusCode, message, details = null) {
  const response = {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify({ 
      error: message,
      ...(details && { details })
    })
  };
  
  // Log error for debugging (without sensitive info)
  console.error(`Error ${statusCode}: ${message}${details ? ` - ${details}` : ''}`);
  
  return response;
}

exports.handler = async function(event, context) {
  // Dynamic import for node-fetch ES module
  const { default: fetch } = await import('node-fetch');
  
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
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed');
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body', parseError.message);
    }
    
    const { endpoint, body } = requestBody;
    
    if (!endpoint) {
      return createErrorResponse(400, 'Missing endpoint parameter');
    }
    
    // Validate endpoint format
    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      return createErrorResponse(400, 'Invalid endpoint parameter');
    }
    
    // Construct the LightX API URL based on version
    // For v1 endpoints, the URL structure is different than v2
    let lightxUrl;
    if (endpoint.startsWith('v1/')) {
      // v1 endpoints use a different URL structure
      lightxUrl = `https://api.lightxeditor.com/external/api/${endpoint}`;
    } else {
      // v2 and other endpoints use the external/api path
      lightxUrl = `https://api.lightxeditor.com/external/api/${endpoint}`;
    }
    
    // Securely retrieve API key at runtime
    const apiKey = getSecureEnvVar('LIGHTX_API_KEY', true);
    
    if (!apiKey) {
      return createErrorResponse(500, 'API key not configured or invalid');
    }
    
    // Log request details (excluding sensitive info) - only in development
    const isDevelopment = getSecureEnvVar('NODE_ENV', false) !== 'production';
    if (isDevelopment) {
      console.log(`Making request to: ${lightxUrl}`);
      console.log(`Request body keys: ${Object.keys(body || {}).join(', ')}`);
      console.log(`API key present: Yes`);
    }
    
    // Validate request body if present
    if (body && typeof body !== 'object') {
      return createErrorResponse(400, 'Request body must be an object');
    }
    
    // Make the request to the LightX API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    try {
      response = await fetch(lightxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'User-Agent': 'ModernPhotoTools/1.0'
        },
        body: JSON.stringify(body || {}),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return createErrorResponse(408, 'Request timeout');
      }
      return createErrorResponse(502, 'Failed to connect to LightX API', fetchError.message);
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (isDevelopment) {
      console.log(`Response status: ${response.status}`);
      console.log(`Response status text: ${response.statusText}`);
    }

    // Get the response data
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      return createErrorResponse(502, 'Invalid JSON response from LightX API', jsonError.message);
    }
    
    // Return the response with proper headers
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Log full error details for debugging
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return createErrorResponse(500, 'Internal server error', error.message);
  }
};