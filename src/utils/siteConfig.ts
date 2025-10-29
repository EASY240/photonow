/**
 * Site configuration utilities for SSR-safe URL generation
 */

// Get the site origin in an SSR-safe way
export const getSiteOrigin = (): string => {
  // During SSR or build time, use the production URL
  if (typeof window === 'undefined') {
    return process.env.SITE_URL || 'https://modernphototools.com';
  }
  
  // In the browser, use the current origin
  return window.location.origin;
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