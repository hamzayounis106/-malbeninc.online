import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { SECTION_REGISTRY } from "@/components/sections";
import { site } from "@/lib/site";
import { services } from "@/lib/services-data";

const { business } = site;
const telephone = `+1-${business.phoneRaw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;

// LocalBusiness structured data for the homepage. No tax identifiers here.
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${site.domain}/#business`,
  name: business.name,
  legalName: business.legalName,
  url: `${site.domain}/`,
  telephone,
  email: business.email,
  image: `${site.domain}${site.seo.ogImage}`,
  logo: `${site.domain}${site.logo.footer}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: "US",
  },
  areaServed: site.seo.areaServed,
  priceRange: site.seo.priceRange,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, areaServed: site.seo.areaServed },
  })),
};

const Index = () => (
  <div className="min-h-screen bg-background">
    <Seo title={site.seo.defaultTitle} description={site.seo.defaultDescription} path="/" jsonLd={businessJsonLd} />
    <TopBar />
    <Navbar />
    <main>
      {site.homeSections.map((key) => {
        const Section = SECTION_REGISTRY[key];
        return Section ? <Section key={key} /> : null;
      })}
    </main>
    <Footer />
  </div>
);

export default Index;
