import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { preloadRoute } from "./routes";
import "./index.css";

const container = document.getElementById("root")!;

// Production pages are prerendered (scripts/prerender.mjs): load the current
// page's chunk first so hydration renders exactly what the static HTML shows.
// The dev server serves an empty shell, so it renders from scratch.
if (container.firstElementChild) {
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => hydrateRoot(container, <App />));
} else {
  createRoot(container).render(<App />);
}
