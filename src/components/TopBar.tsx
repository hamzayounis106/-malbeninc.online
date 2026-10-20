import { Phone, Clock, Mail, Languages } from "lucide-react";
import { site, phoneHref, mailHref } from "@/lib/site";
import { LanguageToggle } from "@/components/LanguageToggle";

const TopBar = () => {
  const { business } = site;

  return (
    <header className="hidden sm:block bg-accent text-accent-foreground">
      <div className="container-max flex flex-col sm:flex-row items-center justify-between px-4 py-2 text-xs sm:text-sm gap-1 sm:gap-0">
        <div className="flex items-center gap-4">
          <a href={mailHref} className="flex items-center gap-2 hover:text-secondary transition-colors">
            <Mail className="h-3.5 w-3.5 text-secondary" />
            <span>{business.email}</span>
          </a>
          {business.hoursShort && (
            <div className="hidden md:flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-secondary" />
              <span>{business.hoursShort}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle variant="dark" />
          {business.languageBadge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 border border-secondary/30 px-3 py-0.5 text-secondary font-semibold">
              <Languages className="h-3.5 w-3.5" />
              {business.languageBadge}
            </span>
          )}
          <a href={phoneHref} className="flex items-center gap-2 hover:text-secondary transition-colors font-semibold">
            <Phone className="h-3.5 w-3.5 text-secondary" />
            <span>{business.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
