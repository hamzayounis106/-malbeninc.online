import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { content } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";

/** Homepage "Why choose us": a short numbered list of commitments. Data: content.json -> whyChooseUs */
const WhyChooseUs = () => {
  const { openQuoteForm } = useQuoteForm();
  const data = content.whyChooseUs;
  const reasons = data.reasons;

  return (
    <section className="relative section-padding bg-background overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-[0.18] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-[0.14] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--secondary)), transparent 70%)" }}
      />

      <div className="container-max max-w-[1200px] relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky editorial intro */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <m.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="eyebrow-pill mb-6"
              >
                {data.eyebrow}
              </m.span>
              <m.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-heading font-bold text-foreground tracking-tight leading-[1.04]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                <Highlight text={data.headingTop} />
                <br />
                <Highlight text={data.headingBottom} />
              </m.h2>
              <m.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md"
              >
                {data.intro}
              </m.p>

              <div className="mt-10">
                <Button size="lg" onClick={openQuoteForm} className="gap-2 btn-glow rounded-full px-6">
                  Get a Free Estimate <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Numbered reasons list */}
          <div className="lg:col-span-7">
            <ul className="divide-y divide-border/70 border-y border-border/70">
              {reasons.map((r, i) => {
                const Icon = getIcon(r.icon);
                return (
                  <m.li
                    key={r.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    className="group relative"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
                      style={{ background: "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
                    />
                    <div className="flex items-start gap-5 sm:gap-7 py-7 sm:py-8 pl-5 sm:pl-7 pr-2 transition-colors duration-500 group-hover:bg-muted/40">
                      <div className="shrink-0 flex flex-col items-start gap-3">
                        <span
                          className="font-heading font-bold text-[2.25rem] sm:text-[2.75rem] leading-none text-muted-foreground/40 group-hover:text-primary transition-colors duration-500"
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-all duration-500">
                          <Icon className="h-5 w-5" strokeWidth={1.85} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground tracking-tight leading-snug">
                            {r.title}
                          </h3>
                          <ArrowUpRight
                            aria-hidden
                            className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-1 transition-all duration-500 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </div>
                        <p className="mt-2.5 text-muted-foreground text-[15px] leading-relaxed max-w-[60ch]">{r.desc}</p>
                      </div>
                    </div>
                  </m.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
