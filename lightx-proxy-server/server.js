// server.js
const express = require('express');
const cors = require('cors');
// Use node-fetch v2 syntax for CommonJS
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://modernphototools.netlify.app', 'http://localhost:5173'], // Your Vite dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
  preflightContinue: false,
}));
app.use(express.json());

// Generic LightX API proxy endpoint (similar to serverless function approach)
app.post('/api/lightx-proxy', async (req, res) => {
  try {
    const { endpoint, body } = req.body;
    console.log('Proxy request received: ', { endpoint, body });

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }
    
    const lightxUrl = `https://api.lightxeditor.com/external/api/${endpoint}`;
    
    console.log(`Proxying to: ${lightxUrl}`);
    console.log(`Request body:`, JSON.stringify(body, null, 2));
    
    // Use the full API key
    const apiKey = process.env.LIGHTX_API_KEY.trim();

    if (!apiKey) {
      console.error('LIGHTX_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log(`Using API key (masked): ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'User-Agent': 'PhotoNow-Proxy/1.0'
    };

    console.log('Request headers:', { ...headers, 'x-api-key': '[MASKED]' });

    const response = await fetch(lightxUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return res.status(500).json({ 
        error: 'Invalid JSON response from LightX API', 
        details: responseText.substring(0, 500) 
      });
    }
    
    console.log('Parsed response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('LightX API Error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
});

// Keep the original endpoints for backward compatibility
app.post('/api/lightx/v1/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const lightxUrl = `https://api.lightxeditor.com/external/api/v1/${endpoint}`;
    
    console.log(`Proxying to: ${lightxUrl}`);
    console.log(`Request body:`, JSON.stringify(req.body));
    
    // Use the full API key without splitting it
    const apiKey = process.env.LIGHTX_API_KEY.trim();
    
    console.log(`Using full API key (masked): ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);
    console.log(`Request URL: ${lightxUrl}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    console.log(`Request method: POST`);
    console.log(`Content-Type: application/json`);
    
    // Try with different header combinations
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    
    console.log('Request headers:', headers);
    
    const response = await fetch(lightxUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data));
    
    if (!response.ok) {
      console.error('LightX API Error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
});

app.post('/api/lightx/v2/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const lightxUrl = `https://api.lightxeditor.com/external/api/v2/${endpoint}`;
    
    console.log(`Proxying to: ${lightxUrl}`);
    console.log(`Request body:`, JSON.stringify(req.body));
    
    // Log the API key (without revealing the full key for security)
    const apiKey = process.env.LIGHTX_API_KEY;
    console.log(`Using API key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);
    
    // Try with different header combinations
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
    };
    
    console.log('Request headers:', headers);
    
    const response = await fetch(lightxUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data));
    
    if (!response.ok) {
      console.error('LightX API Error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
});

// Special handler for image uploads (PUT requests to S3)
app.put('/api/upload-proxy', async (req, res) => {
  try {
    const { uploadUrl } = req.query;
    
    if (!uploadUrl) {
      return res.status(400).json({ error: 'Upload URL is required' });
    }

    // Forward the request to S3
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': req.headers['content-type'],
        'Content-Length': req.headers['content-length'],
      },
      body: req.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('S3 Upload Error:', errorText);
      return res.status(response.status).json({ error: 'Upload failed', details: errorText });
    }

    res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Upload Proxy Error:', error);
    res.status(500).json({ error: 'Upload proxy error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
