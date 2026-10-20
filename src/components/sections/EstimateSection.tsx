import { m } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { content, site, phoneHref, mailHref, mapHref } from "@/lib/site";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";
import FormEmbed from "@/components/FormEmbed";
import SmsDisclosure from "@/components/SmsDisclosure";
import { ESTIMATE_SECTION_ID } from "@/components/QuoteFormContext";

/** Homepage lead-form section: the GHL form plus its SMS disclosure. Data: content.json -> estimate */
const EstimateSection = () => {
  const data = content.estimate;
  const { business } = site;

  const facts = [
    { icon: Phone, label: "Phone", value: business.phone, href: phoneHref },
    { icon: Mail, label: "Email", value: business.email, href: mailHref },
    { icon: Clock, label: "Hours", value: business.hoursShort },
    { icon: MapPin, label: "Address", value: business.addressLine, href: mapHref, external: true },
  ];

  return (
    <section id={ESTIMATE_SECTION_ID} className="relative section-padding bg-muted/40 overflow-hidden scroll-mt-20">
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-[0.16] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
      />
      <div className="container-max relative max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
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
              style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)" }}
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

            <ul className="mt-8 space-y-3">
              {facts.map(({ icon: Icon, label, value, href, external }, i) => (
                <m.li
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-4 rounded-2xl bg-card border border-border/70 px-4 py-3.5 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" strokeWidth={1.85} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="block font-semibold text-foreground hover:text-primary transition-colors break-words"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="block font-semibold text-foreground">{value}</span>
                    )}
                  </span>
                </m.li>
              ))}
            </ul>
          </div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium-lg bg-card border border-border/60">
              <div
                aria-hidden
                className="h-1.5 w-full"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              />
              <div className="p-5 sm:p-7">
                <h3 className="font-heading text-2xl text-foreground font-bold mb-1">{data.formHeading}</h3>
                <p className="text-muted-foreground text-sm mb-5">{data.formSub}</p>
                <FormEmbed idPrefix="inline" />
                <SmsDisclosure />
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default EstimateSection;
