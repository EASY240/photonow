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
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721888196773.jpg'
  },
  {
    gender: 'male',
    name: 'Handsome Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890586882.jpg'
  },
  {
    gender: 'male',
    name: 'Young Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890586740.jpg'
  },
  {
    gender: 'male',
    name: 'Professional Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721817393935.jpg'
  },
  {
    gender: 'male',
    name: 'Mature Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721891374496.jpg'
  },
  {
    gender: 'male',
    name: 'Athletic Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721820555898.jpg'
  },
  {
    gender: 'male',
    name: 'Casual Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721820557168.jpg'
  },
  {
    gender: 'male',
    name: 'Stylish Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721821925211.jpg'
  },
  {
    gender: 'male',
    name: 'Confident Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721821925057.jpg'
  },
  {
    gender: 'male',
    name: 'Distinguished Male',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721886397288.jpg'
  },

  // --- Female Faces ---
  {
    gender: 'female',
    name: 'Classic Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571754.jpg'
  },
  {
    gender: 'female',
    name: 'Beautiful Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571591.jpg'
  },
  {
    gender: 'female',
    name: 'Elegant Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571422.jpg'
  },
  {
    gender: 'female',
    name: 'Young Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571273.jpg'
  },
  {
    gender: 'female',
    name: 'Stylish Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571131.jpg'
  },
  {
    gender: 'female',
    name: 'Modern Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570976.jpg'
  },
  {
    gender: 'female',
    name: 'Professional Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570828.jpg'
  },
  {
    gender: 'female',
    name: 'Sophisticated Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570665.jpg'
  },
  {
    gender: 'female',
    name: 'Confident Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570497.jpg'
  },
  {
    gender: 'female',
    name: 'Glamorous Female',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570350.jpg'
  }
];