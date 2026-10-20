import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { content } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";

/** Homepage "How It Works": a simple three-step timeline. Data: content.json -> process */
const ProcessSection = () => {
  const { openQuoteForm } = useQuoteForm();
  const data = content.process;
  if (!data?.steps?.length) return null;

  return (
    <section className="relative section-padding bg-muted/40 overflow-hidden">
      <div className="container-max relative max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <m.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow-pill mb-5"
            >
              {data.eyebrow}
            </m.span>
            <SplitReveal
              as="h2"
              className="font-heading text-foreground tracking-tight font-bold leading-[1.1]"
              style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)" }}
            >
              <Highlight text={data.heading} />
            </SplitReveal>
            {data.intro && (
              <m.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg leading-relaxed mt-5 max-w-[520px]"
              >
                {data.intro}
              </m.p>
            )}
          </div>
          <Button size="lg" onClick={openQuoteForm} className="self-start lg:self-end gap-2 btn-glow shrink-0 rounded-full px-6">
            Get a Free Estimate <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="hidden md:block absolute top-7 left-[calc(16.66%-28px)] right-[calc(16.66%-28px)] h-[2px]"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.15) 60%, transparent)" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
            {data.steps.map((step, i) => {
              const Icon = getIcon(step.icon);
              return (
                <m.div
                  key={step.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none select-none absolute -top-6 right-0 font-heading font-bold text-[5.5rem] leading-none text-foreground/[0.05]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-background border-2 border-primary/30 text-primary shadow-sm mb-6">
                    <Icon className="h-6 w-6" strokeWidth={1.85} />
                    <span className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl text-foreground font-bold tracking-tight mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[34ch]">{step.desc}</p>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
