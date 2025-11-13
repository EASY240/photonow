// src/constants/hairstylePrompts.ts

export interface Hairstyle {
  name: string;
  imageUrl: string;
  prompt: string;
}

export const hairstylePresets: Hairstyle[] = [
  { name: 'Long Wavy', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179272761.jpg', prompt: 'A portrait with long, wavy, flowing hair' },
  { name: 'Long Hair', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1729599470399.jpg', prompt: 'A portrait with very long, straight hair' },
  { name: 'Mullet', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1729599470887.jpg', prompt: 'A person with a modern mullet hairstyle' },
  { name: 'Bangs', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1729599471255.jpg', prompt: 'A portrait of a person with stylish, full bangs' },
  { name: 'Braids', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1729599471688.jpg', prompt: 'A portrait featuring intricate and beautiful braids' },
  { name: 'Bald', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/d59b665d0a17403c9da49e7891a1cb99', prompt: 'A completely bald head, smooth and clean' },
  { name: 'Wavy', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/37261d6f1dd84b1c9b7b710dd3b19736', prompt: 'A portrait with short, naturally wavy hair' },
  { name: 'Buzz Cut', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/349d4a89249f41d59dac7efb4803da0d', prompt: 'A person with a clean and sharp buzz cut' },
  { name: 'Blunt', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/bb1bbe6e68254173b654eb5b07710242', prompt: 'A portrait featuring a stylish blunt cut hairstyle' },
  { name: 'Layered', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/e29a7406d2ed4858a8959249b74598a7', prompt: 'A person with a modern, layered hairstyle for volume and texture' },
  { name: 'Undercut', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/d8484fb1c9f145ce8f718d1f5dbeb3ac', prompt: 'A stylish undercut hairstyle' },
  { name: 'Taper Fade', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/777f33ab9f574686b3ec80aae28cbf15', prompt: 'A portrait with a clean taper fade haircut' },
  { name: 'Dreadlocks', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/bd4e0546000e40aea0af6076f281fbca', prompt: 'A person with cool and stylish dreadlocks' },
  { name: 'Ballerina Bun', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/32bdfca6ef9c4bfa9659ce4ca7ebf2db', prompt: 'An elegant and tight ballerina bun hairstyle' },
  { name: 'Ponytail', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/b68a115ea2ca4a4ea9e8d0c1305a085e', prompt: 'A person with a classic, sleek ponytail' },
  { name: 'Messy Bun', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/0cf7c98bbec84282ba05ab093d469c74', prompt: 'A casual and stylish messy bun hairstyle' },
  { name: 'Crew Cut', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/4e4477a804174b3faa013f4b5ba190bf', prompt: 'A classic and clean crew cut hairstyle' },
  { name: 'Shaggy', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/268c6b15f80744fb8321e902eb1940ce', prompt: 'A person with a trendy, shaggy, layered haircut' },
  { name: 'Pixie Cut', imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/d531c933d42142669d274a55c946108c/c8bf0bd53d8043b199a57435012d8773', prompt: 'A stylish and modern pixie cut' },
  { name: 'Bob Cut', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179271643.jpg', prompt: 'A classic bob cut hairstyle' },
  { name: 'Afro', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179270863.jpg', prompt: 'A person with a voluminous and beautiful afro hairstyle' },
  { name: 'Bowl Cut', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179272046.jpg', prompt: 'A retro bowl cut hairstyle' },
  { name: 'Curly', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179272394.jpg', prompt: 'A portrait with natural, bouncy curly hair' },
  { name: 'Space Bun', imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_filter/1727179273109.jpg', prompt: 'A fun and trendy space bun hairstyle' },
];