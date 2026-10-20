import { useEffect, useRef, useState } from "react";
import { site, logoImg } from "@/lib/site";

const LOGO = logoImg(site.logo.loader);
const COUNT_MS = 1100;
const HOLD_MS = 120;
const CURTAIN_MS = 650;

// First-load boot flag: heroes read introDelay() to hold their entrance
// animations until the curtain lifts. Zero on client-side navigations.
let booting = true;
export const introDelay = () => (booting ? 1.45 : 0);

interface Props {
  onDone?: () => void;
}

/** Boot curtain: logo, counting percentage, progress bar, then slides up. */
const PremiumLoader = ({ onDone }: Props) => {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      booting = false;
      setRemoved(true);
      doneRef.current?.();
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hideTimer = window.setTimeout(() => setHiding(true), COUNT_MS + HOLD_MS);
    const removeTimer = window.setTimeout(() => {
      booting = false;
      setRemoved(true);
      doneRef.current?.();
    }, COUNT_MS + HOLD_MS + CURTAIN_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden={hiding}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, hsl(var(--accent)) 0%, hsl(var(--accent-dark)) 75%)",
        transform: hiding ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${CURTAIN_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        willChange: "transform",
      }}
    >
      <div className="relative flex flex-col items-center px-6">
        <div
          className="absolute -inset-16 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.45) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <img {...LOGO} alt="" aria-hidden="true" className="relative h-16 w-auto mb-7" />

        <p
          className="relative text-[10px] uppercase text-white/50 font-semibold mb-3"
          style={{ letterSpacing: "0.35em" }}
        >
          {site.business.name}
        </p>

        <p
          className="relative font-heading font-bold text-4xl text-secondary leading-none notranslate"
          translate="no"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(progress).padStart(3, "0")}
        </p>

        <div className="relative mt-6 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full rounded-full"
            style={{
              // scaleX from the left edge instead of width: same look, but it
              // runs on the compositor instead of re-laying out every frame.
              transform: `scaleX(${progress / 100})`,
              transformOrigin: "left center",
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
              transition: "transform 120ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
