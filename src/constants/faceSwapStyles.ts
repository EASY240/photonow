// src/constants/faceSwapStyles.ts

export interface FaceSwapStyle {
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'any';
}

export const faceSwapStyles: FaceSwapStyle[] = [
  // --- Male Faces ---
  {
    gender: 'male',
    name: 'Classic Male',
    imageUrl: '/images/presets/ai-face-swap/Classic Male.webp'
  },
  {
    gender: 'male',
    name: 'Handsome Male',
    imageUrl: '/images/presets/ai-face-swap/Handsome Male.webp'
  },
  {
    gender: 'male',
    name: 'Young Male',
    imageUrl: '/images/presets/ai-face-swap/Young Male.webp'
  },
  {
    gender: 'male',
    name: 'Professional Male',
    imageUrl: '/images/presets/ai-face-swap/Professional Male.webp'
  },
  {
    gender: 'male',
    name: 'Mature Male',
    imageUrl: '/images/presets/ai-face-swap/Mature Male.webp'
  },
  {
    gender: 'male',
    name: 'Athletic Male',
    imageUrl: '/images/presets/ai-face-swap/Athletic Male.webp'
  },
  {
    gender: 'male',
    name: 'Casual Male',
    imageUrl: '/images/presets/ai-face-swap/Casual Male.webp'
  },
  {
    gender: 'male',
    name: 'Stylish Male',
    imageUrl: '/images/presets/ai-face-swap/Stylish Male.webp'
  },
  {
    gender: 'male',
    name: 'Confident Male',
    imageUrl: '/images/presets/ai-face-swap/Confident Male.webp'
  },
  {
    gender: 'male',
    name: 'Distinguished Male',
    imageUrl: '/images/presets/ai-face-swap/Distinguished Male.webp'
  },

  // --- Female Faces ---
  {
    gender: 'female',
    name: 'Classic Female',
    imageUrl: '/images/presets/ai-face-swap/Classic Female.webp'
  },
  {
    gender: 'female',
    name: 'Beautiful Female',
    imageUrl: '/images/presets/ai-face-swap/Beautiful Female.webp'
  },
  {
    gender: 'female',
    name: 'Elegant Female',
    imageUrl: '/images/presets/ai-face-swap/Elegant Female.webp'
  },
  {
    gender: 'female',
    name: 'Young Female',
    imageUrl: '/images/presets/ai-face-swap/Young Female.webp'
  },
  {
    gender: 'female',
    name: 'Stylish Female',
    imageUrl: '/images/presets/ai-face-swap/Stylish Female.webp'
  },
  {
    gender: 'female',
    name: 'Modern Female',
    imageUrl: '/images/presets/ai-face-swap/Modern Female.webp'
  },
  {
    gender: 'female',
    name: 'Professional Female',
    imageUrl: '/images/presets/ai-face-swap/Professional Female.webp'
  },
  {
    gender: 'female',
    name: 'Sophisticated Female',
    imageUrl: '/images/presets/ai-face-swap/Sophisticated Female.webp'
  },
  {
    gender: 'female',
    name: 'Confident Female',
    imageUrl: '/images/presets/ai-face-swap/Confident Female.webp'
  },
  {
    gender: 'female',
    name: 'Glamorous Female',
    imageUrl: '/images/presets/ai-face-swap/Glamorous Female.webp'
  }
];