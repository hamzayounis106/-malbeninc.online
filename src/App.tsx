import { Suspense, memo, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import { TranslateProvider } from "./components/LanguageToggle";
import { QuoteFormProvider } from "./components/QuoteFormContext";
import PremiumLoader from "./components/PremiumLoader";
import { routes, NotFoundPage } from "./routes";

// Routes live in their own memoised component with no props, so loader state
// changes in the shell never re-render the route tree (which would also abort
// hydration of a prerendered page).
const Pages = memo(() => (
  <Suspense fallback={null}>
    <Routes>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
));
Pages.displayName = "Pages";

/** Everything inside the router: shared by the browser app and the prerenderer. */
export const AppRoutes = () => (
  <QuoteFormProvider>
    <ScrollToTop />
    <Pages />
  </QuoteFormProvider>
);

// LazyMotion + m.* ships only the animation features the site uses; `strict`
// throws if a full `motion.*` component sneaks back in and re-bloats the bundle.
export const AppShell = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    <PremiumLoader />
    <SmoothScroll />
    <ScrollProgress />
    <TranslateProvider />
    {children}
  </LazyMotion>
);

const App = () => (
  <AppShell>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppShell>
);

export default App;
