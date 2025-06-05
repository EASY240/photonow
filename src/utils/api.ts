import { API_KEY } from '../constants';

export async function processImage(toolApiEndpoint: string, imageFile: File): Promise<string> {
  try {
    // Validate image before processing
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (imageFile.size > maxFileSize) {
      throw new Error('Image file is too large. Please use an image smaller than 10MB.');
    }
    
    if (!supportedTypes.includes(imageFile.type.toLowerCase())) {
      throw new Error('Unsupported image format. Please use JPG, PNG, or WebP.');
    }
    
    console.log('Image validation passed:', {
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`,
      type: imageFile.type,
      name: imageFile.name
    });
    
    // Use the Netlify function URL in production, fallback to local proxy for development
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin // Use the current origin (https://modernphototools.netlify.app)
      : 'http://localhost:3001';
    
    console.log('Environment detection:', {
      hostname: window.location.hostname,
      origin: window.location.origin,
      isProduction,
      PROXY_BASE_URL
    });
    console.log('Starting image processing...');

    // Step 1: Get upload URL from LightXEditor via proxy
    const uploadUrlResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/uploadImageUrl',
        body: {
          uploadType: 'imageUrl',
          size: imageFile.size,
          contentType: imageFile.type,
        }
      }),
    });

    if (!uploadUrlResponse.ok) {
      const errorText = await uploadUrlResponse.text();
      throw new Error(`Failed to get upload URL: ${uploadUrlResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadUrlResponse.json();
    
    // Check if the response has the expected structure
    if (!uploadData.body || !uploadData.body.uploadImage || !uploadData.body.imageUrl) {
      throw new Error(`Invalid upload URL response: ${JSON.stringify(uploadData)}`);
    }

    const { uploadImage, imageUrl } = uploadData.body;

    // Step 2: Upload image directly to S3 using the pre-signed URL
    // Pre-signed URLs are designed to be used directly by clients
    const uploadImageResponse = await fetch(uploadImage, {
      method: 'PUT',
      headers: {
        'Content-Type': imageFile.type,
        'Content-Length': imageFile.size.toString(),
      },
      body: imageFile,
    });

    if (!uploadImageResponse.ok) {
      const errorText = await uploadImageResponse.text();
      throw new Error(`Failed to upload image: ${uploadImageResponse.status} - ${errorText}`);
    }

    // Step 3: Call remove-background API via the generic proxy endpoint (using v2 for consistency)
    // Using v2 to match the upload and status endpoints for API consistency
    const removeBackgroundResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/remove-background',
        body: {
          imageUrl: imageUrl,
          background: 'transparent' // background parameter is required
        }
      }),
    });

    if (!removeBackgroundResponse.ok) {
      const errorText = await removeBackgroundResponse.text();
      throw new Error(`Failed to remove background: ${removeBackgroundResponse.status} - ${errorText}`);
    }

    const backgroundRemovalData = await removeBackgroundResponse.json();
    
    if (!backgroundRemovalData.body || !backgroundRemovalData.body.orderId) {
      throw new Error(`Invalid remove background response: ${JSON.stringify(backgroundRemovalData)}`);
    }

    const { orderId } = backgroundRemovalData.body;

    // Step 4: Poll for order status using V2 endpoint with exponential backoff
    let resultUrl = '';
    let retries = 0;
    const maxRetries = 20; // Increased to allow more time for complex images
    const basePollInterval = 3000; // Start with 3 seconds

    while (!resultUrl && retries < maxRetries) {
      // Wait before polling (except for first attempt) with exponential backoff
      if (retries > 0) {
        const waitTime = Math.min(basePollInterval * Math.pow(1.5, retries - 1), 15000); // Cap at 15 seconds
        console.log(`Waiting ${waitTime}ms before retry ${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const orderStatusResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'v2/order-status',
          body: {
            orderId: orderId,
          }
        }),
      });

      if (!orderStatusResponse.ok) {
        const errorText = await orderStatusResponse.text();
        throw new Error(`Failed to get order status: ${orderStatusResponse.status} - ${errorText}`);
      }

      const orderStatus = await orderStatusResponse.json();
      
      console.log('Order status response:', JSON.stringify(orderStatus));
      
      // Check for API-level failure first (no body property)
      if (orderStatus.status === 'FAIL') {
        const errorMessage = orderStatus.message || 'Unknown error';
        const errorDescription = orderStatus.description || '';
        const statusCode = orderStatus.statusCode;
        
        // Provide more specific error messages based on status code
        let userFriendlyMessage = errorMessage;
        if (statusCode === 55044) {
          userFriendlyMessage = 'The image could not be processed. This may be due to complex background, image quality, or temporary service issues. Please try with a different image or try again later.';
        }
        
        console.error('LightX API Error:', { statusCode, errorMessage, errorDescription });
        throw new Error(`Image processing failed: ${userFriendlyMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }
      
      if (!orderStatus.body) {
        throw new Error(`Invalid order status response: ${JSON.stringify(orderStatus)}`);
      }

      // Check for successful status with output
      if (orderStatus.body.status === 'active' && orderStatus.body.output) {
        resultUrl = orderStatus.body.output;
        break;
      } 
      // Check for body-level failure condition
      else if (orderStatus.body.status === 'failed') {
        const errorMessage = orderStatus.body.message || 'Unknown error';
        const errorDescription = orderStatus.body.description || '';
        throw new Error(`Image processing failed: ${errorMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }
      // If status is 'init' or any other status, continue polling
      
      retries++;
    }

    if (!resultUrl) {
      throw new Error('Processing timeout: The image is taking longer than expected to process. This may be due to high server load or image complexity. Please try again later.');
    }
    
    console.log('Image processing completed successfully:', resultUrl);

    return resultUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}
