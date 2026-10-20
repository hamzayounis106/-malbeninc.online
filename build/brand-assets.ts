// `virtual:brand-assets` - the logo files named in src/data/site.json → logo.
//
// Clients drop logos into public/images/, but files served from public/ get no
// cache lifetime on the host. In a build this plugin emits each logo through
// Rollup instead, so it lands in /assets with a content hash (and the long
// immutable cache that comes with it). It also reads each file's intrinsic size
// so every <img> can carry width/height and reserve its box before it loads.
// The favicon and JSON-LD keep the fixed public/ URL; crawlers store those.
import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";
import type { Plugin } from "vite";

const ID = "virtual:brand-assets";
const RESOLVED = "\0" + ID;

export interface BrandAsset {
  src: string;
  width?: number;
  height?: number;
}

/** Intrinsic size of an SVG (width/height or viewBox) or PNG (IHDR). */
export function imageSize(buf: Buffer, file: string): { width?: number; height?: number } {
  if (file.endsWith(".svg")) {
    const tag = buf.toString("utf8").match(/<svg\b[^>]*>/)?.[0] ?? "";
    const num = (attr: string) => {
      const v = tag.match(new RegExp(`\\b${attr}="([\\d.]+)(px)?"`))?.[1];
      return v ? Math.round(Number(v)) : undefined;
    };
    const box = tag.match(/\bviewBox="[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/);
    return {
      width: num("width") ?? (box ? Math.round(Number(box[1])) : undefined),
      height: num("height") ?? (box ? Math.round(Number(box[2])) : undefined),
    };
  }
  if (buf.subarray(1, 4).toString("latin1") === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return {};
}

export function brandAssets(root: string): Plugin {
  let serve = false;
  return {
    name: "brand-assets",
    configResolved(config) {
      serve = config.command === "serve";
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    load(id) {
      if (id !== RESOLVED) return;
      const sitePath = path.join(root, "src", "data", "site.json");
      this.addWatchFile(sitePath);
      const logo = JSON.parse(readFileSync(sitePath, "utf8")).logo as Record<string, unknown>;
      const entries: string[] = [];
      for (const url of new Set(Object.values(logo).filter((v): v is string => typeof v === "string"))) {
        const file = path.join(root, "public", url.replace(/^\//, ""));
        if (!url.startsWith("/") || !existsSync(file)) {
          entries.push(`${JSON.stringify(url)}: { src: ${JSON.stringify(url)} }`);
          continue;
        }
        const buf = readFileSync(file);
        const size = JSON.stringify(imageSize(buf, file));
        if (serve) {
          entries.push(`${JSON.stringify(url)}: { src: ${JSON.stringify(url)}, ...${size} }`);
        } else {
          // Explicit content-hashed name (not ROLLUP_FILE_URL, which becomes a
          // file:// URL in the SSR build) so the client build and the prerender
          // agree on the exact URL.
          const ext = path.extname(file);
          const hash = createHash("sha256").update(buf).digest("base64url").slice(0, 8);
          const fileName = `assets/${path.basename(file, ext)}-${hash}${ext}`;
          this.emitFile({ type: "asset", fileName, source: buf });
          entries.push(`${JSON.stringify(url)}: { src: ${JSON.stringify("/" + fileName)}, ...${size} }`);
        }
      }
      return `export default {\n  ${entries.join(",\n  ")}\n};\n`;
    },
  };
}
