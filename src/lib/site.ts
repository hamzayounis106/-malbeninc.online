// Single source of truth for all business-specific data.
// Per-site customization happens in src/data/*.json - never in components.
import siteJson from "@/data/site.json";
import contentJson from "@/data/content.json";
import brandAssets from "virtual:brand-assets";

export const site = siteJson;
export const content = contentJson;

export const phoneHref = `tel:${siteJson.business.phoneRaw}`;
export const mailHref = `mailto:${siteJson.business.email}`;

/** Google Maps search link for the business address. */
export const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteJson.business.addressLine
)}`;

/**
 * <img> props for a logo path from site.json -> logo: the fingerprinted build URL
 * (long cache lifetime) plus intrinsic width/height so the box is reserved.
 */
export const logoImg = (publicPath: string) => brandAssets[publicPath] ?? { src: publicPath };
