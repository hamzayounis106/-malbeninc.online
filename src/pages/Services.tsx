import { m } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextHero from "@/components/TextHero";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { services } from "@/lib/services-data";
import { site, content, phoneHref } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";

const Services = () => {
  const { openQuoteForm } = useQuoteForm();
  const page = content.pages.services;

  return (
    <div className="min-h-screen bg-background">
      <Seo title={page.seoTitle} description={page.seoDescription} path="/services" />
      <TopBar />
      <Navbar />
      <main>
        <TextHero
          eyebrow={page.heroEyebrow}
          title={page.heroTitle}
          subtitle={page.heroSubtitle}
          breadcrumbs={[{ label: "Services" }]}
          primaryCta={{ label: "Get a Free Estimate" }}
          secondaryCta={{ label: site.business.phone, href: phoneHref }}
        />

        <section className="section-padding bg-background relative section-glow overflow-hidden">
          <div className="container-max relative max-w-[1200px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
              {services.map((s, i) => {
                const Icon = getIcon(s.icon);
                return (
                  <m.article
                    key={s.slug}
                    id={s.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: (i % 2) * 0.08, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                    className="group card-premium p-7 md:p-8 flex flex-col scroll-mt-28"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                        <Icon className="h-7 w-7" strokeWidth={1.75} />
                      </span>
                      <div>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-heading text-2xl font-bold text-foreground tracking-tight leading-tight">
                          {s.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-foreground/80 text-[15px] md:text-base leading-relaxed flex-1">{s.description}</p>
                    <div className="mt-6 pt-5 border-t border-border/70">
                      <button
                        type="button"
                        onClick={openQuoteForm}
                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                      >
                        Request a free estimate <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </m.article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="relative section-padding overflow-hidden text-accent-foreground"
          style={{
            background:
              "radial-gradient(60% 80% at 20% 20%, hsl(var(--primary) / 0.28), transparent 65%)," +
              "radial-gradient(50% 70% at 90% 80%, hsl(var(--secondary) / 0.18), transparent 70%)," +
              "linear-gradient(160deg, hsl(var(--accent)) 0%, hsl(var(--accent-dark)) 100%)",
          }}
        >
          <div className="container-max relative z-10 max-w-3xl text-center">
            <m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <Highlight text="Not sure which service |you need|?" className="accent-serif text-secondary" />
              </h2>
              <p className="text-accent-foreground/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                Tell us what you would like to change and we will walk the space with you and put together a free estimate.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={openQuoteForm}
                  className="gap-2 rounded-xl px-7 shadow-[0_18px_40px_-12px_hsl(var(--primary)/0.6)]"
                >
                  Get a Free Estimate <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur"
                >
                  <a href={phoneHref}>
                    <Phone className="h-4 w-4" /> {site.business.phone}
                  </a>
                </Button>
              </div>
            </m.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
