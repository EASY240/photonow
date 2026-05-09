// src/constants/hairstylePrompts.ts

export interface Hairstyle {
  name: string;
  imageUrl: string;
  prompt: string;
}

export const hairstylePresets: Hairstyle[] = [
  { name: 'Long Wavy', imageUrl: '/images/presets/ai-hairstyle/Long Wavy.webp', prompt: 'A portrait with long, wavy, flowing hair' },
  { name: 'Long Hair', imageUrl: '/images/presets/ai-hairstyle/Long Hair.webp', prompt: 'A portrait with very long, straight hair' },
  { name: 'Mullet', imageUrl: '/images/presets/ai-hairstyle/Mullet.webp', prompt: 'A person with a modern mullet hairstyle' },
  { name: 'Bangs', imageUrl: '/images/presets/ai-hairstyle/Bangs.webp', prompt: 'A portrait of a person with stylish, full bangs' },
  { name: 'Braids', imageUrl: '/images/presets/ai-hairstyle/Braids.webp', prompt: 'A portrait featuring intricate and beautiful braids' },
  { name: 'Bald', imageUrl: '/images/presets/ai-hairstyle/Bald.webp', prompt: 'A completely bald head, smooth and clean' },
  { name: 'Wavy', imageUrl: '/images/presets/ai-hairstyle/Wavy.webp', prompt: 'A portrait with short, naturally wavy hair' },
  { name: 'Buzz Cut', imageUrl: '/images/presets/ai-hairstyle/Buzz Cut.webp', prompt: 'A person with a clean and sharp buzz cut' },
  { name: 'Blunt', imageUrl: '/images/presets/ai-hairstyle/Blunt.webp', prompt: 'A portrait featuring a stylish blunt cut hairstyle' },
  { name: 'Layered', imageUrl: '/images/presets/ai-hairstyle/Layered.webp', prompt: 'A person with a modern, layered hairstyle for volume and texture' },
  { name: 'Undercut', imageUrl: '/images/presets/ai-hairstyle/Undercut.webp', prompt: 'A stylish undercut hairstyle' },
  { name: 'Taper Fade', imageUrl: '/images/presets/ai-hairstyle/Tapper Fade.webp', prompt: 'A portrait with a clean taper fade haircut' },
  { name: 'Dreadlocks', imageUrl: '/images/presets/ai-hairstyle/Dreadlocks.webp', prompt: 'A person with cool and stylish dreadlocks' },
  { name: 'Ballerina Bun', imageUrl: '/images/presets/ai-hairstyle/Ballerina Bun.webp', prompt: 'An elegant and tight ballerina bun hairstyle' },
  { name: 'Ponytail', imageUrl: '/images/presets/ai-hairstyle/Ponytail.webp', prompt: 'A person with a classic, sleek ponytail' },
  { name: 'Messy Bun', imageUrl: '/images/presets/ai-hairstyle/Messy Bun.webp', prompt: 'A casual and stylish messy bun hairstyle' },
  { name: 'Crew Cut', imageUrl: '/images/presets/ai-hairstyle/Crew Cut.webp', prompt: 'A classic and clean crew cut hairstyle' },
  { name: 'Shaggy', imageUrl: '/images/presets/ai-hairstyle/Shaggy.webp', prompt: 'A person with a trendy, shaggy, layered haircut' },
  { name: 'Pixie Cut', imageUrl: '/images/presets/ai-hairstyle/Pixie Cut.webp', prompt: 'A stylish and modern pixie cut' },
  { name: 'Bob Cut', imageUrl: '/images/presets/ai-hairstyle/Bob Cut.webp', prompt: 'A classic bob cut hairstyle' },
  { name: 'Afro', imageUrl: '/images/presets/ai-hairstyle/Afro.webp', prompt: 'A person with a voluminous and beautiful afro hairstyle' },
  { name: 'Bowl Cut', imageUrl: '/images/presets/ai-hairstyle/Bowl Cut.webp', prompt: 'A retro bowl cut hairstyle' },
  { name: 'Curly', imageUrl: '/images/presets/ai-hairstyle/Curly.webp', prompt: 'A portrait with natural, bouncy curly hair' },
  { name: 'Space Bun', imageUrl: '/images/presets/ai-hairstyle/Space Bun.webp', prompt: 'A fun and trendy space bun hairstyle' },
];