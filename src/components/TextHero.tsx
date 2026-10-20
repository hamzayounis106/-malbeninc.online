import { m } from "framer-motion";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

type Crumb = { label: string; to?: string };

interface TextHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  meta?: ReactNode;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; href: string };
}

const TextHero = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  meta,
  primaryCta,
  secondaryCta,
}: TextHeroProps) => {
  const { openQuoteForm } = useQuoteForm();

  return (
    <section className="relative overflow-hidden hero-text-bg text-accent-foreground">
      <div aria-hidden="true" className="absolute inset-0 hero-grid-overlay opacity-60" />
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.35), transparent 70%)" }}
      />

      <div className="relative z-10 container-max px-4 pt-36 pb-16 md:pt-44 md:pb-24">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex justify-center mb-5">
              <PageBreadcrumbs variant="dark" items={breadcrumbs} />
            </div>
          )}

          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 backdrop-blur border border-primary/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-5">
              <Sparkles className="h-3 w-3" /> {eyebrow}
            </span>
          )}

          <h1
            className="font-heading font-bold text-accent-foreground tracking-tight leading-[1.05] mb-4"
            style={{ fontSize: "clamp(2.25rem, 4.6vw, 4rem)" }}
          >
            {title}
          </h1>

          {meta && <div className="mb-4">{meta}</div>}

          {subtitle && (
            <p
              className="text-accent-foreground/85 max-w-2xl mx-auto mb-7"
              style={{ fontSize: "clamp(1rem, 1.25vw, 1.2rem)", lineHeight: 1.55 }}
            >
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              {primaryCta && (
                <Button
                  size="lg"
                  onClick={primaryCta.onClick || openQuoteForm}
                  className="gap-2 rounded-xl px-7 shadow-[0_18px_40px_-12px_hsl(var(--primary)/0.6)]"
                >
                  {primaryCta.label} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur"
                >
                  <a href={secondaryCta.href}>
                    <Phone className="h-4 w-4" /> {secondaryCta.label}
                  </a>
                </Button>
              )}
            </div>
          )}
        </m.div>
      </div>

      <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-12 leading-none">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="block w-full h-full">
          <path d="M0 24C240 48 480 48 720 24C960 0 1200 0 1440 24V48H0V24Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default TextHero;