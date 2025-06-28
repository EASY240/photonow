// src/constants/avatarStyles.ts

export interface AvatarStyle {
  name: string;
  imageUrl: string;
  gender: 'male' | 'female';
  prompt: string;
}

export const avatarStyles: AvatarStyle[] = [
  // Male Styles
  {
    name: 'Business Professional',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/a8ff8c9a-13ec-4fe2-9a06-72c9570872d9.jpg',
    gender: 'male',
    prompt: 'A professional business avatar with a confident expression, wearing a suit'
  },
  {
    name: 'Superhero',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/dd04d470-fa29-4039-b1e8-8e22dc965d96.jpg',
    gender: 'male',
    prompt: 'A heroic superhero avatar with a strong, determined expression'
  },
  {
    name: 'Doctor',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/bbd0f925-171d-4184-b457-01466c2cb84c.jpg',
    gender: 'male',
    prompt: 'A professional medical doctor avatar with a caring, trustworthy expression'
  },
  {
    name: 'Engineer',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/5bee0616-5f9e-4958-8978-b379a8028717.jpg',
    gender: 'male',
    prompt: 'A skilled engineer avatar with an intelligent, focused expression'
  },
  {
    name: 'Firefighter',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/44696ea2-49ae-477c-a654-b6647ad52bfc.jpg',
    gender: 'male',
    prompt: 'A brave firefighter avatar with a heroic, protective expression'
  },
  {
    name: 'Chef',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/baf9d0fe-cb2a-48ca-a442-8df670142841.jpg',
    gender: 'male',
    prompt: 'A skilled chef avatar with a passionate, creative expression'
  },
  {
    name: 'Architect',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/d61d8442-4d37-40fa-a416-1d31f76b950d.jpg',
    gender: 'male',
    prompt: 'A creative architect avatar with a visionary, artistic expression'
  },
  {
    name: 'Athlete',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/d03852f6-081d-49af-85da-709add60982d.jpg',
    gender: 'male',
    prompt: 'A strong athlete avatar with a determined, competitive expression'
  },
  
  // Female Styles
  {
    name: 'Business Professional',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/ff03468d-2a81-4a7b-b1a1-243eab68c3f0.jpg',
    gender: 'female',
    prompt: 'A professional business avatar with a confident, elegant expression'
  },
  {
    name: 'Wonder Woman',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/f984a6af-689d-4cee-a087-139740d1533d.jpg',
    gender: 'female',
    prompt: 'A powerful Wonder Woman avatar with a heroic, inspiring expression'
  },
  {
    name: 'Nurse',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/fbec18f3-7348-4402-a105-023da24cf27c.jpg',
    gender: 'female',
    prompt: 'A caring nurse avatar with a compassionate, professional expression'
  },
  {
    name: 'Superwoman',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/70d86058-dbab-451e-a938-d69ff32af14f.jpg',
    gender: 'female',
    prompt: 'A powerful superwoman avatar with a strong, confident expression'
  },
  {
    name: 'Air Hostess',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/fc2eb43c-2d66-4461-a79d-d9fe850c0f10.jpg',
    gender: 'female',
    prompt: 'A professional air hostess avatar with a friendly, welcoming expression'
  },
  {
    name: 'Ballet Dancer',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/3c75bc92-f9d5-48f4-9219-fb980d5ad42e.jpg',
    gender: 'female',
    prompt: 'An elegant ballet dancer avatar with a graceful, artistic expression'
  },
  {
    name: 'Politician',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/7a12a146-a906-490b-8801-2cf7f3f565a5.jpg',
    gender: 'female',
    prompt: 'A confident politician avatar with a charismatic, leadership expression'
  },
  {
    name: 'Rockstar',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/0d756d9c-0d36-41a4-a7b4-d7718f8a8406.jpg',
    gender: 'female',
    prompt: 'A cool rockstar avatar with an edgy, rebellious expression'
  }
];