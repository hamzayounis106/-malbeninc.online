// Applies the brand theme from src/data/site.json to src/index.css.
// Rewrites (a) the FONTS block - self-hosted @font-face rules plus metric-matched
// fallback faces - and (b) the THEME block, and checks the brand colours against
// WCAG AA. Needs network access (downloads the font files from Google Fonts once).
// Usage: npm run site:theme
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { entireMetricsCollection as METRICS } from "@capsizecss/metrics/entireMetricsCollection";

const root = process.cwd();
const sitePath = path.join(root, "src", "data", "site.json");
const cssPath = path.join(root, "src", "index.css");
const fontDir = path.join(root, "src", "assets", "fonts");

const site = JSON.parse(readFileSync(sitePath, "utf8"));
const t = site.theme;

const required = ["primary", "secondary", "accent", "accentDark", "fontHeading", "fontBody"];
for (const key of required) {
  if (!t?.[key]) {
    console.error(`site.json theme.${key} is missing - aborting.`);
    process.exit(1);
  }
}

// Derive shades from the primary HSL triplet ("H S% L%")
const parseHsl = (str) => {
  const m = String(str).trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) {
    console.error(`Theme color "${str}" is not in "H S% L%" form (e.g. "215 60% 22%").`);
    process.exit(1);
  }
  return { h: +m[1], s: +m[2], l: +m[3] };
};
const p = parseHsl(t.primary);
const primaryDark = `${p.h} ${p.s}% ${Math.max(5, p.l - 10)}%`;
const primaryLight = `${p.h} ${Math.min(p.s, 60)}% 96%`;

const accentFont = t.fontAccent || "Instrument Serif";

// ---------- fonts: self-hosted, one file per family/style ----------
// Google serves these families as variable fonts, so a single latin woff2 covers
// every requested weight. Self-hosting removes the render-blocking stylesheet and
// the two-origin (googleapis -> gstatic) hop, and Vite fingerprints the files so
// they get a long cache lifetime.
const fontParam = (name, weights) =>
  `family=${name.replace(/ /g, "+")}:wght@${weights || "400;500;600;700"}`;
// Accent (serif) face ships regular + italic at 400
const accentParam = (name) => `family=${name.replace(/ /g, "+")}:ital,wght@0,400;1,400`;
const cssUrl = `https://fonts.googleapis.com/css2?${fontParam(t.fontHeading, t.fontHeadingWeights)}&${fontParam(t.fontBody, t.fontBodyWeights)}&${accentParam(accentFont)}&display=swap`;
// A modern browser UA makes Google answer with woff2 rather than ttf.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const fetchOk = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

let gfCss;
try {
  gfCss = await (await fetchOk(cssUrl)).text();
} catch (err) {
  console.error(`Could not download the font CSS from Google Fonts (${err.message}).`);
  console.error("site:theme needs network access to self-host the theme fonts - aborting.");
  process.exit(1);
}

// Keep only the `latin` subset (U+0000-00FF covers English and Spanish, incl.
// á é í ó ú ñ ü ¿ ¡) and collapse the per-weight blocks that share one file.
const faces = new Map();
for (const block of gfCss.split("@font-face").slice(1)) {
  const range = block.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim() ?? "";
  if (!range.startsWith("U+0000-00FF")) continue;
  const family = block.match(/font-family:\s*'([^']+)'/)[1];
  const style = block.match(/font-style:\s*(\w+)/)[1];
  const weight = Number(block.match(/font-weight:\s*(\d+)/)[1]);
  const url = block.match(/url\(([^)]+)\)/)[1];
  const key = `${family}|${style}|${url}`;
  const face = faces.get(key) ?? { family, style, url, range, min: weight, max: weight };
  face.min = Math.min(face.min, weight);
  face.max = Math.max(face.max, weight);
  faces.set(key, face);
}
if (faces.size === 0) {
  console.error("Google Fonts returned no latin faces for the theme fonts - check the family names.");
  process.exit(1);
}

mkdirSync(fontDir, { recursive: true });
const written = new Set();
for (const face of faces.values()) {
  face.file = `${slug(face.family)}-${face.style}-latin.woff2`;
  const buf = Buffer.from(await (await fetchOk(face.url)).arrayBuffer());
  if (buf.subarray(0, 4).toString("latin1") !== "wOF2") {
    console.error(`${face.url} is not a woff2 file - aborting.`);
    process.exit(1);
  }
  writeFileSync(path.join(fontDir, face.file), buf);
  written.add(face.file);
}
// Drop fonts left behind by a previous theme.
for (const f of readdirSync(fontDir)) {
  if (f.endsWith(".woff2") && !written.has(f)) unlinkSync(path.join(fontDir, f));
}

// Metric-matched fallbacks: while the web font loads, text renders in a local
// system face scaled to the same width and line metrics, so the swap does not
// shift the layout. Metrics come from @capsizecss/metrics.
const camel = (name) =>
  name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean)
    .map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1))).join("");
const SANS_LOCAL = `local("Arial"), local("Helvetica Neue"), local("Helvetica"), local("Liberation Sans"), local("Arimo")`;
const SERIF_LOCAL = `local("Times New Roman"), local("Liberation Serif"), local("Tinos")`;
const pct = (n) => `${(n * 100).toFixed(2)}%`;

const fallbackFace = (family, serif) => {
  const m = METRICS[camel(family)];
  if (!m) {
    console.warn(`No capsize metrics for "${family}" - its fallback will not be metric-matched.`);
    return "";
  }
  const base = serif ? METRICS.timesNewRoman : METRICS.arial;
  const size = m.xWidthAvg / m.unitsPerEm / (base.xWidthAvg / base.unitsPerEm);
  return `@font-face {
  font-family: '${family} Fallback';
  src: ${serif ? SERIF_LOCAL : SANS_LOCAL};
  size-adjust: ${pct(size)};
  ascent-override: ${pct(m.ascent / m.unitsPerEm / size)};
  descent-override: ${pct(Math.abs(m.descent) / m.unitsPerEm / size)};
  line-gap-override: ${pct(m.lineGap / m.unitsPerEm / size)};
}`;
};

const families = [
  { name: t.fontHeading, serif: false },
  { name: t.fontBody, serif: false },
  { name: accentFont, serif: true },
].filter((f, i, all) => all.findIndex((g) => g.name === f.name) === i);

const faceRules = [...faces.values()].map(
  (f) => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.min === f.max ? f.min : `${f.min} ${f.max}`};
  font-display: swap;
  src: url("./assets/fonts/${f.file}") format("woff2");
  unicode-range: ${f.range};
}`
);

const fontsBlock = `/* FONTS:START - auto-generated from src/data/site.json by \`npm run site:theme\`. Do not edit by hand. */
${[...faceRules, ...families.map((f) => fallbackFace(f.name, f.serif)).filter(Boolean)].join("\n")}
/* FONTS:END */`;

// ---------- theme tokens ----------
const stack = (name, serif) => `'${name}', '${name} Fallback', ${serif ? "Georgia, serif" : "sans-serif"}`;

const themeBlock = `/* THEME:START - auto-generated from src/data/site.json. Run \`npm run site:theme\` after editing theme colors/fonts. Do not edit by hand. */
@layer base {
  :root {
    --primary: ${t.primary};
    --primary-foreground: ${t.primaryForeground || "0 0% 100%"};
    --primary-dark: ${primaryDark};
    --primary-light: ${primaryLight};
    --secondary: ${t.secondary};
    --secondary-foreground: ${t.secondaryForeground || "0 0% 100%"};
    --accent: ${t.accent};
    --accent-foreground: ${t.accentForeground || "0 0% 100%"};
    --accent-dark: ${t.accentDark};
    --ring: ${t.primary};
    --font-heading: ${stack(t.fontHeading)};
    --font-body: ${stack(t.fontBody)};
    --font-accent: ${stack(accentFont, true)};
  }
}
/* THEME:END */`;

let css = readFileSync(cssPath, "utf8");

// Older copies of this file start with a Google Fonts @import instead of the FONTS block.
css = css.replace(/^@import url\('https:\/\/fonts\.googleapis\.com[^\n]*\n/, "");
if (/\/\* FONTS:START[\s\S]*?\/\* FONTS:END \*\//.test(css)) {
  css = css.replace(/\/\* FONTS:START[\s\S]*?\/\* FONTS:END \*\//, () => fontsBlock);
} else {
  css = fontsBlock + "\n\n" + css.replace(/^\s+/, "");
}

if (/\/\* THEME:START[\s\S]*?\/\* THEME:END \*\//.test(css)) {
  css = css.replace(/\/\* THEME:START[\s\S]*?\/\* THEME:END \*\//, () => themeBlock);
} else {
  css = css.trimEnd() + "\n\n" + themeBlock + "\n";
}

writeFileSync(cssPath, css);

// ---------- contrast check (WCAG AA, 4.5:1 for body-size text) ----------
const hslToRgb = ({ h, s, l }) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(hslToRgb(parseHsl(a))), lum(hslToRgb(parseHsl(b)))];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const PAGE_BG = "210 25% 98%";
const pairs = [
  ["primary-foreground on primary (buttons)", t.primaryForeground || "0 0% 100%", t.primary],
  ["primary as text on the page background", t.primary, PAGE_BG],
  ["secondary-foreground on secondary", t.secondaryForeground || "0 0% 100%", t.secondary],
  ["secondary as text on accent surfaces", t.secondary, t.accent],
];
const failing = pairs.filter(([, a, b]) => ratio(a, b) < 4.5);
for (const [label, a, b] of failing) {
  console.warn(`Contrast: ${label} is ${ratio(a, b).toFixed(2)}:1 (WCAG AA needs 4.5:1).`);
}
if (failing.some(([label]) => label.includes("primary"))) {
  // Smallest lightness change that clears both primary pairs, hue/saturation kept.
  for (let l = p.l; l >= 0; l -= 0.5) {
    const cand = `${p.h} ${p.s}% ${l}%`;
    if (ratio(t.primaryForeground || "0 0% 100%", cand) >= 4.5 && ratio(cand, PAGE_BG) >= 4.5) {
      console.warn(`  -> theme.primary "${cand}" is the nearest AA-compliant shade (currently "${t.primary}").`);
      break;
    }
  }
}

console.log("Theme applied:", {
  primary: t.primary,
  secondary: t.secondary,
  accent: t.accent,
  fonts: `${t.fontHeading} / ${t.fontBody} / ${accentFont} (${faces.size} self-hosted files)`,
});
