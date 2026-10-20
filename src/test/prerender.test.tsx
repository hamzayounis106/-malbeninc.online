// Every prerendered page must hydrate without a mismatch, and its markup must
// meet the structural accessibility/SEO rules Lighthouse checks. Vitest runs
// React's development build, which names hydration mismatches explicitly.
// The A2P checks make sure the lead form stays in place on Home and Contact.
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { readFileSync } from "fs";
import App from "@/App";
import { render, prerenderPaths, preloadAll } from "@/entry-server";
import { routes, pageFileFor, preloadRoute } from "@/routes";
import { site } from "@/lib/site";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const paths = [...prerenderPaths(), "/404"];
let root: Root | null = null;

beforeAll(async () => {
  await preloadAll();
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

const parse = (html: string) => new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

describe.each(paths)("prerendered %s", (path) => {
  it("hydrates without mismatches", async () => {
    const { html, seo } = render(path);
    expect(seo, "every page renders <Seo>").toBeTruthy();

    document.body.innerHTML = `<div id="root">${html}</div>`;
    window.history.pushState({}, "", path);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    await preloadRoute(path);
    await act(async () => {
      root = hydrateRoot(document.getElementById("root")!, <App />);
      await new Promise((r) => setTimeout(r, 30));
    });
    const messages = errors.mock.calls.map((c) => c.map(String).join(" "));
    errors.mockRestore();
    expect(messages.filter((m) => /hydrat|did not match|server rendered/i.test(m))).toEqual([]);
  });

  it("has sound heading, image, link and control semantics", () => {
    const { html, seo } = render(path);
    const doc = parse(html);

    const levels = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
    expect(levels.filter((l) => l === 1), "exactly one h1").toHaveLength(1);
    expect(levels[0], "first heading is the h1").toBe(1);
    levels.forEach((l, i) => {
      if (i > 0) expect(l - levels[i - 1], `no skipped heading level (h${levels[i - 1]} -> h${l})`).toBeLessThanOrEqual(1);
    });

    doc.querySelectorAll("img").forEach((img) => expect(img.hasAttribute("alt"), img.outerHTML).toBe(true));
    doc.querySelectorAll("iframe").forEach((f) => expect(f.getAttribute("title"), f.outerHTML).toBeTruthy());
    expect(doc.querySelectorAll("a a, a button, button a, button button").length, "nested interactive").toBe(0);
    doc.querySelectorAll("a[href], button").forEach((el) => {
      const name =
        (el.getAttribute("aria-label") || el.textContent || "").trim() ||
        [...el.querySelectorAll("img[alt]")].map((i) => i.getAttribute("alt")).join("");
      expect(name, `accessible name for ${el.outerHTML.slice(0, 120)}`).not.toBe("");
    });
    doc.querySelectorAll("[tabindex]").forEach((el) => expect(Number(el.getAttribute("tabindex"))).toBeLessThanOrEqual(0));

    expect(seo!.title.length).toBeGreaterThan(10);
    expect(seo!.description.length).toBeGreaterThan(50);
    expect(Boolean(seo!.noindex)).toBe(path === "/404");
  });

  it("has no em dashes, template placeholders or demo brand names", () => {
    const { html } = render(path);
    const text = parse(html).body.textContent ?? "";
    expect(text).not.toContain(String.fromCharCode(0x2014));
    expect(text).not.toMatch(/\{\{|\[Company|lorem ipsum/i);
    expect(text).not.toMatch(/summit home|isma builders|springfield/i);
  });

  if (path !== "/404") {
    it("footer links both policies and shows the legal name, address and phone", () => {
      const doc = parse(render(path).html);
      const footer = doc.querySelector("footer")!;
      expect(footer.querySelector('a[href="/privacy-policy"]')).toBeTruthy();
      expect(footer.querySelector('a[href="/terms-of-service"]')).toBeTruthy();
      const text = footer.textContent ?? "";
      expect(text).toContain(site.business.legalName);
      expect(text).toContain(site.business.address.street);
      expect(text).toContain(site.business.phone);
    });

    it("has no form fields of its own (only the consented GHL widget)", () => {
      const doc = parse(render(path).html);
      expect(doc.querySelectorAll("form, input, textarea, select").length).toBe(0);
    });
  }
});

describe.each([
  ["/", 2],
  ["/contact", 1],
])("lead form on %s", (path, copies) => {
  it("renders the GHL form in its min-height container, with unique ids per copy", () => {
    const doc = parse(render(path).html);
    const frames = [...doc.querySelectorAll("iframe")];
    expect(frames).toHaveLength(copies);
    const base = `inline-${site.widgets.quoteForm.formId}`;
    expect(frames.map((f) => f.id)).toEqual(copies === 1 ? [base] : [base, `${base}-2`]);
    for (const frame of frames) {
      expect(frame.getAttribute("src")).toBe(site.widgets.quoteForm.src);
      expect(frame.getAttribute("data-form-id")).toBe(site.widgets.quoteForm.formId);
      expect(frame.getAttribute("data-layout-iframe-id")).toBe(frame.id);
      expect(frame.getAttribute("data-cookie-consent")).toBe("true");
      expect(Number.parseInt(frame.parentElement!.style.minHeight, 10)).toBeGreaterThanOrEqual(770);
    }

  });
});

describe("policy pages", () => {
  it("privacy policy carries the carrier-required sentences", () => {
    const text = parse(render("/privacy-policy").html).body.textContent ?? "";
    expect(text).toContain("No mobile information will be shared with third parties/affiliates for marketing/promotional purposes");
    expect(text).toContain("exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties");
    expect(text).toContain('replying "STOP"');
    expect(text).toContain('Reply "HELP"');
    expect(text).not.toMatch(/\d{2}-\d{7}/); // no EIN
  });

  it("terms of service carry the SMS program section", () => {
    const text = parse(render("/terms-of-service").html).body.textContent ?? "";
    for (const s of [
      "SMS Messaging Terms & Compliance",
      "Program Description",
      'text "STOP"',
      'keyword "HELP"',
      "Carriers are not liable for delayed or undelivered messages",
      "Message and data rates may apply",
      "Message frequency varies",
      `${site.domain}/privacy-policy`,
    ]) {
      expect(text).toContain(s);
    }
  });
});

describe("route table", () => {
  it("names the module each lazy route imports", () => {
    const src = readFileSync("src/routes.tsx", "utf8");
    for (const r of routes) {
      if (r.file.endsWith("Index.tsx")) continue;
      const name = r.file.replace(/^src\/pages\/|\.tsx$/g, "");
      expect(src).toContain(`file: "${r.file}", Page: page(() => import("./pages/${name}"))`);
    }
    expect(pageFileFor("/privacy-policy")).toBe("src/pages/PrivacyPolicy.tsx");
    expect(pageFileFor("/terms-of-service")).toBe("src/pages/TermsOfService.tsx");
    expect(pageFileFor("/no/such/page")).toBe("src/pages/NotFound.tsx");
  });
});
