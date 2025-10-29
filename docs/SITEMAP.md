# Sitemap System Documentation

## Overview

This website implements a comprehensive XML sitemap system that automatically generates and maintains sitemaps according to Google's sitemap protocol. The system includes automatic updates, caching, validation, and administrative tools.

## Features

- ✅ **Google Protocol Compliant**: Follows XML sitemap specifications
- ✅ **Automatic Updates**: Regenerates when content changes
- ✅ **Caching**: Prevents frequent regenerations
- ✅ **URL Validation**: Ensures all URLs return 200 status codes
- ✅ **Sitemap Index**: Supports large sites (50k+ URLs)
- ✅ **Admin Interface**: Management and monitoring tools
- ✅ **Webhook Support**: Integration with content management systems

## Architecture

### Components

1. **Netlify Functions**
   - `sitemap.js`: Main sitemap generation and serving
   - `sitemap-admin.js`: Administrative operations

2. **Utilities**
   - `src/utils/sitemap.ts`: Core sitemap utilities
   - `src/utils/sitemapClient.ts`: Client-side API wrapper

3. **Configuration**
   - `netlify.toml`: URL routing and redirects

## Sitemap Structure

### Included Content Types

| Content Type | Priority | Change Frequency | Example URLs |
|--------------|----------|------------------|--------------|
| Homepage | 1.0 | daily | `/` |
| Main Pages | 0.8 | weekly | `/about`, `/contact` |
| Tool Pages | 0.9 | weekly | `/tools/background-remover` |
| Blog Articles | 0.7 | monthly | `/blog/article-slug` |
| Images | 0.5 | monthly | `/images/blog/image.jpg` |

### XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15T10:30:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

## Configuration

### Environment Variables

```bash
# Optional: Admin authentication token
SITEMAP_ADMIN_KEY=your-secret-admin-key

# Optional: Custom site URL (auto-detected if not set)
SITE_URL=https://your-domain.com

# Optional: Cache duration in seconds (default: 3600)
SITEMAP_CACHE_DURATION=3600
```

### Sitemap Configuration

Located in `netlify/functions/sitemap.js`:

```javascript
const SITEMAP_CONFIG = {
  maxUrlsPerSitemap: 50000,
  cacheMaxAge: 3600, // 1 hour
  defaultChangefreq: 'weekly',
  defaultPriority: 0.5,
  validateUrls: true,
  includeImages: true,
};
```

## API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sitemap.xml` | GET | Main sitemap or sitemap index |
| `/sitemap-index.xml` | GET | Sitemap index (for large sites) |
| `/sitemap-1.xml` | GET | Individual sitemap chunk |

### Admin Endpoints (Require Authentication)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sitemap/stats` | GET | Get sitemap statistics |
| `/api/sitemap/regenerate` | POST | Manually regenerate sitemap |
| `/api/sitemap/invalidate` | POST | Clear sitemap cache |

### Webhook Endpoint (No Authentication)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sitemap/webhook` | POST | Trigger automatic updates |

## Usage

### Basic Usage

The sitemap is automatically available at `/sitemap.xml` and updates automatically when content changes.

### Manual Operations

#### Using the Client Library

```typescript
import { sitemapClient } from '@/utils/sitemapClient';

// Set admin token for authenticated operations
sitemapClient.setAdminToken('your-admin-token');

// Get sitemap statistics
const stats = await sitemapClient.getStats();
console.log('Total URLs:', stats.totalUrls);

// Manually regenerate sitemap
const result = await sitemapClient.regenerate();
console.log('Regeneration result:', result.success);

// Invalidate cache
await sitemapClient.invalidateCache();

// Check sitemap accessibility
const access = await sitemapClient.checkSitemapAccess();
console.log('Sitemap accessible:', access.accessible);
```

#### Using Direct API Calls

```bash
# Get sitemap statistics
curl -H "Authorization: Bearer your-admin-token" \
  https://your-domain.com/api/sitemap/stats

# Regenerate sitemap
curl -X POST -H "Authorization: Bearer your-admin-token" \
  https://your-domain.com/api/sitemap/regenerate

# Send webhook for content update
curl -X POST -H "Content-Type: application/json" \
  -d '{"action":"published","type":"blog","id":"new-article"}' \
  https://your-domain.com/api/sitemap/webhook
```

### Automatic Updates

#### Using the Update Hook

```typescript
import { sitemapUpdateHook } from '@/utils/sitemapClient';

// Trigger update when blog article is published
await sitemapUpdateHook.onBlogArticleChange('published', 'article-id');

// Trigger update when page is created
await sitemapUpdateHook.onPageChange('created', '/new-page');

// Trigger update when tool is updated
await sitemapUpdateHook.onToolChange('updated', 'tool-id');

// Trigger update when image is added
await sitemapUpdateHook.onImageChange('created', '/images/new-image.jpg');
```

#### Integration with Content Management

```typescript
// Example: Integration with blog publishing
export async function publishBlogArticle(article: BlogArticle) {
  // Publish the article
  await saveArticle(article);
  
  // Trigger sitemap update
  await sitemapUpdateHook.onBlogArticleChange('published', article.id);
}
```

## Monitoring and Maintenance

### Health Checks

```typescript
import { sitemapClient } from '@/utils/sitemapClient';

async function checkSitemapHealth() {
  try {
    // Check accessibility
    const access = await sitemapClient.checkSitemapAccess();
    if (!access.accessible) {
      console.error('Sitemap not accessible:', access.error);
      return false;
    }
    
    // Validate XML structure
    const validation = await sitemapClient.validateSitemap();
    if (!validation.valid) {
      console.error('Invalid sitemap XML:', validation.error);
      return false;
    }
    
    // Check statistics
    const stats = await sitemapClient.getStats();
    if (stats.totalUrls === 0) {
      console.warn('Sitemap contains no URLs');
      return false;
    }
    
    console.log('Sitemap health check passed:', {
      urlCount: validation.urlCount,
      totalUrls: stats.totalUrls,
      cacheValid: stats.cacheValid,
    });
    
    return true;
  } catch (error) {
    console.error('Sitemap health check failed:', error);
    return false;
  }
}
```

### Performance Monitoring

```typescript
async function monitorSitemapPerformance() {
  const startTime = Date.now();
  
  try {
    const response = await fetch('/sitemap.xml');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log('Sitemap performance:', {
      responseTime: `${responseTime}ms`,
      status: response.status,
      cached: response.headers.get('x-cache-status'),
    });
    
    if (responseTime > 5000) {
      console.warn('Sitemap response time is slow:', responseTime);
    }
  } catch (error) {
    console.error('Sitemap performance check failed:', error);
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Sitemap Not Accessible (404 Error)

**Symptoms**: `/sitemap.xml` returns 404

**Solutions**:
- Check Netlify function deployment
- Verify `netlify.toml` redirect rules
- Check function logs in Netlify dashboard

```bash
# Check function logs
netlify functions:log sitemap
```

#### 2. Empty Sitemap

**Symptoms**: Sitemap contains no URLs

**Solutions**:
- Check content directory structure
- Verify file permissions
- Check function logs for errors

```typescript
// Debug content loading
const stats = await sitemapClient.getStats();
console.log('Content breakdown:', stats.breakdown);
```

#### 3. Slow Sitemap Generation

**Symptoms**: Long response times for sitemap requests

**Solutions**:
- Check cache configuration
- Reduce URL validation scope
- Optimize content loading

```javascript
// Disable URL validation for faster generation
const SITEMAP_CONFIG = {
  validateUrls: false, // Temporary fix
  // ... other config
};
```

#### 4. Cache Not Working

**Symptoms**: Sitemap regenerates on every request

**Solutions**:
- Check cache headers
- Verify cache duration settings
- Clear and regenerate cache

```typescript
// Force cache invalidation and regeneration
await sitemapClient.invalidateCache();
await sitemapClient.regenerate();
```

#### 5. Authentication Errors

**Symptoms**: 401 errors on admin endpoints

**Solutions**:
- Verify admin token configuration
- Check environment variables
- Use correct Authorization header format

```bash
# Correct header format
Authorization: Bearer your-admin-token
```

### Debugging Tools

#### Enable Debug Logging

Add to Netlify function:

```javascript
// Enable debug mode
const DEBUG = process.env.NODE_ENV === 'development' || process.env.SITEMAP_DEBUG === 'true';

function debugLog(...args) {
  if (DEBUG) {
    console.log('[SITEMAP DEBUG]', ...args);
  }
}
```

#### Test Sitemap Generation Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run functions locally
netlify dev

# Test sitemap endpoint
curl http://localhost:8888/sitemap.xml
```

### Log Analysis

#### Common Log Patterns

```bash
# Successful generation
"Sitemap generated successfully with X URLs"

# Cache hit
"Serving cached sitemap"

# Content loading error
"Could not load blog articles: [error]"

# URL validation warning
"URL validation failed for: [url]"
```

## Maintenance Tasks

### Regular Maintenance

#### Weekly Tasks
- [ ] Check sitemap accessibility
- [ ] Review error logs
- [ ] Validate URL count matches content

#### Monthly Tasks
- [ ] Performance review
- [ ] Cache optimization
- [ ] Content audit

#### Quarterly Tasks
- [ ] Security review
- [ ] Configuration updates
- [ ] Documentation updates

### Maintenance Scripts

#### Health Check Script

```typescript
// scripts/sitemap-health-check.ts
import { sitemapClient } from '../src/utils/sitemapClient';

async function runHealthCheck() {
  console.log('Running sitemap health check...');
  
  const results = {
    accessibility: await sitemapClient.checkSitemapAccess(),
    validation: await sitemapClient.validateSitemap(),
    stats: await sitemapClient.getStats(),
  };
  
  console.log('Health check results:', results);
  
  // Send alerts if issues found
  if (!results.accessibility.accessible || !results.validation.valid) {
    // Send notification (email, Slack, etc.)
    console.error('Sitemap health check failed!');
    process.exit(1);
  }
  
  console.log('Sitemap health check passed!');
}

runHealthCheck().catch(console.error);
```

#### Cache Warming Script

```typescript
// scripts/warm-sitemap-cache.ts
import { sitemapClient } from '../src/utils/sitemapClient';

async function warmCache() {
  console.log('Warming sitemap cache...');
  
  try {
    // Invalidate old cache
    await sitemapClient.invalidateCache();
    
    // Generate fresh sitemap
    await sitemapClient.regenerate();
    
    // Verify accessibility
    const access = await sitemapClient.checkSitemapAccess();
    
    if (access.accessible) {
      console.log('Cache warmed successfully');
    } else {
      throw new Error('Failed to warm cache');
    }
  } catch (error) {
    console.error('Cache warming failed:', error);
    process.exit(1);
  }
}

warmCache().catch(console.error);
```

## Security Considerations

### Authentication
- Admin endpoints require valid authentication token
- Webhook endpoints are public but validate payload structure
- Use environment variables for sensitive configuration

### Rate Limiting
- Consider implementing rate limiting for admin endpoints
- Monitor webhook usage to prevent abuse

### Input Validation
- All user inputs are validated and sanitized
- XML content is properly escaped
- URL validation prevents malicious URLs

## Performance Optimization

### Caching Strategy
- Sitemap cached for 1 hour by default
- Cache invalidated on content changes
- Browser caching enabled with appropriate headers

### Content Loading Optimization
- Lazy loading of large content sets
- Efficient file system operations
- Minimal memory usage for large sites

### URL Validation Optimization
- Batch URL validation requests
- Skip validation for trusted internal URLs
- Configurable validation scope

## Integration Examples

### GitHub Actions Integration

```yaml
# .github/workflows/sitemap-update.yml
name: Update Sitemap
on:
  push:
    paths:
      - 'content/blog/**'
      - 'src/data/tools.ts'

jobs:
  update-sitemap:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Sitemap Update
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -d '{"action":"updated","type":"blog"}' \
            ${{ secrets.SITE_URL }}/api/sitemap/webhook
```

### CMS Integration

```typescript
// Example: Strapi plugin integration
export default {
  async afterCreate(event) {
    const { model } = event;
    
    if (model === 'blog-article') {
      await fetch(`${process.env.SITE_URL}/api/sitemap/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'published',
          type: 'blog',
          id: event.result.id,
        }),
      });
    }
  },
};
```

## Support

For issues or questions:
1. Check this documentation
2. Review function logs in Netlify dashboard
3. Test endpoints using provided debugging tools
4. Check GitHub issues for known problems

## Changelog

### Version 1.0.0
- Initial implementation
- Google sitemap protocol compliance
- Automatic updates via webhooks
- Admin interface
- Comprehensive documentation