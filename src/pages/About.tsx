import { m } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextHero from "@/components/TextHero";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { site, content, phoneHref } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import Highlight from "@/components/Highlight";
import { SplitReveal } from "@/components/Reveal";

const About = () => {
  const { openQuoteForm } = useQuoteForm();
  const about = content.about;
  const page = content.pages.about;
  const { business } = site;

  return (
    <div className="min-h-screen bg-background">
      <Seo title={page.seoTitle} description={page.seoDescription} path="/about" />
      <TopBar />
      <Navbar />
      <main>
        <TextHero
          eyebrow={about.heroEyebrow}
          title={about.heroTitle}
          subtitle={about.heroSubtitle}
          breadcrumbs={[{ label: "About" }]}
          primaryCta={{ label: "Get a Free Estimate" }}
          secondaryCta={{ label: business.phone, href: phoneHref }}
        />

        {/* Story */}
        <section className="section-padding relative section-glow overflow-hidden">
          <div className="container-max relative max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5">
                <m.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="eyebrow-pill mb-5"
                >
                  {about.storyEyebrow}
                </m.span>
                <SplitReveal
                  as="h2"
                  className="font-heading text-foreground tracking-tight font-bold leading-[1.08]"
                  style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)" }}
                >
                  <Highlight text={about.storyHeading} />
                </SplitReveal>
                <m.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="mt-8 rounded-2xl border border-primary/20 bg-primary-light p-6"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">{business.legalName}</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {business.addressLine}
                    <br />
                    {business.hoursShort}
                  </p>
                </m.div>
              </div>
              <div className="lg:col-span-7">
                <div className="space-y-5 text-foreground/80 text-base md:text-lg leading-relaxed">
                  {about.story.map((paragraph, i) => (
                    <m.p
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                      {paragraph}
                    </m.p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-muted/40 relative overflow-hidden">
          <div className="container-max max-w-[1200px]">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="eyebrow-pill mb-4">{about.valuesEyebrow}</span>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-3 tracking-tight font-bold">
                <Highlight text={about.valuesHeading} />
              </h2>
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed">{about.valuesIntro}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {about.values.map((v, i) => {
                const Icon = getIcon(v.icon);
                return (
                  <m.div
                    key={v.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    className="card-premium p-7 group"
                  >
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 mb-4 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-heading text-lg text-foreground mb-1.5 font-bold">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
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
                <Highlight text={about.cta.heading} className="accent-serif text-secondary" />
              </h2>
              <p className="text-accent-foreground/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">{about.cta.sub}</p>
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
                    <Phone className="h-4 w-4" /> {business.phone}
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

export default About;
