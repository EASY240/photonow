// src/utils/api.ts

import { getSiteOrigin } from './siteConfig';

// Debug utility to control console output
const DEBUG_MODE = import.meta.env.DEV || (
  typeof window !== "undefined" && 
  typeof window.localStorage !== "undefined" && 
  window.localStorage.getItem('debug') === 'true'
);

const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// Helper function to safely determine environment and base URL for SSR compatibility
function getEnvironmentConfig() {
  const baseUrl = getSiteOrigin();
  const isProduction = typeof window !== 'undefined' 
    ? (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    : (import.meta.env.PROD || process.env.NODE_ENV === 'production');
    
  return {
    isProduction,
    baseUrl
  };
}

// Add this helper function inside src/utils/api.ts
export async function convertUrlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const blob = await response.blob();
  return blob;
}

export async function fetchOptimizedPrompt(basePrompt: string, framework: string) {
  try {
    const { baseUrl } = getEnvironmentConfig();
    const reqId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2));
    debugLog('optimize-prompt:client:request', { reqId, baseUrl, payloadLen: basePrompt.length, framework });
    const res = await fetch(`${baseUrl}/api/optimize-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': reqId, 'X-Debug': DEBUG_MODE ? '1' : '0' },
      body: JSON.stringify({ basePrompt, framework })
    });
    const contentType = res.headers.get('content-type') || '';
    let payload: any = {};
    if (contentType.includes('application/json')) {
      payload = await res.json();
    } else {
      const text = await res.text();
      payload = { success: false, error: text };
    }
    debugLog('optimize-prompt:client:response', { reqId, ok: res.ok, status: res.status, hasData: !!(payload && payload.data), keys: payload && payload.data && typeof payload.data === 'object' ? Object.keys(payload.data).length : 0, meta: payload && payload.meta });
    if (!res.ok) {
      const message = (payload && payload.error) ? payload.error : `HTTP ${res.status}`;
      return { success: false, error: message, data: {} };
    }
    return payload;
  } catch (err: any) {
    debugLog('optimize-prompt:client:error', { message: err?.message });
    return { success: false, error: err?.message || 'Request failed', data: {} };
  }
}

// AI Cleanup V2 API Functions
export async function uploadImageAndGetUrl(file: File): Promise<string> {
  try {
    // Use the Netlify function URL in production, fallback to local proxy for development
    const { baseUrl } = getEnvironmentConfig();

    // Step 1: Get upload URL
    const uploadUrlResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
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

    // Clean the returned URL by removing any potential backticks, spaces, and other unwanted characters
    const cleanImageUrl = imageUrl.trim().replace(/[\`\s'"]/g, '');
    
    return cleanImageUrl;
  } catch (error) {
    debugLog('Error uploading image:', error);
    throw error;
  }
}

export async function startCleanupJob({ originalImageUrl, maskedImageUrl }: { originalImageUrl: string; maskedImageUrl: string }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/cleanup-picture', // NOTE: Endpoint is v2 for job submission as per some docs, changed from v2
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

// Watermark Remover job – implemented via the same cleanup endpoint
// This keeps the API surface explicit while leveraging existing backend behavior.
export async function startWatermarkRemoverJob({ imageUrl }: { imageUrl: string }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/watermark-remover',
        body: {
          imageUrl: imageUrl,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start watermark remover job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid watermark remover job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting watermark remover job:', error);
    throw error;
  }
}

// Dedicated status poller for Watermark Remover (API v2) per tool documentation
export async function pollWatermarkJobUntilComplete(orderId: string): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    let resultUrl = '';
    let retries = 0;
    const maxRetries = 5; // per DOC: maxRetriesAllowed = 5
    const pollIntervalMs = 3000; // per DOC: poll every 3 seconds

    while (!resultUrl && retries < maxRetries) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }

      const orderStatusResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
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

      if (orderStatus.status === 'FAIL') {
        const errorMessage = orderStatus.message || 'Unknown error';
        const errorDescription = orderStatus.description || '';
        const statusCode = orderStatus.statusCode;
        console.error('LightX API Error:', { statusCode, errorMessage, errorDescription });
        throw new Error(`Image processing failed: ${errorMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }

      if (!orderStatus.body) {
        throw new Error(`Invalid order status response: ${JSON.stringify(orderStatus)}`);
      }

      if (orderStatus.body.status === 'active' && orderStatus.body.output) {
        resultUrl = orderStatus.body.output;
        break;
      } else if (orderStatus.body.status === 'failed') {
        const errorMessage = orderStatus.body.message || 'Unknown error';
        const errorDescription = orderStatus.body.description || '';
        throw new Error(`Image processing failed: ${errorMessage}${errorDescription ? ` - ${errorDescription}` : ''}`);
      } else {
        // status could be 'init' per DOC; continue polling
      }

      retries++;
    }

    if (!resultUrl) {
      throw new Error('Processing timeout: The image is taking longer than expected to process. Please try again later.');
    }

    debugLog('Watermark removal completed successfully:', resultUrl);
    return resultUrl;
  } catch (error) {
    console.error('Error polling watermark job status:', error);
    throw error;
  }
}

export async function checkOrderStatus(orderId: string): Promise<any> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/order-status', // NOTE: Using v2 for status check, consistent with remove-bg
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
    const { baseUrl } = getEnvironmentConfig();

    let resultUrl = '';
    let retries = 0;
    const maxRetries = 20;
    const basePollInterval = 3000;

    while (!resultUrl && retries < maxRetries) {
      if (retries > 0) {
        const waitTime = Math.min(basePollInterval * Math.pow(1.5, retries - 1), 15000);
        debugLog(`Waiting ${waitTime}ms before retry ${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const orderStatusResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
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
    
    debugLog('Image processing completed successfully:', resultUrl);
    return resultUrl;
  } catch (error) {
    console.error('Error polling job status:', error);
    throw error;
  }
}

export async function pollV1JobUntilComplete(orderId: string): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();
    let resultUrl = '';
    let retries = 0;
    const maxRetries = 5;
    const pollIntervalMs = 3000;
    while (!resultUrl && retries < maxRetries) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }
      const orderStatusResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'v1/order-status',
          body: { orderId },
        }),
      });
      if (!orderStatusResponse.ok) {
        const errorText = await orderStatusResponse.text();
        throw new Error(`Failed to get order status: ${orderStatusResponse.status} - ${errorText}`);
      }
      const orderStatus = await orderStatusResponse.json();
      if (!orderStatus.body) {
        throw new Error(`Invalid order status response: ${JSON.stringify(orderStatus)}`);
      }
      if (orderStatus.body.status === 'active' && orderStatus.body.output) {
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
      throw new Error('Processing timeout: The image is taking longer than expected to process. Please try again later.');
    }
    return resultUrl;
  } catch (error) {
    console.error('Error polling v1 job status:', error);
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
    
    debugLog('Image validation passed:', {
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`,
      type: imageFile.type,
      name: imageFile.name
    });
    
    // Use the Netlify function URL in production, fallback to local proxy for development
    const { isProduction, baseUrl } = getEnvironmentConfig();
    
    debugLog('Environment detection:', {
      isProduction,
      baseUrl
    });
    debugLog('Starting image processing...');

    // Step 1: Get upload URL from LightXEditor via proxy
    const uploadUrlResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
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
    debugLog('Upload successful, imageUrl: ', imageUrl);

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

    debugLog('S3 upload successful, waiting for image to be available...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    // Step 3: Call remove-background API with retry logic
    let removeBackgroundResponse;
    let backgroundRemovalData;
    let bgRetries = 0;
    const maxBgRetries = 3;

    while (bgRetries < maxBgRetries) {
      try {
        removeBackgroundResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: 'v2/remove-background',
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
        
        debugLog(`Remove background attempt ${bgRetries} failed, retrying in 2 seconds...`);
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
        debugLog(`Waiting ${waitTime}ms before retry ${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const orderStatusResponse = await fetch(`${baseUrl}/api/lightx-proxy`, {
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
    
    debugLog('Image processing completed successfully:', resultUrl);

    return resultUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// AI Expand Photo function
export async function startExpandJob({ imageUrl, padding }: { imageUrl: string; padding: { top: number; left: number; bottom: number; right: number; } }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/expand-photo', // The correct endpoint for this tool
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
    const { baseUrl } = getEnvironmentConfig();

    // DEFINE THE REQUEST BODY SEPARATELY
    const requestPayload = {
      endpoint: 'v2/replace',
      body: {
        imageUrl: originalImageUrl,
        maskedImageUrl: maskedImageUrl,
        textPrompt: prompt,
      }
    };

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/product-photoshoot', // The correct endpoint for this tool
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl || "",
          textPrompt: textPrompt || ""
        }
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/cartoon',
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl || "",
          textPrompt: textPrompt || ""
        }
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/caricature',
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl || "",
          textPrompt: textPrompt || ""
        }
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/avatar',
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl || "",
          textPrompt: textPrompt || ""
        }
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/background-generator',
        body: {
          imageUrl: imageUrl,
          textPrompt: textPrompt
        }
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
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/text2image',
        body: {
          textPrompt: textPrompt,
          width: width,
          height: height
        }
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

export async function startPortraitJob({ imageUrl, styleImageUrl, textPrompt }: { imageUrl: string; styleImageUrl?: string; textPrompt?: string; }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/portrait',
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl || "",
          textPrompt: textPrompt || ""
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start portrait job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid portrait job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting portrait job:', error);
    throw error;
  }
}

export async function startFaceSwapJob({ imageUrl, styleImageUrl }: { imageUrl: string; styleImageUrl: string; }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/face-swap',
        body: {
          imageUrl: imageUrl,
          styleImageUrl: styleImageUrl,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start face swap job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid face swap job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting face swap job:', error);
    throw error;
  }
}

export async function startOutfitJob({ imageUrl, textPrompt }: { imageUrl: string; textPrompt: string; }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'v2/outfit',
        body: {
          imageUrl: imageUrl,
          textPrompt: textPrompt,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start outfit job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid outfit job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting outfit job:', error);
    throw error;
  }
}

interface ImageToImageParams {
  imageUrl: string;
  textPrompt: string;
  styleImageUrl?: string;
  strength?: number;
  styleStrength?: number;
}

export async function startImageToImageJob(params: ImageToImageParams): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'v1/image2image',
        body: {
          imageUrl: params.imageUrl,
          strength: params.strength ?? 0.5,
          textPrompt: params.textPrompt,
          ...(params.styleImageUrl && { styleImageUrl: params.styleImageUrl }),
          ...(params.styleStrength !== undefined && { styleStrength: params.styleStrength }),
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start image-to-image job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid image-to-image job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting image-to-image job:', error);
    throw error;
  }
}

interface SketchToImageParams {
  imageUrl: string; // The user's sketch, either drawn or uploaded
  textPrompt: string;
  strength?: number;
  styleImageUrl?: string;
  styleStrength?: number;
}

export async function startSketchToImageJob(params: SketchToImageParams): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'v2/sketch2image', // The correct endpoint for this tool
        body: params
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start sketch-to-image job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid sketch-to-image job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting sketch-to-image job:', error);
    throw error;
  }
}

export async function startHairstyleJob({ imageUrl, textPrompt }: { imageUrl: string; textPrompt: string; }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'v2/hairstyle', // The correct endpoint for this tool
        body: {
          imageUrl: imageUrl,
          textPrompt: textPrompt,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start hairstyle job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid hairstyle job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting hairstyle job:', error);
    throw error;
  }
}

export async function startUpscaleJob({ imageUrl, quality }: { imageUrl: string; quality: 2 | 4; }): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'v2/upscale', // IMPORTANT: This is a v2 endpoint
        body: {
          imageUrl: imageUrl,
          quality: quality,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start upscale job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid upscale job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting upscale job:', error);
    throw error;
  }
}

interface AIFilterParams {
  imageUrl: string;
  styleImageUrl?: string;
  textPrompt: string;
}

export async function startAIFilterJob(params: AIFilterParams): Promise<string> {
  try {
    const { baseUrl } = getEnvironmentConfig();

    const response = await fetch(`${baseUrl}/api/lightx-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'v2/aifilter', // The correct endpoint for AI Filter
        body: {
          imageUrl: params.imageUrl,
          filterReferenceUrl: params.styleImageUrl || "",
          textPrompt: params.textPrompt,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start AI filter job: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.body || !data.body.orderId) {
      throw new Error(`Invalid AI filter job response: ${JSON.stringify(data)}`);
    }

    return data.body.orderId;
  } catch (error) {
    console.error('Error starting AI filter job:', error);
    throw error;
  }
}
