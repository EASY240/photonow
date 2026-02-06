import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const basePages = ['/', '/tools', '/blog', '/about', '/contact', '/privacy-policy', '/terms-of-use', '/dmca', '/cookies-policy', '/acceptable-use'];

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const extractIds = (source) => {
  return Array.from(source.matchAll(/id:\s*['"]([^'"]+)['"]/g)).map((match) => match[1]);
};

const toolDataSource = fs.readFileSync(toAbsolute('src/data/tools.ts'), 'utf-8');
const blogDataSource = fs.readFileSync(toAbsolute('src/data/blogArticles.ts'), 'utf-8');

const toolPages = Array.from(new Set(extractIds(toolDataSource))).map((id) => `/tools/${id}`);
const blogPages = Array.from(new Set(extractIds(blogDataSource))).map((id) => `/blog/${id}`);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

// Pre-render all routes
const allRoutes = [...basePages, ...toolPages, ...blogPages];
console.log('Discovered routes to prerender:', allRoutes);

(async () => {
  for (const routeUrl of allRoutes) {
    const result = render(routeUrl, {});
    const appHtml = typeof result === 'string' ? result : result.appHtml;
    let html = template.replace(`<!--app-html-->`, appHtml);

    const helmet = typeof result === 'string' ? null : result.helmet;
    if (helmet) {
      const title = helmet.title && typeof helmet.title.toString === 'function' ? helmet.title.toString() : '';
      const meta = helmet.meta && typeof helmet.meta.toString === 'function' ? helmet.meta.toString() : '';
      const link = helmet.link && typeof helmet.link.toString === 'function' ? helmet.link.toString() : '';
      const script = helmet.script && typeof helmet.script.toString === 'function' ? helmet.script.toString() : '';
      const headRest = `${meta}${link}${script}`;

      if (title) {
        html = html.replace(/<title>[\s\S]*?<\/title>/, title);
      }
      if (headRest.trim().length > 0) {
        html = html.replace('</head>', headRest + '</head>');
      }
    }

    let filePath = `dist${routeUrl}`;
    if (routeUrl.endsWith('/')) {
        filePath += 'index.html';
    } else {
        // Handle routes like /tools/ai-avatar
        filePath += '.html';
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(toAbsolute(filePath), html);
    console.log(`Pre-rendered: ${filePath}`);
  }
})();
