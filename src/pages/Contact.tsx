import { useEffect } from "react";
import { m } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextHero from "@/components/TextHero";
import Seo from "@/components/Seo";
import FormEmbed from "@/components/FormEmbed";
import SmsDisclosure from "@/components/SmsDisclosure";
import { ESTIMATE_SECTION_ID, scrollToEstimateForm } from "@/components/QuoteFormContext";
import { site, content, phoneHref, mailHref, mapHref } from "@/lib/site";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";

const Contact = () => {
  const data = content.contact;
  const page = content.pages.contact;
  const { business } = site;

  // "Get a Free Estimate" buttons on other pages land here with #estimate.
  useEffect(() => {
    if (window.location.hash !== `#${ESTIMATE_SECTION_ID}`) return;
    const t = window.setTimeout(() => scrollToEstimateForm(), 120);
    return () => window.clearTimeout(t);
  }, []);

  const facts = [
    {
      icon: MapPin,
      label: "Address",
      lines: [business.address.street, `${business.address.city}, ${business.address.state} ${business.address.zip}`, business.address.country],
      href: mapHref,
      external: true,
    },
    { icon: Phone, label: "Phone", lines: [business.phone], href: phoneHref },
    { icon: Mail, label: "Email", lines: [business.email], href: mailHref },
    { icon: Clock, label: "Business hours", lines: [business.hoursShort] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title={page.seoTitle} description={page.seoDescription} path="/contact" />
      <TopBar />
      <Navbar />
      <main>
        <TextHero
          eyebrow={data.heroEyebrow}
          title={data.heroTitle}
          subtitle={data.heroSubtitle}
          breadcrumbs={[{ label: "Contact" }]}
          secondaryCta={{ label: business.phone, href: phoneHref }}
        />

        <section id={ESTIMATE_SECTION_ID} className="section-padding bg-background relative section-glow overflow-hidden scroll-mt-20">
          <div className="container-max relative max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <m.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="eyebrow-pill mb-5"
                >
                  {data.infoEyebrow}
                </m.span>
                <SplitReveal
                  as="h2"
                  className="font-heading text-foreground tracking-tight font-bold leading-[1.1]"
                  style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)" }}
                >
                  <Highlight text={data.infoHeading} />
                </SplitReveal>
                <m.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-lg leading-relaxed mt-5 max-w-[520px]"
                >
                  {data.infoIntro}
                </m.p>

                <ul className="mt-8 space-y-3">
                  {facts.map(({ icon: Icon, label, lines, href, external }, i) => (
                    <m.li
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-start gap-4 rounded-2xl bg-card border border-border/70 px-4 py-4 shadow-sm"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon className="h-5 w-5" strokeWidth={1.85} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-0.5">
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            className="block font-semibold text-foreground hover:text-primary transition-colors break-words"
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {lines.map((line, j) => (
                              <span key={j} className="block">
                                {line}
                              </span>
                            ))}
                          </a>
                        ) : (
                          <span className="block font-semibold text-foreground">
                            {lines.map((line, j) => (
                              <span key={j} className="block">
                                {line}
                              </span>
                            ))}
                          </span>
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
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
