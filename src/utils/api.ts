import { API_KEY } from '../constants';

export async function processImage(apiEndpoint: string, imageFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        // Don't set Content-Type header when using FormData, browser will set it with boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API error: ${response.status}`);
    }
    
    const data = await response.blob();
    return URL.createObjectURL(data);
    
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}