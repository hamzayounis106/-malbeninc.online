import type { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextHero from "@/components/TextHero";
import Seo from "@/components/Seo";
import { site } from "@/lib/site";

interface PolicyPageProps {
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  children: ReactNode;
}

/** Shared shell for the Privacy Policy and Terms of Service pages. */
const PolicyPage = ({ title, path, seoTitle, seoDescription, children }: PolicyPageProps) => (
  <div className="min-h-screen bg-background">
    <Seo title={seoTitle} description={seoDescription} path={path} />
    <TopBar />
    <Navbar />
    <main>
      <TextHero
        eyebrow="Legal"
        title={title}
        breadcrumbs={[{ label: title }]}
        meta={
          <p className="text-white/80 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
            {site.business.legalName} <span aria-hidden>&middot;</span> Effective Date: {site.policies.effectiveDate}
          </p>
        }
      />
      <section className="section-padding bg-background">
        <article className="container-max max-w-3xl policy-prose">{children}</article>
      </section>
    </main>
    <Footer />
  </div>
);

export default PolicyPage;

/* Small typographic helpers so the policy text reads cleanly in the site design. */
export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-12 mb-4 first:mt-0">{children}</h2>
);
export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mt-7 mb-2">{children}</h3>
);
export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-foreground/80 text-[15px] md:text-base leading-relaxed mb-4">{children}</p>
);
export const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc pl-6 space-y-1.5 mb-5 text-foreground/80 text-[15px] md:text-base leading-relaxed marker:text-primary">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);
export const Rule = () => <hr className="my-10 border-border" />;
export const Notice = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-primary/25 bg-primary-light p-6 md:p-7 mb-10">
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3">{title}</p>
    <div className="text-foreground/85 text-[15px] md:text-base leading-relaxed font-medium">{children}</div>
  </div>
);
export const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark break-words">
    {children}
  </a>
);
