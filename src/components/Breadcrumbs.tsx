import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import our data to find names from IDs
import { tools } from '../data/tools';
import { blogArticles } from '../data/blogArticles';

// Helper function to capitalize
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to find article/tool names
const getNameFromId = (id: string, type: 'blog' | 'tool' | 'blogCat' | 'toolCat') => {
  if (type === 'blog') {
    return blogArticles.find(a => a.id === id)?.title || capitalize(id.replace(/-/g, ' '));
  }
  if (type === 'tool') {
    return tools.find(t => t.id === id)?.name || capitalize(id.replace(/-/g, ' '));
  }
  if (type === 'blogCat') {
    // Map blog categories based on the categories used in blogArticles
    const categoryMap: Record<string, string> = {
      'general': 'General',
      'tools': 'Tools'
    };
    return categoryMap[id] || capitalize(id.replace(/-/g, ' '));
  }
  if (type === 'toolCat') {
    // For now, just capitalize the category name since toolCategories is not defined
    return capitalize(id.replace(/-/g, ' '));
  }
  return capitalize(id.replace(/-/g, ' '));
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbBaseUrl = 'https://modernphototools.com';

  const breadcrumbs = [
    { name: 'Home', path: '/', isLast: false }
  ];

  let currentPath = '';

  pathnames.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === pathnames.length - 1;

    let name = capitalize(part.replace(/-/g, ' '));

    // This logic translates path IDs into human-readable names
    try {
      if (part === 'blog') name = 'Blog';
      if (part === 'tools') name = 'Tools';
      if (part === 'about') name = 'About';
      if (part === 'contact') name = 'Contact';
      if (part === 'privacy-policy') name = 'Privacy Policy';
      if (part === 'terms-of-use') name = 'Terms of Use';
      if (part === 'dmca') name = 'DMCA';
      if (part === 'cookies-policy') name = 'Cookies Policy';
      
      const prevPart = pathnames[index - 1];
      
      // Handle blog articles
      if (prevPart === 'blog' && part !== 'category') {
        name = getNameFromId(part, 'blog');
      }
      
      // Handle tool pages
      if (prevPart === 'tools' && part !== 'category') {
        name = getNameFromId(part, 'tool');
      }
      
      // Handle category pages
      if (prevPart === 'category') {
        // Check if we are in /blog/category/ or /tools/category/
        const grandPrevPart = pathnames[index - 2];
        if (grandPrevPart === 'blog') {
          name = getNameFromId(part, 'blogCat');
        } else if (grandPrevPart === 'tools') {
          name = getNameFromId(part, 'toolCat');
        }
      }
      
      // Handle tag pages
      if (prevPart === 'tag') {
        name = `Tag: ${capitalize(part.replace(/-/g, ' '))}`;
      }

    } catch (e) {
      console.error("Error building breadcrumb:", e);
      name = capitalize(part.replace(/-/g, ' ')); // Fallback
    }

    breadcrumbs.push({ name, path: currentPath, isLast });
  });

  // Don't show breadcrumbs for the home page
  if (location.pathname === '/') {
    return null;
  }

  // Generate JSON-LD Schema for SEO
  const itemListElement = breadcrumbs.map((crumb, index) => {
    const listItem: {
      '@type': string;
      position: number;
      name: string;
      item?: string;
    } = {
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name
    };

    if (!crumb.isLast) {
      listItem.item = `${breadcrumbBaseUrl}${crumb.path}`;
    }

    return listItem;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <div className="custom-left-col yoast-breadcrumb">
        <p id="breadcrumbs">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span key={crumb.path}>
                {isLast ? (
                  <span className="breadcrumb_last" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <span><Link to={crumb.path}>{crumb.name}</Link></span>
                )}
                {!isLast && <b></b>} {/* Separator element */}
              </span>
            );
          })}
        </p>
      </div>
    </>
  );
}
