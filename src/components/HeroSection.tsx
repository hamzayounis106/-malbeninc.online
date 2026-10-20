import { m } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_FORM_ID, scrollToEstimateForm } from "@/components/QuoteFormContext";
import { site, phoneHref } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";
import FormEmbed from "@/components/FormEmbed";
import { SplitReveal } from "@/components/Reveal";
import { introDelay } from "@/components/PremiumLoader";

const EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Homepage hero: headline, subline and the "Get a Free Estimate" button on the
 * left, the GHL lead form card on the right (stacked below the copy on small
 * screens, where the button scrolls down to it). Image-free by design: the
 * backdrop is the brand palette (charcoal surface, gold glows, hairline grid).
 */
const HeroSection = () => {
  const { business, hero } = site;
  const intro = introDelay();

  return (
    <section id="home" className="relative overflow-hidden hero-text-bg text-accent-foreground">
      <div aria-hidden className="absolute inset-0 hero-grid-overlay opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -right-24 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.4), transparent 70%)" }}
      />

      <div className="relative z-10 container-max px-4 pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy column */}
          <div className="lg:col-span-7">
            {hero.badge && (
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: intro + 0.1, duration: 0.6, ease: EASE }}
                className="flex items-center gap-3 mb-8"
              >
                <span aria-hidden className="h-[2px] w-8 rounded-full bg-secondary" />
                <span className="text-secondary text-xs md:text-sm font-bold uppercase tracking-[0.22em]">
                  {hero.badge}
                </span>
              </m.div>
            )}

            <SplitReveal
              as="h1"
              scroll={false}
              delay={intro + 0.25}
              className="font-heading text-white font-bold tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5.75rem)", lineHeight: 1.04 }}
            >
              {hero.titleLines.map((line, i) => (
                <span key={i} className="block">
                  <Highlight text={line} className="accent-serif text-secondary" />
                </span>
              ))}
            </SplitReveal>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: intro + 0.55, duration: 0.7, ease: EASE }}
              className="text-white/85 text-lg md:text-xl mb-9 leading-relaxed max-w-xl"
            >
              {hero.subtitle}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: intro + 0.7, duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <Button
                size="lg"
                asChild
                className="gap-2 px-8 py-6 text-base md:text-lg rounded-xl shadow-[0_18px_40px_-12px_hsl(var(--primary)/0.65)] btn-glow"
              >
                <a
                  href={`#${HERO_FORM_ID}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToEstimateForm();
                  }}
                >
                  {hero.primaryCta} <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="gap-2 px-8 py-6 text-base md:text-lg rounded-xl border-2 border-white/25 text-white bg-white/5 hover:bg-white/15 hover:text-white hover:border-white/40 backdrop-blur-sm"
              >
                <a href={phoneHref}>
                  <Phone className="h-5 w-5" /> {business.phone}
                </a>
              </Button>
            </m.div>

            {hero.badges.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: intro + 0.85, duration: 0.6, ease: EASE }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2.5"
              >
                {hero.badges.map(({ icon, label }) => {
                  const Icon = getIcon(icon);
                  return (
                    <span key={label} className="inline-flex items-center gap-2 text-white/75 text-[13px] font-medium">
                      <Icon className="h-3.5 w-3.5 text-secondary" />
                      {label}
                    </span>
                  );
                })}
              </m.div>
            )}
          </div>

          {/* Lead form card */}
          <m.div
            id={HERO_FORM_ID}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro + 0.35, duration: 0.7, ease: EASE }}
            className="lg:col-span-5 relative scroll-mt-24"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium-lg bg-card text-foreground border border-border/60">
              <div
                aria-hidden
                className="h-1.5 w-full"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              />
              <div className="p-5 sm:p-7">
                <h2 className="font-heading text-2xl text-foreground mb-1 font-bold">{hero.formHeading}</h2>
                <p className="text-muted-foreground text-sm mb-5">{hero.formSubheading}</p>
                <FormEmbed idPrefix="inline" />
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
