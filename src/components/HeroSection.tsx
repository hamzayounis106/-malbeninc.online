import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm, ESTIMATE_SECTION_ID } from "@/components/QuoteFormContext";
import { site, phoneHref } from "@/lib/site";
import { services } from "@/lib/services-data";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";
import { introDelay } from "@/components/PremiumLoader";

const EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Homepage hero: headline, subline and the "Get a Free Estimate" button that
 * scrolls to the lead form, plus a services card. Image-free by design: the
 * backdrop is the brand palette (charcoal surface, gold glows, hairline grid).
 */
const HeroSection = () => {
  const { openQuoteForm } = useQuoteForm();
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
                  href={`#${ESTIMATE_SECTION_ID}`}
                  onClick={(e) => {
                    e.preventDefault();
                    openQuoteForm();
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

          {/* Services card */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro + 0.35, duration: 0.7, ease: EASE }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium-lg bg-card text-foreground border border-border/60">
              <div
                aria-hidden
                className="h-1.5 w-full"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              />
              <div className="p-6 md:p-7">
                <div className="eyebrow-pill mb-2">{hero.cardHeading}</div>
                <p className="text-muted-foreground text-sm mb-5">{hero.cardSub}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((s) => {
                    const Icon = getIcon(s.icon);
                    return (
                      <li key={s.slug}>
                        <Link
                          to="/services"
                          className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background px-3.5 py-3 hover:border-primary/40 hover:bg-primary-light transition-colors"
                        >
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Icon className="h-4 w-4" strokeWidth={1.9} />
                          </span>
                          <span className="font-semibold text-[13.5px] text-foreground leading-tight">{s.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 pt-5 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" /> {business.hoursShort}
                  </span>
                  <a href={phoneHref} className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-primary" /> {business.phone}
                  </a>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
