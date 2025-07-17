export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  apiEndpoint: string;
}

export interface ImageFile {
  file: File | null;
  preview: string | null;
}

export interface ProcessedImage {
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FaceSwapStyle {
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'any';
}