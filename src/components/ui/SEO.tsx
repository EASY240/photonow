import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../constants';
import { getSiteOrigin } from '../../utils/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  canonicalUrl,
  ogImage
}) => {
  const formattedTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
  const baseUrl = getSiteOrigin();

  // Resolve canonical URL: prefer explicit prop, then derive from router location
  // This ensures SSR and prerender always emit a valid absolute URL (never empty)
  let resolvedPath = '';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    resolvedPath = location.pathname;
  } catch {
    // Outside router context (tests, SSR edge cases) — path stays empty
  }

  const resolvedCanonical =
    canonicalUrl ||
    (resolvedPath ? `${baseUrl}${resolvedPath}` : baseUrl);

  // og:url: same value as canonical (never empty)
  const ogUrl = resolvedCanonical;

  // Default Open Graph image
  const defaultOgImage = `${baseUrl}/favicon.svg`;

  const getValidatedOgImage = (): string => {
    if (!ogImage) return defaultOgImage;
    if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) return ogImage;
    if (ogImage.startsWith('/')) return `${baseUrl}${ogImage}`;
    return `${baseUrl}/${ogImage}`;
  };

  const finalOgImage = getValidatedOgImage();

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical URL — always emitted, self-referencing when no prop provided */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={SITE_TITLE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
    </Helmet>
  );
};

export default SEO;