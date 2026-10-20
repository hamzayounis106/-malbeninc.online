import { useEffect } from "react";
import { site } from "@/lib/site";

const DOMAIN = site.domain.replace(/\/$/, "");

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  /** Keep this page out of search results (the 404 page). */
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const canonicalFor = (path = "/") => `${DOMAIN}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

// The prerenderer (scripts/prerender.tsx) installs a sink here: Seo reports its
// props during the server render so each static page ships its own <head>.
let ssrSink: ((props: SeoProps) => void) | null = null;
export const setSeoSink = (sink: typeof ssrSink) => {
  ssrSink = sink;
};

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/** Per-route SEO: title, meta description, canonical, robots, and social tags. */
const Seo = (props: SeoProps) => {
  const { title, description, path = "/", noindex = false, jsonLd } = props;
  if (ssrSink) ssrSink(props);

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);

    const canonical = canonicalFor(path);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) setMeta("name", "robots", "noindex, follow");
    else robots?.remove();

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // Per-route JSON-LD structured data
    const existing = document.head.querySelectorAll('script[data-seo-jsonld="true"]');
    existing.forEach((n) => n.remove());
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo-jsonld", "true");
        s.text = JSON.stringify(block);
        document.head.appendChild(s);
      });
    }
  }, [title, description, path, noindex, jsonLd]);

  return null;
};

export default Seo;
