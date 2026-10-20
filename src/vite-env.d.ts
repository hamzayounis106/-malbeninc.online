/// <reference types="vite/client" />

declare module "virtual:brand-assets" {
  /** Logo files from site.json → logo, keyed by their public path (see build/brand-assets.ts). */
  const assets: Record<string, { src: string; width?: number; height?: number }>;
  export default assets;
}
