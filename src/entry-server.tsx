// Server entry for the build-time prerender (scripts/prerender.mjs).
// Built with `vite build --ssr src/entry-server.tsx`; never shipped to browsers.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell, AppRoutes } from "./App";
import { preloadAll, pageFileFor } from "./routes";
import { setSeoSink, canonicalFor, type SeoProps } from "./components/Seo";
import { site } from "./lib/site";

/** Every URL that gets its own static page (mirrors scripts/generate-seo.mjs -> sitemap). */
export const prerenderPaths = () => ["/", "/services", "/about", "/contact", "/privacy-policy", "/terms-of-service"];

export { preloadAll, pageFileFor, canonicalFor, site };

export const render = (url: string) => {
  let seo: SeoProps | null = null;
  setSeoSink((props) => {
    seo = props;
  });
  try {
    const html = renderToString(
      <AppShell>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppShell>
    );
    return { html, seo: seo as SeoProps | null };
  } finally {
    setSeoSink(null);
  }
};
