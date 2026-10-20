import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/components/SmoothScroll";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Jump to top instantly on route change
  // (deferred a frame so it never forces layout inside React's commit)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Track scroll for button visibility
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <m.button
            key="scroll-top"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-8 left-6 z-[60] h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.5)] backdrop-blur border border-primary/30 flex items-center justify-center hover:scale-110 hover:shadow-[0_12px_32px_-6px_hsl(var(--primary)/0.6)] transition-all duration-300"
          >
            <ArrowUp className="h-5 w-5" />
          </m.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollToTop;
