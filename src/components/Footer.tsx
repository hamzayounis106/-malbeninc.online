import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { site, phoneHref, mailHref, mapHref, logoImg } from "@/lib/site";
import { getSocialIcon } from "@/lib/icons";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
];

/**
 * Site footer: solid dark surface, logo on a white card, quick links, contact
 * details and hours. Every page shows the legal name, address and phone here
 * and links to both policies (A2P 10DLC).
 */
const Footer = () => {
  const { business, logo, social } = site;

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-4" aria-label="Home">
              {logo.footerCard ? (
                <span className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 shadow-md">
                  <img {...logoImg(logo.footer)} alt={business.name} className="h-16 w-auto" />
                </span>
              ) : (
                <img {...logoImg(logo.footer)} alt={business.name} className="h-20 w-auto" />
              )}
            </Link>
            <p className="text-accent-foreground/75 text-sm leading-relaxed">{business.footerBlurb}</p>
            {social.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {social.map((s) => {
                  const Icon = getSocialIcon(s.platform);
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${business.name} on ${s.platform}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-secondary hover:text-accent transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-tight mb-4 text-accent-foreground/80 font-bold">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="footer-link-underline text-accent-foreground/75 hover:text-secondary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-tight mb-4 text-accent-foreground/80 font-bold">Contact</h3>
            <ul className="space-y-3 text-sm text-accent-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  {business.address.street}
                  <br />
                  {business.address.city}, {business.address.state} {business.address.zip}
                  <br />
                  {business.address.country}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                <a href={phoneHref} className="hover:text-secondary transition-colors">
                  {business.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                <a href={mailHref} className="hover:text-secondary transition-colors break-all">
                  {business.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-tight mb-4 text-accent-foreground/80 font-bold">Hours</h3>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              {business.hours.map((h) => (
                <li key={h.days} className="flex items-start gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                  <span>
                    {h.days}
                    <br />
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-accent-foreground/65 text-xs leading-relaxed">Serving {business.serviceAreaShort}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-accent-foreground/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <p className="text-accent-foreground/60 text-xs">
            &copy; {new Date().getFullYear()} {business.legalName.replace(/\.$/, "")}. All rights reserved.
          </p>
          <p className="text-accent-foreground/60 text-xs">
            {business.legalName} <span aria-hidden>&middot;</span> {business.addressLine}{" "}
            <span aria-hidden>&middot;</span>{" "}
            <a href={phoneHref} className="hover:text-secondary transition-colors">
              {business.phone}
            </a>
          </p>
          <nav aria-label="Legal" className="flex items-center gap-4 text-xs">
            {legalLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-accent-foreground/70 hover:text-secondary underline underline-offset-2 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
