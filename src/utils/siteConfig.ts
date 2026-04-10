/**
 * Site configuration utilities for SSR-safe URL generation
 */

// Get the site origin in an SSR-safe way
export const getSiteOrigin = (): string => {
  return 'https://modernphototools.com';
};

export const personalProfile = {
  fullName: 'Ali ZurSchmiede',
  title: 'Founder & AI Editing Specialist',
  imageUrl: '/images/blog/Ali ZurSchmiede.jpg',
  quote: 'You didn’t start a business to spend hours stuck behind your laptop.',
  websiteUrl: 'https://www.alizurschmiede.com/',
  instagramUrl: 'https://www.instagram.com/alizurschmiede/',
  contactEmail: 'alidue992@gmail.com',
  bioParagraphs: [
    'What if you could delegate the time-consuming tasks on your list and focus on the aspects of your business that you are actually passionate about? Whether that means spending time working on big-picture goals, enjoying peaceful walks in nature away from your screen, or spending quality time with your family—my goal is to help take the load off.',
    'I founded Modern Photo Tools with a clear mission: to democratize high-quality photo editing. Traditional editing work often requires expensive software and steep learning curves, draining both time and money. I built this platform of AI-powered tools to help beginners, entrepreneurs, and myself achieve professional-grade results for free.',
    'By leveraging advanced AI, we make it possible to reclaim your time, lower your business costs, and effortlessly produce the visual content you need to succeed online.'
  ]
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
