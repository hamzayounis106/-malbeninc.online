// Generates SEO artifacts from src/data/site.json:
//  - index.html <head> block (title/meta/OG/favicons) and widget script tags
//  - public/sitemap.xml with every route
//  - public/robots.txt
// Usage: npm run site:seo
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const root = process.cwd();
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));

const site = read("src/data/site.json");

/** Every public route. Keep in sync with src/entry-server.tsx -> prerenderPaths. */
export const ROUTES = ["/", "/services", "/about", "/contact", "/privacy-policy", "/terms-of-service"];

const domain = site.domain.replace(/\/$/, "");
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- index.html ----------
const htmlPath = path.join(root, "index.html");
let html = readFileSync(htmlPath, "utf8");

// Only advertise a share image that actually exists (a 404 og:image is worse than none).
const ogImage =
  site.seo.ogImage && existsSync(path.join(root, "public", site.seo.ogImage.replace(/^\//, "")))
    ? `${domain}${site.seo.ogImage}`
    : "";

const seoBlock = `<!-- SEO:START - auto-generated from src/data/site.json. Run \`npm run site:seo\`. Do not edit by hand. -->
    <title>${esc(site.seo.defaultTitle)}</title>
    <meta name="description" content="${esc(site.seo.defaultDescription)}" />
    <link rel="canonical" href="${domain}/" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
    <meta name="theme-color" content="#1c1c1c" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(site.business.name)}" />
    <meta property="og:url" content="${domain}/" />
    <meta property="og:title" content="${esc(site.seo.defaultTitle)}" />
    <meta property="og:description" content="${esc(site.seo.defaultDescription)}" />
${ogImage ? `    <meta property="og:image" content="${ogImage}" />
` : ""}    <meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${esc(site.seo.defaultTitle)}" />
    <meta name="twitter:description" content="${esc(site.seo.defaultDescription)}" />
${ogImage ? `    <meta name="twitter:image" content="${ogImage}" />
` : ""}    <!-- SEO:END -->`;

const widgetLines = [];
if (site.widgets.formEmbedScript) {
  widgetLines.push(`    <script src="${site.widgets.formEmbedScript}"></script>`);
}
const widgetsBlock = `<!-- WIDGETS:START - auto-generated from src/data/site.json. Run \`npm run site:seo\`. Do not edit by hand. -->
${widgetLines.join("\n")}
    <!-- WIDGETS:END -->`;

html = html.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => seoBlock);
html = html.replace(/<!-- WIDGETS:START[\s\S]*?<!-- WIDGETS:END -->/, () => widgetsBlock);
writeFileSync(htmlPath, html);

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${domain}${r === "/" ? "/" : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${r === "/" ? "1.0" : r.includes("policy") || r.includes("terms") ? "0.3" : "0.8"}</priority>
  </url>`
).join("\n")}
</urlset>
`;
writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);

// ---------- robots.txt ----------
writeFileSync(path.join(root, "public", "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);

console.log(`SEO generated: index.html head, sitemap.xml (${ROUTES.length} routes), robots.txt for ${domain}`);
