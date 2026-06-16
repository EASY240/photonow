/**
 * Site configuration utilities for SSR-safe URL generation
 */

// Get the site origin in an SSR-safe way
export const getSiteOrigin = (): string => {
  return 'https://modernphototools.com';
};

export const personalProfile = {
  fullName: 'Ali ZurSchmiede',
  title: 'Founder & AI Photo Editing Specialist',
  location: 'United States',
  imageUrl: '/images/blog/ali-zurschmiede.webp',
  quote: 'You didn\'t start a business to spend hours stuck behind your laptop.',
  websiteUrl: 'https://www.alizurschmiede.com/',
  instagramUrl: 'https://www.instagram.com/alizurschmiede/',
  contactEmail: 'alizurschmiede@modernphototools.com',
  expertiseAreas: [
    'AI-powered photo editing',
    'Digital content creation',
    'Visual marketing for online businesses',
    'Workflow automation for creators',
  ],
  bioParagraphs: [
    'Ali ZurSchmiede is the founder of ModernPhotoTools.com and has spent over five years working at the intersection of visual content creation, AI tooling, and digital marketing for small businesses and entrepreneurs. She built ModernPhotoTools after spending years helping clients produce professional-grade product photos and social media visuals — and watching them burn hours inside expensive, complex desktop software.',
    'Her approach is practical and creator-first. Every tool on this platform was chosen because it solves a real problem she has encountered in her own workflow: removing a background in 5 seconds instead of 20 minutes, generating a studio-quality headshot without booking a photographer, or upscaling an old photo to print quality without buying a $300 subscription.',
    'Based in the United States, Ali runs ModernPhotoTools as a lean, independent publisher with no VC funding and no vendor partnerships — so every recommendation on this site reflects genuine editorial judgment, not sponsored content.',
  ],
};

// Generate canonical URLs for different page types
export const generateCanonicalUrl = (path: string): string => {
  const origin = getSiteOrigin();
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
};

// Generate OG image URLs
export const generateOgImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  const origin = getSiteOrigin();
  return imagePath.startsWith('http') ? imagePath : `${origin}${imagePath}`;
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const listItem: {
        '@type': string;
        position: number;
        name: string;
        item?: string;
      } = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name
      };

      if (index < items.length - 1) {
        listItem.item = `${origin}${item.path}`;
      }

      return listItem;
    })
  };
};
