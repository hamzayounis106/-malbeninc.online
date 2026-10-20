import { lazy, type ComponentType } from "react";
import { matchPath } from "react-router-dom";
import Index from "./pages/Index";

type Loader = () => Promise<{ default: ComponentType }>;

export interface PageComponent {
  (): JSX.Element;
  /** Resolves once the page's chunk is loaded; afterwards it renders without suspending. */
  preload: () => Promise<void>;
}

/**
 * A code-split page that can be loaded ahead of rendering. The prerenderer
 * preloads every page so renderToString never meets a pending Suspense, and the
 * client preloads the current route before hydrating so the first render
 * matches the static HTML exactly.
 */
const page = (load: Loader): PageComponent => {
  let Loaded: ComponentType | null = null;
  const preload = () =>
    load().then((m) => {
      Loaded = m.default;
    });
  const Lazy = lazy(() => preload().then(() => ({ default: Loaded! })));
  const Page = (() => (Loaded ? <Loaded /> : <Lazy />)) as PageComponent;
  Page.preload = preload;
  return Page;
};

const eager = (Component: ComponentType): PageComponent => {
  const Page = (() => <Component />) as PageComponent;
  Page.preload = () => Promise.resolve();
  return Page;
};

// The homepage stays in the entry chunk: it is the most common landing page.
// `file` names the page module so the prerenderer can modulepreload its chunk
// (a test keeps it in sync with the import() next to it).
export const routes: { path: string; file: string; Page: PageComponent }[] = [
  { path: "/", file: "src/pages/Index.tsx", Page: eager(Index) },
  { path: "/services", file: "src/pages/Services.tsx", Page: page(() => import("./pages/Services")) },
  { path: "/about", file: "src/pages/About.tsx", Page: page(() => import("./pages/About")) },
  { path: "/contact", file: "src/pages/Contact.tsx", Page: page(() => import("./pages/Contact")) },
  { path: "/privacy-policy", file: "src/pages/PrivacyPolicy.tsx", Page: page(() => import("./pages/PrivacyPolicy")) },
  { path: "/terms-of-service", file: "src/pages/TermsOfService.tsx", Page: page(() => import("./pages/TermsOfService")) },
  // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
];

export const NotFoundPage = page(() => import("./pages/NotFound"));
export const NOT_FOUND_FILE = "src/pages/NotFound.tsx";

/** Source module of the page that renders `pathname`. */
export const pageFileFor = (pathname: string) =>
  routes.find((r) => matchPath(r.path, pathname))?.file ?? NOT_FOUND_FILE;

/** Load the chunk for whatever page `pathname` renders. */
export const preloadRoute = (pathname: string) =>
  (routes.find((r) => matchPath(r.path, pathname))?.Page ?? NotFoundPage).preload();

export const preloadAll = () => Promise.all([...routes.map((r) => r.Page.preload()), NotFoundPage.preload()]);
