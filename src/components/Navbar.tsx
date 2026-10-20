import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuoteForm } from "@/components/QuoteFormContext";
import { site, logoImg, phoneHref } from "@/lib/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const { openQuoteForm } = useQuoteForm();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  // The drawer is portalled to <body>, which only exists in the browser.
  useEffect(() => setMounted(true), []);

  // A closed drawer is only translated off-screen, so take it out of the tab
  // order and the accessibility tree as well (no visual change).
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    el.inert = !open;
    if (open) el.removeAttribute("aria-hidden");
    else el.setAttribute("aria-hidden", "true");
  }, [open, mounted]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? location.pathname === "/" : location.pathname.startsWith(href));

  const mobileMenu = (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[998] md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        ref={drawerRef}
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-72 bg-card z-[999] md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img {...logoImg(site.logo.header)} alt={site.business.name} className="h-10 w-auto" />
          </Link>
          <button onClick={() => setOpen(false)} className="p-1 text-foreground/70 hover:text-foreground" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-col px-4 py-4 gap-1 overflow-y-auto scrollbar-hide h-[calc(100%-72px)]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => setOpen(false)}
                className={`font-heading text-lg tracking-wide block py-3 transition-colors ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-4 space-y-3">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => {
                setOpen(false);
                openQuoteForm();
              }}
            >
              Get a Free Estimate
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full gap-2">
              <a href={phoneHref}>
                <Phone className="h-4 w-4" /> {site.business.phone}
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      <nav className={`site-header ${scrolled ? "site-header--scrolled" : ""}`} aria-label="Primary">
        <div className="header-shell">
          <div className="header-inner container-max flex items-center justify-between px-4 sm:px-6 py-2.5">
            <Link to="/" className="header-logo flex items-center gap-2" aria-label="Home">
              <img {...logoImg(site.logo.header)} alt={site.business.name} className="h-11 w-auto" />
            </Link>
            <ul className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    data-active={isActive(link.href)}
                    className="nav-pill font-heading text-[15px] tracking-wide text-foreground/85 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="hidden lg:block pl-2">
                <Button variant="default" size="sm" onClick={openQuoteForm} className="rounded-full px-5 btn-glow">
                  Get a Free Estimate
                </Button>
              </li>
            </ul>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-foreground p-2 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
};

export default Navbar;
