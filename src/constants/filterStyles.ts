export interface AIFilterStyle {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export const aiFilterStyles: AIFilterStyle[] = [
  // Ghibli Category
  {
    id: 'ghibli-1',
    name: 'Inari',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/97040181-69e1-440d-9c44-45944dd8b8cd.jpg',
    prompt: 'A character portrait in the whimsical Ghibli art style, reminiscent of Inari shrines, detailed and enchanting.'
  },
  {
    id: 'ghibli-2',
    name: 'Shade',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/5d3e262d-c4f0-45f6-a350-47552640cf03.png',
    prompt: 'A character portrait in the Ghibli art style, with dramatic shading and a mysterious atmosphere.'
  },
  {
    id: 'ghibli-3',
    name: 'Zenya',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/962a4918-202c-4a71-a27e-953807d1fd5c.jpg',
    prompt: 'A serene character portrait in the Ghibli art style, peaceful and elegant, with a Zen-like quality.'
  },
  {
    id: 'ghibli-4',
    name: 'Storm',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/f80b85ab-ea22-40d0-9e91-3793b24d605c.jpg',
    prompt: 'A dynamic character portrait in the Ghibli art style, set during a dramatic storm, emotional and powerful.'
  },
  {
    id: 'ghibli-5',
    name: 'Noon',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/b7497ed5-0d04-4334-9ca7-ec842cd4cdbb.jpg',
    prompt: 'A bright, sunlit character portrait in the Ghibli art style, capturing the warmth of noon.'
  },
  {
    id: 'ghibli-6',
    name: 'Luma',
    category: 'Ghibli',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/dc63ecdf-c3f3-458a-ac3b-64c37a0b5a1e.jpg',
    prompt: 'A luminous character portrait in the Ghibli art style, with a soft, glowing light.'
  },

  // Accessories Category
  {
    id: 'accessories-1',
    name: 'Floral Crown',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1735294968955.jpg',
    prompt: 'A portrait of a person wearing a beautiful and delicate Floral Crown, bohemian and ethereal style.'
  },
  {
    id: 'accessories-2',
    name: 'Scarf',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1735294969683.jpg',
    prompt: 'A portrait of a person wearing a stylish Scarf, adding a touch of elegance or coziness.'
  },
  {
    id: 'accessories-3',
    name: 'Beanie',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1735294967692.jpg',
    prompt: 'A portrait of a person wearing a cozy Beanie, casual and cool street style.'
  },
  {
    id: 'accessories-4',
    name: 'Bandana',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1735294966391.jpg',
    prompt: 'A portrait of a person wearing a cool Bandana, with a retro or edgy vibe.'
  },
  {
    id: 'accessories-5',
    name: 'Necklace',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1735294969331.jpg',
    prompt: 'A close-up portrait focusing on a person wearing an elegant Necklace.'
  },
  {
    id: 'accessories-6',
    name: 'Baseball Cap',
    category: 'Accessories',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1735294967301.jpg',
    prompt: 'A portrait of a person wearing a sporty Baseball Cap, casual and relaxed.'
  },

  // Anime Category
  {
    id: 'anime-1',
    name: 'Gintocki',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531622371.jpg',
    prompt: 'A person transformed into the anime character Gintoki Sakata, with silver hair and samurai attire.'
  },
  {
    id: 'anime-2',
    name: 'H X H',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531620868.jpg',
    prompt: 'A person in the distinct art style of the anime Hunter x Hunter.'
  },
  {
    id: 'anime-3',
    name: 'Saitaama',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531619290.jpg',
    prompt: 'A person transformed into the anime character Saitama from One-Punch Man, bald and wearing his hero suit.'
  },
  {
    id: 'anime-4',
    name: 'Erren',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531617759.jpg',
    prompt: 'A person transformed into the anime character Eren Yeager from Attack on Titan, with intense eyes.'
  },
  {
    id: 'anime-5',
    name: 'Leloch',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531616067.jpg',
    prompt: 'A person transformed into the anime character Lelouch Lamperouge from Code Geass, with his Geass eye.'
  },
  {
    id: 'anime-6',
    name: 'Light',
    category: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_filter/thumb/1716531614532.jpg',
    prompt: 'A person transformed into the anime character Light Yagami from Death Note, with a cunning expression.'
  },

  // Vintage Category
  {
    id: 'vintage-1',
    name: '1990s',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/0d3d215d0cf645769449223588572076',
    prompt: 'A portrait in the style of the 1990s, with grunge or pop fashion and a film grain look.'
  },
  {
    id: 'vintage-2',
    name: 'Victorian',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/1a415a7a51bb436c841068395131c43e',
    prompt: 'An elegant portrait in the Victorian era style, with elaborate clothing and a formal setting.'
  },
  {
    id: 'vintage-3',
    name: '1980s',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/9fe8f49883e548f88cf1364c52036685',
    prompt: 'A portrait with a vibrant 1980s aesthetic, big hair, neon colors, and retro vibes.'
  },
  {
    id: 'vintage-4',
    name: '1950s',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/f99d72dbe94c498fb060d466a66b43f7',
    prompt: 'A classic portrait in the style of the 1950s, with pin-up or rockabilly fashion.'
  },
  {
    id: 'vintage-5',
    name: '1920s',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/ab593ec4339f439195d1a139e7a967ad',
    prompt: 'A glamorous portrait in the style of the Roaring 1920s, with flapper dresses and art deco elements.'
  },
  {
    id: 'vintage-6',
    name: '1990s',
    category: 'Vintage',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/d47960ae2f8a4116aaebe364430cfa0d',
    prompt: 'A portrait with a distinct 1990s vibe, featuring baggy clothes and a cool, casual attitude.'
  },

  // Lights Category
  {
    id: 'lights-1',
    name: 'Sunset',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/964ca646-31ad-4e72-9768-5dd1ea831880.jpg',
    prompt: 'A portrait with beautiful sunset lighting, warm golden hour glow, dramatic colors.'
  },
  {
    id: 'lights-2',
    name: 'Laser',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/f9a577ed-e548-4e61-a66d-352f023b35c1.jpg',
    prompt: 'A futuristic portrait with dramatic laser light effects, vibrant and energetic.'
  },
  {
    id: 'lights-3',
    name: 'Fireworks',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/f0a43cd7-6541-4f75-bed7-972b9e0820e7.jpg',
    prompt: 'A celebratory portrait with a background of exploding fireworks, bright and colorful.'
  },
  {
    id: 'lights-4',
    name: 'Northern',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/4fc40ddf-2df9-4063-bce3-1c675b614a3a.jpg',
    prompt: 'A magical portrait with the Northern Lights (Aurora Borealis) in the sky.'
  },
  {
    id: 'lights-5',
    name: 'Bokeh',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/6574b9b8-188d-40c9-9835-6369f42403e5.jpg',
    prompt: 'A portrait with a beautiful bokeh effect, soft, out-of-focus lights in the background.'
  },
  {
    id: 'lights-6',
    name: 'Cinematic',
    category: 'Lights',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/b08cd6bc-d8cc-4d33-a47f-57eb57dd3b6b.jpg',
    prompt: 'A portrait with dramatic cinematic lighting, high contrast and moody atmosphere.'
  },
];

export const filterCategories = ['Ghibli', 'Accessories', 'Anime', 'Vintage', 'Lights'];