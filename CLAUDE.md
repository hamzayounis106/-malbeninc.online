# malbeninc.online (MALBEN, INC.)

Small, A2P 10DLC compliant website for a renovation company in Miami, FL. It started
from the Remodel Artisan Pro engine and was cut down to six pages. Business facts live
in `src/data/*.json`; components never hardcode a name, phone, email or colour.

## Compliance rules (do not regress)

- The GoHighLevel form (`site.json -> widgets.quoteForm`) renders through `FormEmbed`
  on the Home page (`EstimateSection`) and the Contact page. The SMS consent wording and
  policy links live inside the GHL form itself (configured in GoHighLevel, not here).
- No other form, input, newsletter box or popup form anywhere on the site
  (`npm test` enforces this).
- The footer on every page links both policies and shows the legal name, address and phone.
- The EIN is never shown anywhere.
- No em dashes in copy. No invented stats, years in business, licences, awards or reviews.
- Keep `/privacy-policy` and `/terms-of-service` text as supplied by the client; only the
  business values are substituted (`site.json`).

## Build and deploy

- `npm run build` = client build + SSR build + `scripts/prerender.mjs`, which writes one
  flat HTML file per route into `dist/` (`services.html`, `privacy-policy.html`, ...)
  plus `404.html`. `public/.htaccess` maps clean URLs onto those files on Hostinger.
- `npm run site:seo` regenerates `index.html` head, `sitemap.xml` and `robots.txt`.
  `npm run site:qa` and `npm test` must pass before pushing.
- Deploy target is Vercel (`vercel.json`: Vite preset, output `dist/`, cleanUrls, no trailing
  slash) with Hostinger as the fallback (SFTP upload of `dist/`, `public/.htaccess`). Not Lovable.

## Design notes

- Palette is taken from the logo pixels: gold `36 60% 36%` (primary), light gold
  `38 62% 58%` (secondary, highlights on dark surfaces), charcoal `0 0% 11%` (accent).
  Neutral tokens are warm cream/charcoal in `src/index.css`.
- No raster photos: heroes use the charcoal/gold CSS backdrop, services use icons.
- framer-motion as `m.*` under `LazyMotion`; GSAP loaded on demand in `Reveal.tsx`;
  Lenis smooth scrolling (use `getLenis()?.scrollTo`).
