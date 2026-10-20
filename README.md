# malbeninc.online

Website for MALBEN, INC., a renovation company in Miami, FL. Built for A2P 10DLC
carrier review: the GoHighLevel lead form appears on the Home and Contact pages, each
copy followed by a plain-text SMS disclosure linking the Privacy Policy and Terms of
Service, and no other form on the site collects phone numbers or emails.

## Stack

Vite + React + TypeScript + Tailwind, prerendered at build time to static HTML
(`dist/`), deployed to Hostinger (Apache/LiteSpeed) with clean URLs via `.htaccess`.

## Pages

`/`, `/services`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service` (+ `404.html`).

## Where things live

- `src/data/site.json`: business identity, contact details, hours, theme colours, logo paths, lead form embed, homepage section order, SEO defaults.
- `src/data/content.json`: all section and page copy.
- `src/data/services.json`: the six services.
- `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`: policy text (values pulled from `site.json`).
- `src/components/FormEmbed.tsx` + `SmsDisclosure.tsx`: the lead form and its disclosure.
- `public/.htaccess`: clean URL rewrites, 404 page, cache headers.

## Commands

```
npm install
npm run dev          # local dev server on :8080
npm run site:theme   # site.json theme -> index.css tokens (needs network for fonts)
npm run site:seo     # site.json -> index.html head, sitemap.xml, robots.txt
npm run site:qa      # mechanical checks (identity, form, files, sitemap, placeholders)
npm run build        # client build + SSR build + prerender into dist/
npm test             # hydration, a11y and A2P checks on every prerendered page
```

## Deploy

**Vercel (primary):** import the GitHub repo in Vercel; `vercel.json` sets the Vite preset,
`npm run build`, output `dist/`, clean URLs (`/privacy-policy` serves `privacy-policy.html`),
no trailing slashes, the `404.html` page and cache headers. Add the custom domain
`malbeninc.online` in the Vercel project and point the domain's DNS at Vercel.

**Hostinger (alternative):** upload the contents of `dist/` to the domain's `public_html`;
`public/.htaccess` gives the same clean URLs on Apache/LiteSpeed.
