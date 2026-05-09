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
    imageUrl: '/images/presets/ai-filter/Inari.webp',
    prompt: 'A character portrait in the whimsical Ghibli art style, reminiscent of Inari shrines, detailed and enchanting.'
  },
  {
    id: 'ghibli-2',
    name: 'Shade',
    category: 'Ghibli',
    imageUrl: '/images/presets/ai-filter/Shade.webp',
    prompt: 'A character portrait in the Ghibli art style, with dramatic shading and a mysterious atmosphere.'
  },
  {
    id: 'ghibli-3',
    name: 'Zenya',
    category: 'Ghibli',
    imageUrl: '/images/presets/ai-filter/Zenya.webp',
    prompt: 'A serene character portrait in the Ghibli art style, peaceful and elegant, with a Zen-like quality.'
  },
  {
    id: 'ghibli-4',
    name: 'Storm',
    category: 'Ghibli',
    imageUrl: '/images/presets/ai-filter/Storm.webp',
    prompt: 'A dynamic character portrait in the Ghibli art style, set during a dramatic storm, emotional and powerful.'
  },
  {
    id: 'ghibli-5',
    name: 'Noon',
    category: 'Ghibli',
    imageUrl: '/images/presets/ai-filter/Noon.webp',
    prompt: 'A bright, sunlit character portrait in the Ghibli art style, capturing the warmth of noon.'
  },
  {
    id: 'ghibli-6',
    name: 'Luma',
    category: 'Ghibli',
    imageUrl: '/images/presets/ai-filter/Luma.webp',
    prompt: 'A luminous character portrait in the Ghibli art style, with a soft, glowing light.'
  },

  // Accessories Category
  {
    id: 'accessories-1',
    name: 'Floral Crown',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Floral Crown.webp',
    prompt: 'A portrait of a person wearing a beautiful and delicate Floral Crown, bohemian and ethereal style.'
  },
  {
    id: 'accessories-2',
    name: 'Scarf',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Scarf.webp',
    prompt: 'A portrait of a person wearing a stylish Scarf, adding a touch of elegance or coziness.'
  },
  {
    id: 'accessories-3',
    name: 'Beanie',
    category: 'Accessories',
    name: 'Beanie',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Beanie.webp',
    prompt: 'A portrait of a person wearing a cozy Beanie, casual and cool street style.'
  },
  {
    id: 'accessories-4',
    name: 'Bandana',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Bandana.webp',
    prompt: 'A portrait of a person wearing a cool Bandana, with a retro or edgy vibe.'
  },
  {
    id: 'accessories-5',
    name: 'Necklace',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Necklace.webp',
    prompt: 'A close-up portrait focusing on a person wearing an elegant Necklace.'
  },
  {
    id: 'accessories-6',
    name: 'Baseball Cap',
    category: 'Accessories',
    imageUrl: '/images/presets/ai-filter/Baseball Cap.webp',
    prompt: 'A portrait of a person wearing a sporty Baseball Cap, casual and relaxed.'
  },

  // Anime Category
  {
    id: 'anime-1',
    name: 'Gintocki',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/Gintocki.webp',
    prompt: 'A person transformed into the anime character Gintoki Sakata, with silver hair and samurai attire.'
  },
  {
    id: 'anime-2',
    name: 'H X H',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/H X H.webp',
    prompt: 'A person in the distinct art style of the anime Hunter x Hunter.'
  },
  {
    id: 'anime-3',
    name: 'Saitaama',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/Saitaama.webp',
    prompt: 'A person transformed into the anime character Saitama from One-Punch Man, bald and wearing his hero suit.'
  },
  {
    id: 'anime-4',
    name: 'Erren',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/Erren.webp',
    prompt: 'A person transformed into the anime character Eren Yeager from Attack on Titan, with intense eyes.'
  },
  {
    id: 'anime-5',
    name: 'Leloch',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/Leloch.webp',
    prompt: 'A person transformed into the anime character Lelouch Lamperouge from Code Geass, with his Geass eye.'
  },
  {
    id: 'anime-6',
    name: 'Light',
    category: 'Anime',
    imageUrl: '/images/presets/ai-filter/Light.webp',
    prompt: 'A person transformed into the anime character Light Yagami from Death Note, with a cunning expression.'
  },

  // Vintage Category
  {
    id: 'vintage-1',
    name: '1990s',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/1990s.webp',
    prompt: 'A portrait in the style of the 1990s, with grunge or pop fashion and a film grain look.'
  },
  {
    id: 'vintage-2',
    name: 'Victorian',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/Victorian.webp',
    prompt: 'An elegant portrait in the Victorian era style, with elaborate clothing and a formal setting.'
  },
  {
    id: 'vintage-3',
    name: '1980s',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/1980s.webp',
    prompt: 'A portrait with a vibrant 1980s aesthetic, big hair, neon colors, and retro vibes.'
  },
  {
    id: 'vintage-4',
    name: '1950s',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/1950s.webp',
    prompt: 'A classic portrait in the style of the 1950s, with pin-up or rockabilly fashion.'
  },
  {
    id: 'vintage-5',
    name: '1920s',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/1920s.webp',
    prompt: 'A glamorous portrait in the style of the Roaring 1920s, with flapper dresses and art deco elements.'
  },
  {
    id: 'vintage-6',
    name: '1990s',
    category: 'Vintage',
    imageUrl: '/images/presets/ai-filter/Male-1990s.webp',
    prompt: 'A portrait with a distinct 1990s vibe, featuring baggy clothes and a cool, casual attitude.'
  },

  // Lights Category
  {
    id: 'lights-1',
    name: 'Sunset',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Sunset.webp',
    prompt: 'A portrait with beautiful sunset lighting, warm golden hour glow, dramatic colors.'
  },
  {
    id: 'lights-2',
    name: 'Laser',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Laser.webp',
    prompt: 'A futuristic portrait with dramatic laser light effects, vibrant and energetic.'
  },
  {
    id: 'lights-3',
    name: 'Fireworks',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Fireworks.webp',
    prompt: 'A celebratory portrait with a background of exploding fireworks, bright and colorful.'
  },
  {
    id: 'lights-4',
    name: 'Northern',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Northern.webp',
    prompt: 'A magical portrait with the Northern Lights (Aurora Borealis) in the sky.'
  },
  {
    id: 'lights-5',
    name: 'Bokeh',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Bokeh.webp',
    prompt: 'A portrait with a beautiful bokeh effect, soft, out-of-focus lights in the background.'
  },
  {
    id: 'lights-6',
    name: 'Cinematic',
    category: 'Lights',
    imageUrl: '/images/presets/ai-filter/Cinematic.webp',
    prompt: 'A portrait with dramatic cinematic lighting, high contrast and moody atmosphere.'
  },
];

export const filterCategories = ['Ghibli', 'Accessories', 'Anime', 'Vintage', 'Lights'];