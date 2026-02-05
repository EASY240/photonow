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
