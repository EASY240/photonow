// src/constants/outfitStyles.ts

export interface OutfitStyle { 
  category: string;
  name: string; 
  prompt: string; 
}

export const presetOutfitStyles: OutfitStyle[] = [

  // Category: Wedding
  {
    category: 'Wedding',
    name: '2-Piece',
    prompt: 'A model wearing a modern and elegant 2-piece wedding outfit, professional studio photoshoot.'
  },
  {
    category: 'Wedding',
    name: 'Jacket',
    prompt: 'A model in a sophisticated wedding jacket, suitable for a chic and formal ceremony.'
  },
  {
    category: 'Wedding',
    name: 'A-Line',
    prompt: 'A model wearing a classic A-Line wedding gown, timeless and graceful, full-length view.'
  },
  {
    category: 'Wedding',
    name: '3 Piece Suit',
    prompt: 'A model looking dapper in a perfectly tailored 3-piece wedding suit, formal and sharp.'
  },
  {
    category: 'Wedding',
    name: 'Gown',
    prompt: 'A model in a breathtaking, floor-length wedding gown, romantic and elegant.'
  },
  {
    category: 'Wedding',
    name: 'Classic Suit',
    prompt: 'A model wearing a timeless classic suit for a wedding, sophisticated and elegant.'
  },

  // Category: Smart Casual
  {
    category: 'Smart Casual',
    name: 'Jacket',
    prompt: 'A model wearing a stylish jacket, embodying a perfect smart casual look for an urban setting.'
  },
  {
    category: 'Smart Casual',
    name: 'Jacket',
    prompt: 'A model in a fashionable smart casual jacket, effortlessly chic for a day out.'
  },
  {
    category: 'Smart Casual',
    name: 'Cardigan',
    prompt: 'A model looking cozy and stylish in a layered smart casual cardigan.'
  },
  {
    category: 'Smart Casual',
    name: 'Cardigan',
    prompt: 'A model in a comfortable knit cardigan, the essence of smart casual fashion.'
  },
  {
    category: 'Smart Casual',
    name: 'Blouse shirt',
    prompt: 'A model in an elegant blouse shirt, perfect for a smart casual office look or evening.'
  },
  {
    category: 'Smart Casual',
    name: 'Button-up',
    prompt: 'A model wearing a crisp button-up shirt, a versatile staple of smart casual style.'
  },

  // Category: Athleisure
  {
    category: 'Athleisure',
    name: 'Sports Bra',
    prompt: 'A model in a trendy and supportive sports bra, athleisure style, in a fitness studio.'
  },
  {
    category: 'Athleisure',
    name: 'Basketball',
    prompt: 'A model wearing basketball-inspired athleisure wear on an urban court, sporty and cool.'
  },
  {
    category: 'Athleisure',
    name: 'Hoodie',
    prompt: 'A model in a comfortable athleisure hoodie, perfect for a casual, sporty look.'
  },
  {
    category: 'Athleisure',
    name: 'Hoodie',
    prompt: 'A model showcasing a different style of athleisure hoodie, street style fashion.'
  },
  {
    category: 'Athleisure',
    name: 'Tank Top',
    prompt: 'A model in a breathable athleisure tank top, looking ready for a workout.'
  },
  {
    category: 'Athleisure',
    name: 'Polo',
    prompt: 'A model in a classic polo shirt, styled for a sophisticated athleisure look.'
  },

  // Category: Jackets (Inferred)
  {
    category: 'Jackets',
    name: 'Denim Jacket',
    prompt: 'A model in a timeless denim jacket, casual street style photoshoot.'
  },
  {
    category: 'Jackets',
    name: 'Denim Jacket',
    prompt: 'A model showcasing a fashionable denim jacket against an urban background.'
  },

  // Category: Sweaters (Inferred)
  {
    category: 'Sweaters',
    name: 'Sweater',
    prompt: 'A model wearing a cozy knit sweater, perfect for a warm and stylish autumn look.'
  },
  {
    category: 'Sweaters',
    name: 'Turtleneck',
    prompt: 'A model in a chic turtleneck sweater, exuding sophistication and warmth.'
  },

  // Category: Traditional (Inferred)
  {
    category: 'Traditional',
    name: 'Kebaya',
    prompt: 'A model wearing a beautiful, intricate traditional Kebaya blouse, celebrating cultural heritage.'
  },
  {
    category: 'Traditional',
    name: 'Highland',
    prompt: 'A model dressed in Scottish Highland attire, featuring traditional tartan patterns.'
  },

  // Category: Bohemian (Inferred)
  {
    category: 'Bohemian',
    name: 'Bohemian',
    prompt: 'A model with a free-spirited bohemian look, featuring flowing fabrics and earthy tones.'
  },
  {
    category: 'Bohemian',
    name: 'Funky',
    prompt: 'A model in a funky, eclectic outfit with bold colors and unique patterns, expressing individuality.'
  },
];

export const suggestedOutfitPrompts: string[] = [
  "Vibrant balloons", "Urban brick wall", "Lush garden scene", "Serene ocean view", 
  "Abstract painting", "Graffiti-covered wall", "Rustic barn", "City skyline", 
  "Enchanting forest landscape", "Majestic mountain range"
];