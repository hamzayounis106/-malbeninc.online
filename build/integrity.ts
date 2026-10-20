// Build tripwire. This repository has repeatedly received force-pushed commits
// that append an obfuscated loader to postcss.config.js and scripts/*.mjs,
// hidden after a long run of spaces so it sits off-screen. Vite loads the
// PostCSS config (and `npm run` executes the scripts) with full Node access.
//
// This check runs when vite.config.ts / vitest.config.ts are evaluated - before
// the CSS pipeline loads postcss.config.js - and refuses to continue if any
// build file has that shape. It cannot stop an injection, but it turns a silent
// code execution into a failed build everywhere, including the hosted builder.
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

const BUILD_FILES = [
  "postcss.config.js",
  "tailwind.config.ts",
  "vite.config.ts",
  "vitest.config.ts",
  "eslint.config.js",
];

// Markers are assembled from pieces so this file never matches its own search.
const MARKERS = [
  new RegExp(["global", "\\.[io]\\s*=\\s*'"].join("")),
  new RegExp(["global\\[", "'e'\\]"].join("")),
  new RegExp(["_\\$", "jso", "ToArr"].join("")),
  new RegExp(["_\\$", "_de4e"].join("")),
  new RegExp(["String\\.from", "CharCode\\(127\\)"].join("")),
  new RegExp(["create", "Require\\("].join("")),
];
const MAX_LINE = 400; // legitimate build files here top out around 250 characters

export function findIntegrityProblems(root: string): string[] {
  const scriptDir = path.join(root, "scripts");
  const files = [
    ...BUILD_FILES,
    ...(existsSync(scriptDir)
      ? readdirSync(scriptDir).filter((f) => /\.(m?js|cjs|ts)$/.test(f)).map((f) => `scripts/${f}`)
      : []),
  ].filter((f) => existsSync(path.join(root, f)));

  const problems: string[] = [];
  for (const file of files) {
    const text = readFileSync(path.join(root, file), "utf8");
    const long = text.split("\n").findIndex((l) => l.length > MAX_LINE);
    if (long !== -1) problems.push(`${file}:${long + 1} has a ${text.split("\n")[long].length}-character line`);
    for (const re of MARKERS) if (re.test(text)) problems.push(`${file} matches ${re}`);
  }
  return problems;
}

export function assertBuildIntegrity(root: string) {
  const problems = findIntegrityProblems(root);
  if (problems.length) {
    throw new Error(
      "Build refused: build files contain injected code.\n  " +
        problems.join("\n  ") +
        "\nRestore these files from a clean commit before building."
    );
  }
}
