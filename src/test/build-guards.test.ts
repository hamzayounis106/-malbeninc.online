// @vitest-environment node
// Guards for the build pipeline: supply-chain tripwire, self-hosted fonts,
// and SSR-safe component patterns.
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { findIntegrityProblems } from "../../build/integrity";
import { imageSize } from "../../build/brand-assets";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("build integrity tripwire", () => {
  it("passes on this checkout", () => {
    expect(findIntegrityProblems(process.cwd())).toEqual([]);
  });

  it("rejects an injected loader after a long run of padding", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "tripwire-"));
    mkdirSync(path.join(dir, "scripts"));
    // Shape only: legitimate code, ~1.5k spaces, then a campaign-style assignment.
    const tag = ["glo", "bal.o='0-test'"].join("");
    writeFileSync(path.join(dir, "postcss.config.js"), `export default {};${" ".repeat(1500)}${tag};`);
    writeFileSync(path.join(dir, "scripts", "x.mjs"), "console.log(1);\n");
    const problems = findIntegrityProblems(dir);
    expect(problems.some((p) => p.includes("character line"))).toBe(true);
    expect(problems.some((p) => p.includes("matches"))).toBe(true);
  });
});

describe("fonts", () => {
  const css = readFileSync("src/index.css", "utf8");
  const site = JSON.parse(readFileSync("src/data/site.json", "utf8"));

  it("are self-hosted (no third-party font stylesheet on the critical path)", () => {
    expect(css).not.toMatch(/@import\s+url\(['"]?https?:/);
    expect(readFileSync("index.html", "utf8")).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
    for (const m of css.matchAll(/src:\s*url\("\.\/(assets\/fonts\/[^"]+)"\)/g)) {
      expect(statSync(path.join("src", m[1])).size).toBeGreaterThan(1000);
    }
  });

  it("declare every theme family plus a metric-matched fallback", () => {
    for (const family of [site.theme.fontHeading, site.theme.fontBody, site.theme.fontAccent]) {
      expect(css).toContain(`font-family: '${family}';`);
      expect(css).toContain(`font-family: '${family} Fallback';`);
    }
  });
});

describe("brand assets", () => {
  it("reads intrinsic logo sizes (SVG viewBox and PNG header)", () => {
    expect(imageSize(Buffer.from('<svg xmlns="x" viewBox="0 0 240 64">'), "a.svg")).toEqual({ width: 240, height: 64 });
    expect(imageSize(Buffer.from('<svg width="120px" height="40" viewBox="0 0 240 64">'), "a.svg")).toEqual({ width: 120, height: 40 });
    const png = Buffer.alloc(24);
    png.write("\x89PNG", 0, "latin1");
    png.writeUInt32BE(512, 16);
    png.writeUInt32BE(128, 20);
    expect(imageSize(png, "a.png")).toEqual({ width: 512, height: 128 });
  });
});

describe("prerender-safe components", () => {
  const files = walk("src").filter((f) => f.endsWith(".tsx"));

  it("never render <style> with a text child (renderToString entity-escapes it)", () => {
    const offenders = files.filter((f) => /<style>\s*\{`/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("load GSAP on demand, never statically (it is not needed for first paint)", () => {
    const offenders = files.filter((f) => /^import[^;]*from\s*"(gsap|@gsap\/[^"]+|gsap\/[^"]+)"/m.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("use m.* under LazyMotion, never the full motion.* component", () => {
    const offenders = files.filter((f) => /<motion\.|import\s*\{[^}]*\bmotion\b[^}]*\}\s*from\s*"framer-motion"/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
