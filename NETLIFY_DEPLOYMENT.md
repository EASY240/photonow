# Netlify Deployment Guide

This guide explains how to deploy the LightX API proxy function to Netlify.

## Prerequisites

1. A Netlify account
2. Netlify CLI installed (`npm install -g netlify-cli`)
3. Your LightX API key

## Deployment Steps

### 1. Set up Environment Variables

You need to set up your LightX API key as an environment variable in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add a new variable:
   - Key: `LIGHTX_API_KEY`
   - Value: `13fc2dd3a975430b93850487c527d817_90b2d76b36a3491aa0d429457da8e3eb_andoraitools`

### 2. Deploy to Netlify

You can deploy to Netlify using the Netlify CLI:

```bash
# Login to Netlify
npm install -g netlify-cli
netlify login

# Initialize your site (if not already done)
netlify init

# Deploy to Netlify
netlify deploy --prod
```

Alternatively, you can connect your GitHub repository to Netlify for automatic deployments.

### 3. Verify Function Deployment

After deployment, verify that your function is working:

1. Go to your Netlify site dashboard
2. Navigate to Functions
3. You should see `lightx-proxy` listed
4. Test the function by making a request to `https://your-netlify-site.netlify.app/api/lightx-proxy`

## Local Development

For local development, you can use the Netlify CLI to test your functions:

```bash
# Install dependencies in the functions directory
cd netlify/functions
npm install

# Start the Netlify dev server
cd ../..
netlify dev
```

This will start a local development server that simulates the Netlify environment, including your functions.

## Troubleshooting

### Function Not Found

If your function is not found, check:

1. The function file is in the correct location (`netlify/functions/lightx-proxy.js`)
2. The `netlify.toml` file has the correct redirects
3. The function has been deployed successfully

### 403 Forbidden Error

If you're getting a 403 Forbidden error from the LightX API:

1. Check that your API key is correctly set in the Netlify environment variables
2. Verify that your API key is valid and has not expired
3. Check the function logs in the Netlify dashboard for more details

### CORS Issues

If you're experiencing CORS issues:

1. Check that the function is returning the correct CORS headers
2. Verify that your frontend is making requests to the correct URL

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)