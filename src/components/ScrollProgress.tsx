import { m, useScroll, useSpring } from "framer-motion";

/** Slim scroll-progress bar fixed to the very top of the viewport. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  return (
    <m.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
      }}
    />
  );
};

export default ScrollProgress;
