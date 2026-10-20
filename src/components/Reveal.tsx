import { CSSProperties, ReactNode, useEffect, useRef } from "react";

type GsapKit = {
  gsap: typeof import("gsap").gsap;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

// GSAP is loaded on demand, not in the entry bundle: nothing it animates is
// needed for first paint (the hero headline waits for the boot curtain anyway).
let kit: Promise<GsapKit> | null = null;
const loadGsap = () =>
  (kit ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
    ([g, st, sp]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
      return { gsap: g.gsap, SplitText: sp.SplitText };
    }
  ));

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Split only after webfonts are ready - splitting during a font swap re-flows
// lines mid-animation and can strand a line inside its mask.
const fontsReady = () =>
  document.fonts?.status === "loaded" ? Promise.resolve() : (document.fonts?.ready ?? Promise.resolve()).catch(() => {});

/**
 * Run `setup` once `el` is within half a viewport of the screen. Splitting text
 * measures layout, so doing it lazily keeps every below-the-fold headline off
 * the startup path (the reveal itself still fires at the same scroll position).
 */
const whenNear = (el: Element, setup: () => void) => {
  if (typeof IntersectionObserver === "undefined") {
    setup();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        setup();
      }
    },
    { rootMargin: "0px 0px 50% 0px" }
  );
  io.observe(el);
  return () => io.disconnect();
};

interface SplitRevealProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  start?: string;
  /** false = play immediately on mount (hero headlines) instead of on scroll */
  scroll?: boolean;
}

/**
 * Masked line-by-line headline reveal (Enciat-style). Lines rise out of an
 * invisible mask, then the split is reverted so descenders stop clipping.
 */
export const SplitReveal = ({
  children,
  as: Tag = "h2",
  className = "",
  style,
  delay = 0,
  start = "top 86%",
  scroll = true,
}: SplitRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: ReturnType<GsapKit["gsap"]["context"]> | null = null;

    const setup = () => {
      Promise.all([loadGsap(), fontsReady()]).then(([{ gsap, SplitText }]) => {
        if (cancelled || !el.isConnected) return;
        ctx = gsap.context(() => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.3,
                ease: "power4.out",
                stagger: 0.09,
                delay,
                ...(scroll ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
                onComplete: () => self.revert(),
              }),
          });
        }, el);
      });
    };

    const stop = scroll ? whenNear(el, setup) : (setup(), () => {});
    return () => {
      cancelled = true;
      stop();
      ctx?.revert();
    };
  }, [delay, scroll, start]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
};

interface ParallaxImgProps {
  src: string;
  alt?: string;
  /** yPercent drift range; 8–12 is subtle, 15+ is dramatic */
  speed?: number;
  className?: string;
  imgClassName?: string;
}

/** Image with a slow scroll-scrubbed parallax inside an overflow-hidden frame. */
export const ParallaxImg = ({ src, alt = "", speed = 10, className = "", imgClassName = "" }: ParallaxImgProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: ReturnType<GsapKit["gsap"]["context"]> | null = null;
    const stop = whenNear(el, () => {
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          gsap.fromTo(
            el.querySelector("img"),
            { yPercent: -speed },
            {
              yPercent: speed,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }, el);
      });
    });
    return () => {
      cancelled = true;
      stop();
      ctx?.revert();
    };
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-[120%] w-full scale-105 object-cover ${imgClassName}`}
      />
    </div>
  );
};
