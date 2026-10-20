import { m } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { content, site, phoneHref } from "@/lib/site";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";

/**
 * Editorial conversion band - hairline-framed, oversized headline with serif
 * accent, CTA cluster on the right. Data: content.json → ctaBanner
 */
const CTABanner = () => {
  const { openQuoteForm } = useQuoteForm();
  const data = content.ctaBanner;
  if (!data?.heading) return null;

  return (
    <section className="bg-background">
      <div className="container-max px-4 max-w-[1200px]">
        <div className="border-t border-b border-border/80 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Headline */}
            <div className="lg:col-span-8">
              <m.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="eyebrow-pill mb-6"
              >
                {data.eyebrow}
              </m.span>
              <SplitReveal
                as="h2"
                className="font-heading text-foreground font-bold tracking-[-0.02em] leading-[1.08]"
                style={{ fontSize: "clamp(2.5rem, 5.2vw, 4.75rem)" }}
              >
                <Highlight text={data.heading} />
              </SplitReveal>
              <m.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-xl"
              >
                {data.sub}
              </m.p>
            </div>

            {/* CTA cluster */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="lg:col-span-4 flex flex-col items-start lg:items-end gap-5"
            >
              <Button
                size="lg"
                onClick={openQuoteForm}
                className="group gap-3 rounded-full px-8 py-7 text-base btn-glow"
              >
                Get Free Estimate
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Button>
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2.5 text-foreground font-semibold hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                {site.business.phone}
              </a>
              {data.bullets?.length > 0 && (
                <ul className="mt-2 space-y-2 lg:text-right">
                  {data.bullets.map((line) => (
                    <li
                      key={line}
                      className="flex lg:flex-row-reverse items-center gap-2 text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.18em]"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
