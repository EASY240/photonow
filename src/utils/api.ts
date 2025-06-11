import { API_KEY } from '../constants';

export interface ProcessImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function processImage(endpoint: string, imageFile: File, userPrompt?: string): Promise<ProcessImageResult> {
  try {
    // Validate image
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('Image size must be less than 10MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Only JPG, PNG, and WebP images are supported');
    }
    
    // Determine the proxy base URL based on environment
    const PROXY_BASE_URL = import.meta.env.DEV 
      ? 'http://localhost:3001/api/lightx-proxy'
      : '/api/lightx-proxy';

    console.log('Using proxy URL:', PROXY_BASE_URL);
    console.log('Processing with endpoint:', endpoint);

    // Step 1: Get upload URL from LightXEditor via proxy
    console.log('Fetching upload URL...');
    const uploadResponse = await fetch(PROXY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/uploadImageUrl',
        body: {}
      })
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload URL fetch failed:', errorText);
      throw new Error(`Failed to get upload URL: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('Upload URL response:', uploadData);

    if (!uploadData.success || !uploadData.data?.uploadUrl) {
      throw new Error('Invalid upload URL response');
    }

    // Step 2: Upload image to S3 using the pre-signed URL
    console.log('Uploading image to S3...');
    const uploadResult = await fetch(uploadData.data.uploadUrl, {
      method: 'PUT',
      body: imageFile,
      headers: {
        'Content-Type': imageFile.type,
      },
    });

    if (!uploadResult.ok) {
      console.error('S3 upload failed:', uploadResult.status, uploadResult.statusText);
      throw new Error(`Failed to upload image: ${uploadResult.status}`);
    }

    console.log('Image uploaded successfully to S3');

    // Add a small delay to ensure the image is available
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Call the specific API endpoint
    console.log(`Calling ${endpoint} API...`);
    
    // Prepare the request body based on the endpoint
    let requestBody: any = {
      imageUrl: uploadData.data.imageUrl
    };

    // Add user prompt for endpoints that support it
    if (userPrompt && userPrompt.trim()) {
      // Endpoints that typically support text prompts
      const promptSupportedEndpoints = [
        'v1/cartoon', 'v1/caricature', 'v1/avatar', 'v1/image-generator',
        'v1/portrait', 'v1/image2image', 'v1/sketch-to-image', 'v1/background-generator',
        'v1/filter', 'v1/hairstyle', 'v1/hair-color'
      ];
      
      if (promptSupportedEndpoints.includes(endpoint)) {
        requestBody.textPrompt = userPrompt;
      }
    }

    // Special handling for specific endpoints
    if (endpoint === 'v1/expand-photo') {
      // Default padding values for expand photo
      requestBody.leftPadding = 50;
      requestBody.rightPadding = 50;
      requestBody.topPadding = 50;
      requestBody.bottomPadding = 50;
    }

    const processResponse = await fetch(PROXY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: endpoint,
        body: requestBody
      })
    });

    if (!processResponse.ok) {
      const errorText = await processResponse.text();
      console.error('Process API failed:', errorText);
      throw new Error(`Failed to process image: ${processResponse.status}`);
    }

    const processData = await processResponse.json();
    console.log('Process response:', processData);

    if (!processData.success || !processData.data?.orderId) {
      throw new Error('Invalid process response');
    }

    // Step 4: Poll for order status
    console.log('Polling for order status...');
    const orderId = processData.data.orderId;
    let attempts = 0;
    const maxAttempts = 30;
    let delay = 2000; // Start with 2 seconds

    // Determine status endpoint based on the processing endpoint
    const statusEndpoint = endpoint.startsWith('v1/') ? 'v1/order-status' : 'v2/order-status';

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        const statusResponse = await fetch(PROXY_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: statusEndpoint,
            body: {
              orderId: orderId
            }
          })
        });

        if (!statusResponse.ok) {
          console.error(`Status check failed (attempt ${attempts + 1}):`, statusResponse.status);
          attempts++;
          delay = Math.min(delay * 1.5, 10000); // Exponential backoff, max 10 seconds
          continue;
        }

        const statusData = await statusResponse.json();
        console.log(`Status check (attempt ${attempts + 1}):`, statusData);

        if (statusData.success && statusData.data) {
          const status = statusData.data.status;
          
          if (status === 'completed') {
            if (statusData.data.resultImageUrl) {
              return {
                success: true,
                imageUrl: statusData.data.resultImageUrl
              };
            } else {
              throw new Error('Processing completed but no result image URL provided');
            }
          } else if (status === 'failed') {
            throw new Error('Image processing failed');
          } else if (status === 'processing' || status === 'pending') {
            // Continue polling
            attempts++;
            delay = Math.min(delay * 1.2, 8000); // Gradual increase, max 8 seconds
            continue;
          } else {
            console.warn('Unknown status:', status);
            attempts++;
            delay = Math.min(delay * 1.5, 10000);
            continue;
          }
        } else {
          console.error('Invalid status response:', statusData);
          attempts++;
          delay = Math.min(delay * 1.5, 10000);
          continue;
        }
      } catch (error) {
        console.error(`Status check error (attempt ${attempts + 1}):`, error);
        attempts++;
        delay = Math.min(delay * 1.5, 10000);
        
        if (attempts >= maxAttempts) {
          throw new Error('Failed to get order status after multiple attempts');
        }
      }
    }

    throw new Error('Processing timeout - please try again');
  } catch (error) {
    console.error('Process image error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
