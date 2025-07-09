// src/utils/api.ts

// Add this helper function inside src/utils/api.ts
export async function convertUrlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const blob = await response.blob();
  return blob;
}

// AI Cleanup V2 API Functions
export async function uploadImageAndGetUrl(file: File): Promise<string> {
  try {
    // Use the Netlify function URL in production, fallback to local proxy for development
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // Step 1: Get upload URL
    const uploadUrlResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/uploadImageUrl',
        body: {
          uploadType: 'imageUrl', // <--- THIS IS THE CORRECTED LINE
          size: file.size,
          contentType: file.type,
        }
      }),
    });

    if (!uploadUrlResponse.ok) {
      const errorText = await uploadUrlResponse.text();
      throw new Error(`Failed to get upload URL: ${uploadUrlResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadUrlResponse.json();
    
    if (!uploadData.body || !uploadData.body.uploadImage || !uploadData.body.imageUrl) {
      throw new Error(`Invalid upload URL response: ${JSON.stringify(uploadData)}`);
    }

    const { uploadImage, imageUrl } = uploadData.body;

    // Step 2: Upload image to the presigned URL
    const uploadImageResponse = await fetch(uploadImage, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadImageResponse.ok) {
      const errorText = await uploadImageResponse.text();
      throw new Error(`Failed to upload image: ${uploadImageResponse.status} - ${errorText}`);
    }

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function startCleanupJob({ originalImageUrl, maskedImageUrl }: { originalImageUrl: string; maskedImageUrl: string }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/cleanup-picture', // NOTE: Endpoint is v1 for job submission as per some docs, changed from v2
        body: {
          imageUrl: originalImageUrl,
          maskedImageUrl: maskedImageUrl,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start cleanup job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid cleanup job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting cleanup job:', error);
    throw error;
  }
}

export async function checkOrderStatus(orderId: string): Promise<any> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/order-status', // NOTE: Using v1 for status check, consistent with remove-bg
        body: {
          orderId: orderId,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to check order status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw error;
  }
}

export async function pollJobUntilComplete(orderId: string): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    let resultUrl = '';
    let retries = 0;
    const maxRetries = 20;
    const basePollInterval = 3000;

    while (!resultUrl && retries < maxRetries) {
      if (retries > 0) {
        const waitTime = Math.min(basePollInterval * Math.pow(1.5, retries - 1), 15000);
        console.log(`Waiting ${waitTime}ms before retry ${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const orderStatusResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'v1/order-status',
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
      
      if (orderStatus.status === 'FAIL') {
        const errorMessage = orderStatus.message || 'Unknown error';
        const errorDescription = orderStatus.description || '';
        const statusCode = orderStatus.statusCode;
        
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

      console.log('Checking exit condition:', {
        status: orderStatus.body.status,
        output: orderStatus.body.output,
        statusCheck: orderStatus.body.status === 'active',
        outputCheck: !!orderStatus.body.output,
        bothConditions: orderStatus.body.status === 'active' && orderStatus.body.output
      });

      if (orderStatus.body.status === 'active' && orderStatus.body.output) {
        console.log('Exit condition met! Setting resultUrl and breaking...');
        resultUrl = orderStatus.body.output;
        break;
      } else if (orderStatus.body.status === 'failed') {
        const errorMessage = orderStatus.body.message || 'Unknown error';
        const errorDescription = orderStatus.body.description || '';
        throw new Error(`Image processing failed: ${errorMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }
      
      retries++;
    }

    if (!resultUrl) {
      throw new Error('Processing timeout: The image is taking longer than expected to process. This may be due to high server load or image complexity. Please try again later.');
    }
    
    console.log('Image processing completed successfully:', resultUrl);
    return resultUrl;
  } catch (error) {
    console.error('Error polling job status:', error);
    throw error;
  }
}

// NOTE: Keeping the processImage function for other tools as-is
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
    
    if (!uploadData.body || !uploadData.body.uploadImage || !uploadData.body.imageUrl) {
      throw new Error(`Invalid upload URL response: ${JSON.stringify(uploadData)}`);
    }

    const { uploadImage, imageUrl } = uploadData.body;
    console.log('Upload successful, imageUrl: ', imageUrl);

    // Step 2: Upload image directly to S3 using the pre-signed URL
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

    console.log('S3 upload successful, waiting for image to be available...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    // Step 3: Call remove-background API with retry logic
    let removeBackgroundResponse;
    let backgroundRemovalData;
    let bgRetries = 0;
    const maxBgRetries = 3;

    while (bgRetries < maxBgRetries) {
      try {
        removeBackgroundResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: 'v1/remove-background',
            body: {
              imageUrl: imageUrl,
            }
          }),
        });

        if (!removeBackgroundResponse.ok) {
          const errorText = await removeBackgroundResponse.text();
          throw new Error(`Failed to remove background: ${removeBackgroundResponse.status} - ${errorText}`);
        }

        backgroundRemovalData = await removeBackgroundResponse.json();
        break;
        
      } catch (error) {
        bgRetries++;
        if (bgRetries >= maxBgRetries) {
          throw error;
        }
        
        console.log(`Remove background attempt ${bgRetries} failed, retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!backgroundRemovalData || !backgroundRemovalData.body || !backgroundRemovalData.body.orderId) {
      throw new Error(`Invalid remove background response: ${JSON.stringify(backgroundRemovalData)}`);
    }

    const { orderId } = backgroundRemovalData.body;

    // Step 4: Poll for order status using V2 endpoint with exponential backoff
    let resultUrl = '';
    let retries = 0;
    const maxRetries = 20;
    const basePollInterval = 3000;

    while (!resultUrl && retries < maxRetries) {
      if (retries > 0) {
        const waitTime = Math.min(basePollInterval * Math.pow(1.5, retries - 1), 15000);
        console.log(`Waiting ${waitTime}ms before retry ${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const orderStatusResponse = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'v1/order-status',
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
      
      if (orderStatus.status === 'FAIL') {
        const errorMessage = orderStatus.message || 'Unknown error';
        const errorDescription = orderStatus.description || '';
        const statusCode = orderStatus.statusCode;
        
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

      if (orderStatus.body.status === 'active' && orderStatus.body.output) {
        resultUrl = orderStatus.body.output;
        break;
      } 
      else if (orderStatus.body.status === 'failed') {
        const errorMessage = orderStatus.body.message || 'Unknown error';
        const errorDescription = orderStatus.body.description || '';
        throw new Error(`Image processing failed: ${errorMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }
      
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

// AI Expand Photo function
export async function startExpandJob({ imageUrl, padding }: { imageUrl: string; padding: { top: number; left: number; bottom: number; right: number; } }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/expand-photo', // The correct endpoint for this tool
        body: {
          imageUrl: imageUrl,
          topPadding: padding.top,
          leftPadding: padding.left,
          bottomPadding: padding.bottom,
          rightPadding: padding.right,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start expand job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid expand job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting expand job:', error);
    throw error;
  }
}

// AI Replace function
export async function startReplaceJob({ originalImageUrl, maskedImageUrl, prompt }: { originalImageUrl: string; maskedImageUrl: string; prompt: string; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // DEFINE THE REQUEST BODY SEPARATELY
    const requestPayload = {
      endpoint: 'v1/replace',
      body: {
        imageUrl: originalImageUrl,
        maskedImageUrl: maskedImageUrl,
        textPrompt: prompt,
      }
    };
    
    // ADD THIS NEW DEBUGGING LINE
    console.log('Final payload being sent to proxy:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // USE THE VARIABLE HERE
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start replace job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid replace job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting replace job:', error);
    throw error;
  }
}

export async function startProductPhotoshootJob({ imageUrl, styleImageUrl, textPrompt }: { imageUrl: string; styleImageUrl?: string; textPrompt?: string; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // Create the job body, ensuring all keys are present, defaulting to "" if undefined.
    // This is our proven robust pattern.
    const jobBody = {
        imageUrl: imageUrl,
        styleImageUrl: styleImageUrl || "",
        textPrompt: textPrompt || ""
    };

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/product-photoshoot', // The correct endpoint for this tool
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start product photoshoot job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid product photoshoot job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting product photoshoot job:', error);
    throw error;
  }
}

export async function startCartoonJob({ imageUrl, styleImageUrl, textPrompt }: { imageUrl: string; styleImageUrl?: string; textPrompt?: string; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // Create the job body object with only imageUrl initially
    const jobBody: any = {
        imageUrl: imageUrl
    };
    
    // CRITICAL: LightX API constraint - cannot send both styleImageUrl and textPrompt together
    // Priority: styleImageUrl takes precedence over textPrompt
    if (styleImageUrl && styleImageUrl.trim() !== '') {
        jobBody.styleImageUrl = styleImageUrl;
        // Do NOT include textPrompt when styleImageUrl is present
        console.log('Using styleImageUrl, skipping textPrompt due to API constraint');
    }

    if (textPrompt && textPrompt.trim() !== '') {
        jobBody.textPrompt = textPrompt;
        console.log('Using textPrompt (no styleImageUrl provided)');
    }

    console.log('DEBUGGING (Final Attempt): Payload being sent:', JSON.stringify({ endpoint: 'v1/cartoon', body: jobBody }, null, 2));

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/cartoon',
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start cartoon job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid cartoon job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting cartoon job:', error);
    throw error;
  }
}

export async function startCaricatureJob({ imageUrl, styleImageUrl, textPrompt }: { imageUrl: string; styleImageUrl?: string; textPrompt?: string; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // Create the job body with only imageUrl initially
    const jobBody: any = {
        imageUrl: imageUrl
    };
    
    // Apply the same constraint for caricature API
    if (styleImageUrl && styleImageUrl.trim() !== '') {
        jobBody.styleImageUrl = styleImageUrl;
        console.log('Using styleImageUrl, skipping textPrompt due to API constraint');
    } 
    if (textPrompt && textPrompt.trim() !== '') {
        jobBody.textPrompt = textPrompt;
        console.log('Using textPrompt (no styleImageUrl provided)');
    }

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/caricature',
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start caricature job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
     
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid caricature job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting caricature job:', error);
    throw error;
  }
}

export async function startAvatarJob({ imageUrl, styleImageUrl, textPrompt }: { imageUrl: string; styleImageUrl?: string; textPrompt?: string; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    // Create the job body with only imageUrl initially
    const jobBody: any = {
        imageUrl: imageUrl
    };
    
    // Apply the same constraint for avatar API
    if (styleImageUrl && styleImageUrl.trim() !== '') {
        jobBody.styleImageUrl = styleImageUrl;
        console.log('Using styleImageUrl, skipping textPrompt due to API constraint');
    }
    if (textPrompt && textPrompt.trim() !== '') {
        jobBody.textPrompt = textPrompt;
        console.log('Using textPrompt (no styleImageUrl provided)');
    }

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/avatar',
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start avatar job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid avatar job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting avatar job:', error);
    throw error;
  }
}

export async function startBackgroundGeneratorJob({ imageUrl, textPrompt }: { imageUrl: string; textPrompt: string }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    const jobBody = {
      imageUrl: imageUrl,
      textPrompt: textPrompt
    };

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/background-generator',
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start background generator job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid background generator job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting background generator job:', error);
    throw error;
  }
}

export async function startImageGeneratorJob({ textPrompt, width, height }: { textPrompt: string; width?: number; height?: number; }): Promise<string> {
  try {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const PROXY_BASE_URL = isProduction 
      ? window.location.origin
      : 'http://localhost:3001';

    const jobBody: any = {
      textPrompt: textPrompt
    };
    
    // Ensure resolution parameters are included
    if (width && height) {
      jobBody.width = width;
      jobBody.height = height;
      console.log(`Setting image resolution: ${width}x${height}`);
    }

    console.log('Image Generator Job Body:', jobBody);

    const response = await fetch(`${PROXY_BASE_URL}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v1/text2image',
        body: jobBody
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start image generator job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid image generator job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting image generator job:', error);
    throw error;
  }
}