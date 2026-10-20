import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Site translation toggle, driven by site.json → "languages" (e.g. ["en", "es"]).
 * The first code is the language the copy is written in. With one language the
 * toggle renders nothing. With more, Google's page translator is loaded hidden
 * and our own pill switches languages instantly (no reload), persisted by cookie.
 */
const LANGS: string[] = (site as { languages?: string[] }).languages?.filter(Boolean) ?? ["en"];
const SOURCE = LANGS[0] ?? "en";
export const isMultilingual = LANGS.length > 1;

declare global {
  interface Window {
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

// Tiny shared store so every toggle (and any component that renders
// per-language content) reflects the same active language.
let current = SOURCE;
const listeners = new Set<() => void>();
const setCurrent = (code: string) => {
  current = code;
  listeners.forEach((fn) => fn());
};

/** Active site language code (first entry of site.json → languages by default). */
export const useSiteLanguage = (): string => {
  const [lang, setLang] = useState(current);
  useEffect(() => {
    if (isMultilingual) {
      current = readCookieLang();
      setLang(current);
    }
    const fn = () => setLang(current);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return lang;
};

const readCookieLang = (): string => {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return SOURCE;
  const target = decodeURIComponent(match[1]).split("/")[2];
  return target && LANGS.includes(target) ? target : SOURCE;
};

const writeCookieLang = (code: string) => {
  const reset = code === SOURCE;
  const value = reset ? "" : `/${SOURCE}/${code}`;
  const expires = reset ? "Thu, 01 Jan 1970 00:00:00 GMT" : new Date(Date.now() + 365 * 864e5).toUTCString();
  document.cookie = `googtrans=${value}; path=/; expires=${expires}`;
  document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}; expires=${expires}`;
};

/**
 * Guard against the well-known React + Google Translate crash: Translate wraps
 * text nodes in <font> tags, so React's later removeChild/insertBefore on the
 * original node throws. Skipping those calls is the accepted mitigation.
 */
const patchDomForTranslate = () => {
  const w = window as unknown as { __translatePatched?: boolean };
  if (w.__translatePatched || typeof Node !== "function") return;
  w.__translatePatched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
};

/** Mount once in App. Loads the hidden translator only for multilingual sites. */
export const TranslateProvider = () => {
  useEffect(() => {
    if (!isMultilingual) return;
    patchDomForTranslate();

    if (!document.getElementById("google_translate_element")) {
      const host = document.createElement("div");
      host.id = "google_translate_element";
      host.className = "notranslate";
      host.style.display = "none";
      document.body.appendChild(host);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: SOURCE, includedLanguages: LANGS.join(","), autoDisplay: false },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
};

interface ToggleProps {
  /** "dark" for the navy top bar, "light" for white surfaces (navbar, mobile drawer) */
  variant?: "dark" | "light";
  className?: string;
}

export const LanguageToggle = ({ variant = "dark", className = "" }: ToggleProps) => {
  const active = useSiteLanguage();

  if (!isMultilingual) return null;

  const switchTo = (code: string) => {
    if (code === active) return;
    writeCookieLang(code);
    setCurrent(code);
    if (code === SOURCE) {
      // Restoring the original language reliably needs a fresh load
      window.location.reload();
      return;
    }
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      window.location.reload();
    }
  };

  const dark = variant === "dark";
  const shell = dark
    ? "border-white/20 bg-white/5"
    : "border-border bg-muted/60";
  const activeCls = dark ? "bg-secondary text-accent" : "bg-primary text-primary-foreground";
  const idleCls = dark ? "text-white/70 hover:text-white" : "text-foreground/65 hover:text-foreground";

  return (
    <div
      role="group"
      aria-label="Site language"
      className={`notranslate inline-flex items-center gap-0.5 rounded-full border p-0.5 ${shell} ${className}`}
      translate="no"
    >
      <Languages className={`h-3.5 w-3.5 ml-1.5 mr-0.5 ${dark ? "text-secondary" : "text-primary"}`} aria-hidden />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={active === code}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
            active === code ? activeCls : idleCls
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
