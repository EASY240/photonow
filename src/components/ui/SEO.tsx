import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../constants';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = SITE_TITLE, 
  description = SITE_DESCRIPTION,
  canonicalUrl
}) => {
  const formattedTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
  
  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_TITLE} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEO;