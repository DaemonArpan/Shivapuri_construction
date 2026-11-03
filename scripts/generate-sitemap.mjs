import { mkdir, readFile, writeFile } from 'node:fs/promises';

let envFile = '';
try { envFile = await readFile('.env', 'utf8'); } catch {}
const fileUrl = envFile.match(/^\s*VITE_SITE_URL\s*=\s*["']?([^\r\n"']+)/m)?.[1]?.trim();
const siteUrl = (process.env.VITE_SITE_URL || fileUrl)?.replace(/\/$/, '');
const routes = [
  '/', '/engineering-consultancy', '/engineering-consultancy/architectural-drawing',
  '/engineering-consultancy/structural-design', '/engineering-consultancy/3d-design',
  '/engineering-consultancy/cost-estimation', '/engineering-consultancy/landscape-design',
  '/engineering-consultancy/building-analysis', '/engineering-consultancy/valuation',
  '/construction', '/construction/residential-building', '/construction/commercial-building',
  '/construction/hotel-resort', '/construction/party-palace', '/construction/apartments',
  '/real-estate', '/real-estate/land-building', '/real-estate/land-lease',
  '/furniture-interior', '/furniture-interior/korean-furniture', '/furniture-interior/luxury-furniture', '/furniture-interior/custom-furniture',
  '/import-export', '/import-export/marble', '/import-export/tiles', '/import-export/chandeliers', '/import-export/lighting',
  '/material-supply', '/material-supply/sand', '/material-supply/aggregate', '/material-supply/cement',
  '/material-supply/steel', '/material-supply/electrical', '/material-supply/sanitary',
  '/about-us', '/contact', '/projects', '/blog', '/privacy-policy', '/terms-and-conditions',
  ...Array.from({ length: 48 }, (_, i) => `/projects/completed-project-${String(i + 1).padStart(2, '0')}`),
];
await mkdir('dist', { recursive: true });
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\n' + (siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''));
if (!siteUrl || !/^https:\/\//i.test(siteUrl) || /\.example(?:\/|$)/i.test(siteUrl)) {
  console.log('VITE_SITE_URL is unset or not HTTPS; sitemap generation skipped. Configure it for deployment.');
  process.exit(0);
}
const urls = routes.map(route => `  <url><loc>${siteUrl}${route}</loc></url>`).join('\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`Generated sitemap for ${siteUrl}`);
