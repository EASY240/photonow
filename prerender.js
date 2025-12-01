import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

// --- START: Static Route Generation ---
// Base static pages
const basePages = ['/', '/tools', '/blog', '/about', '/contact', '/privacy-policy', '/terms-of-use', '/dmca', '/cookies-policy'];

// Tool pages (based on tools data)
const toolPages = [
  '/tools/remove-background',
  '/tools/ai-cleanup',
  '/tools/ai-expand',
  '/tools/ai-replace',
  '/tools/ai-cartoon',
  '/tools/ai-caricature',
  '/tools/ai-avatar',
  '/tools/ai-product-photoshoot',
  '/tools/ai-background-generator',
  '/tools/ai-image-generator',
  '/tools/ai-portrait',
  '/tools/ai-face-swap',
  '/tools/ai-outfit',
  '/tools/ai-image-to-image',
  '/tools/ai-sketch-to-image',
  '/tools/ai-hairstyle',
  '/tools/ai-image-upscaler',
  '/tools/ai-filter',
  '/tools/prompt-generator'
];

// Blog pages (based on blogArticles data)
const blogPages = [
  '/blog/ai-image-enhancement-guide',
  '/blog/ai-background-generators-2025',
  '/blog/best-ai-headshot-generators',
  '/blog/ai-avatar-creation-guide',
  '/blog/professional-headshots-ai',
  '/blog/ai-cartoon-photo-effects'
];
// --- END: Static Route Generation ---

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

// Pre-render all routes
const allRoutes = [...basePages, ...toolPages, ...blogPages];
console.log('Discovered routes to prerender:', allRoutes);

(async () => {
  for (const routeUrl of allRoutes) {
    const { appHtml, head } = render(routeUrl, {});
    let html = template.replace(`<!--app-html-->`, appHtml);
    if (head && head.trim()) {
      html = html.replace('</head>', `${head}\n</head>`);
    }

    let filePath = `dist${routeUrl}`;
    if (routeUrl.endsWith('/')) {
      filePath += 'index.html';
    } else {
      filePath = `${filePath}/index.html`;
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(toAbsolute(filePath), html);
    console.log(`Pre-rendered: ${filePath}`);
  }
})();
