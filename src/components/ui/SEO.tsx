import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../constants';
import { getSiteOrigin } from '../../utils/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

// Helper function to safely determine environment and base URL for SSR compatibility
function getEnvironmentConfig() {
  const baseUrl = getSiteOrigin();
  const isProduction = typeof window !== 'undefined' 
    ? (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    : (import.meta.env.PROD || process.env.NODE_ENV === 'production');
    
  return {
    isProduction,
    baseUrl
  };
}

const SEO: React.FC<SEOProps> = ({ 
  title = SITE_TITLE, 
  description = SITE_DESCRIPTION,
  canonicalUrl,
  ogImage
}) => {
  const formattedTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
  
  // Get environment config for proper URL handling
  const { baseUrl } = getEnvironmentConfig();
  
  // Default Open Graph image (favicon) with proper error handling
  const defaultOgImage = `${baseUrl}/favicon.svg`;
  
  // Validate and sanitize the ogImage URL
  const getValidatedOgImage = (): string => {
    if (!ogImage) return defaultOgImage;
    
    try {
      // If ogImage is already a full URL, use it
      if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) {
        return ogImage;
      }
      
      // If ogImage is a relative path, make it absolute
      if (ogImage.startsWith('/')) {
        return `${baseUrl}${ogImage}`;
      }
      
      // If ogImage is just a filename, assume it's in the root
      return `${baseUrl}/${ogImage}`;
    } catch (error) {
      console.warn('Invalid ogImage provided, falling back to default:', error);
      return defaultOgImage;
    }
  };
  
  const finalOgImage = getValidatedOgImage();
  
  // Generate the current page URL for og:url meta tag
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={SITE_TITLE} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEO;