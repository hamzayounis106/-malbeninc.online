// Mechanical QA sweep over the data-driven site. Run before every push.
// Usage: npm run site:qa
import { readFileSync, existsSync } from "fs";
import path from "path";

const root = process.cwd();
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));

const site = read("src/data/site.json");
const content = read("src/data/content.json");
const services = read("src/data/services.json");

const errors = [];
const warnings = [];

// --- required identity fields
for (const key of ["name", "legalName", "phone", "phoneRaw", "email", "addressLine"]) {
  if (!site.business[key]) errors.push(`site.json business.${key} is empty`);
}
if (!site.domain?.startsWith("http")) errors.push("site.json domain must be a full https URL");
if (site.business.phoneRaw && !/^\d{10,11}$/.test(site.business.phoneRaw))
  errors.push(`business.phoneRaw must be digits only (got "${site.business.phoneRaw}")`);

// --- lead form widget (A2P: the form must exist on Home and Contact)
const form = site.widgets.quoteForm;
if (!form?.src || !form?.formId) errors.push("site.json widgets.quoteForm needs src and formId");
if (!site.widgets.formEmbedScript) errors.push("site.json widgets.formEmbedScript is empty");
if (!site.homeSections.includes("estimateForm")) errors.push('homeSections must include "estimateForm" (form on the homepage)');

// --- unique slugs
const seen = new Set();
for (const s of services) {
  if (!s.slug) errors.push("services.json: entry missing slug");
  else if (seen.has(s.slug)) errors.push(`services.json: duplicate slug "${s.slug}"`);
  seen.add(s.slug);
  if (!s.icon) warnings.push(`services/${s.slug}: no icon set`);
}

// --- homeSections registered
const registrySrc = readFileSync(path.join(root, "src", "components", "sections", "index.ts"), "utf8");
const registered = [...registrySrc.matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]);
for (const key of site.homeSections) {
  if (!registered.includes(key)) errors.push(`homeSections: "${key}" is not in SECTION_REGISTRY`);
}

// --- logo and share image files exist
for (const [key, val] of Object.entries(site.logo)) {
  if (typeof val === "string" && val.startsWith("/") && !existsSync(path.join(root, "public", val.slice(1))))
    errors.push(`logo.${key}: public${val} does not exist`);
}
if (site.seo.ogImage && !existsSync(path.join(root, "public", site.seo.ogImage.replace(/^\//, ""))))
  warnings.push(`seo.ogImage: public${site.seo.ogImage} does not exist`);
for (const f of ["favicon.ico", "images/favicon-32.png", "images/apple-touch-icon.png", ".htaccess"]) {
  if (!existsSync(path.join(root, "public", f))) errors.push(`public/${f} is missing`);
}

// --- no em dashes or template placeholders in copy
const copy = JSON.stringify(site) + JSON.stringify(content) + JSON.stringify(services);
if (copy.includes(String.fromCharCode(0x2014))) errors.push("data files contain an em dash");
if (/\{\{|\[Company|lorem/i.test(copy)) errors.push("data files contain template placeholders");

// --- sitemap freshness
const sitemapPath = path.join(root, "public", "sitemap.xml");
if (!existsSync(sitemapPath)) {
  errors.push("public/sitemap.xml missing: run npm run site:seo");
} else {
  const sm = readFileSync(sitemapPath, "utf8");
  if (!sm.includes(site.domain.replace(/\/$/, ""))) errors.push("sitemap.xml domain does not match site.json: run npm run site:seo");
  for (const r of ["/privacy-policy", "/terms-of-service", "/contact"]) {
    if (!sm.includes(`${site.domain}${r}<`)) errors.push(`sitemap.xml missing ${r}: run npm run site:seo`);
  }
}

// --- index.html in sync
const html = readFileSync(path.join(root, "index.html"), "utf8");
if (!html.includes(`content="${site.domain.replace(/\/$/, "")}/"`))
  errors.push("index.html og:url does not match site.json domain: run npm run site:seo");
if (site.widgets.formEmbedScript && !html.includes(site.widgets.formEmbedScript))
  errors.push("index.html is missing the form embed script: run npm run site:seo");

// --- report
if (warnings.length) console.log("Warnings:\n" + warnings.map((w) => "  ! " + w).join("\n"));
if (errors.length) {
  console.error("QA FAILED:\n" + errors.map((e) => "  x " + e).join("\n"));
  process.exit(1);
}
console.log(`QA passed: ${services.length} services, ${site.homeSections.length} home sections.`);
