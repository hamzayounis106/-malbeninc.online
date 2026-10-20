import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { services } from "@/lib/services-data";
import { content } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Homepage services overview: six icon cards. Data: services.json + content.json -> servicesSection */
const ServicesSection = () => {
  const { openQuoteForm } = useQuoteForm();
  const data = content.servicesSection;

  return (
    <section id="services" className="relative -mt-px section-padding bg-background section-glow overflow-hidden">
      <div className="container-max relative max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
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
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
            >
              <Highlight text={data.heading} />
            </SplitReveal>
            <m.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg leading-relaxed mt-5 max-w-[520px]"
            >
              {data.intro}
            </m.p>
          </div>
          <Button asChild variant="outline" size="lg" className="self-start lg:self-end gap-2 rounded-full px-6 shrink-0">
            <Link to="/services">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <m.article
                key={s.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                className="group card-premium p-7 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </span>
                  <span aria-hidden className="font-heading font-bold text-3xl leading-none text-muted-foreground/30 group-hover:text-primary/60 transition-colors duration-500">
                    {num(i)}
                  </span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground tracking-tight leading-snug mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed flex-1">{s.short}</p>
                <Link
                  to="/services"
                  aria-label={`Learn more about ${s.title}`}
                  className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </m.article>
            );
          })}
        </div>

        <div className="flex justify-center mt-14">
          <Button size="lg" onClick={openQuoteForm} className="gap-2 btn-glow rounded-full px-7">
            Get a Free Estimate <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
