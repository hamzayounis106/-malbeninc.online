import { useEffect } from "react";
import type Lenis from "lenis";

let instance: Lenis | null = null;
let wake: (() => void) | null = null;

/**
 * The active Lenis instance (null when reduced motion is preferred).
 * Calling this also wakes the rAF loop, so it's safe to immediately
 * call `.scrollTo(...)` on the result.
 */
export const getLenis = () => {
  wake?.();
  return instance;
};

/**
 * Site-wide buttery smooth scrolling (Lenis). The rAF loop sleeps after
 * ~1.5s of inactivity and wakes on input, so an idle page costs nothing.
 * Disabled automatically for users who prefer reduced motion. Mount once in App.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis is imported after mount so it never delays first paint; native
    // scrolling works in the meantime.
    let teardown: (() => void) | undefined;
    let disposed = false;
    import("lenis").then(({ default: LenisCtor }) => {
      if (disposed) return;
      teardown = start(LenisCtor);
    });
    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return null;
};

function start(LenisCtor: typeof Lenis) {
    const lenis = new LenisCtor({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    instance = lenis;

    let rafId: number | null = null;
    let idleTimer: number | undefined;

    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    const scheduleSleep = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }, 1500);
    };
    const wakeLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(loop);
      scheduleSleep();
    };
    wake = wakeLoop;

    lenis.on("scroll", scheduleSleep);
    window.addEventListener("wheel", wakeLoop, { passive: true });
    window.addEventListener("touchstart", wakeLoop, { passive: true });
    window.addEventListener("keydown", wakeLoop);
    wakeLoop();

    return () => {
      window.removeEventListener("wheel", wakeLoop);
      window.removeEventListener("touchstart", wakeLoop);
      window.removeEventListener("keydown", wakeLoop);
      window.clearTimeout(idleTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.destroy();
      instance = null;
      wake = null;
    };
}

export default SmoothScroll;
