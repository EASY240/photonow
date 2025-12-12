/**
 * Site configuration utilities for SSR-safe URL generation
 */

// Get the site origin in an SSR-safe way
export const getSiteOrigin = (): string => {
  return 'https://modernphototools.com';
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
