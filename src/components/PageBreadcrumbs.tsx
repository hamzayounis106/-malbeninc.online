import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  items: Crumb[];
  variant?: "light" | "dark";
  className?: string;
}

const PageBreadcrumbs = ({ items, variant = "light", className = "" }: Props) => {
  const onDark = variant === "dark";
  const baseText = onDark ? "text-white/80" : "text-foreground/70";
  const linkText = onDark
    ? "text-white/80 hover:text-white"
    : "text-foreground/70 hover:text-primary";
  const sepText = onDark ? "text-white/40" : "text-foreground/40";
  const currentText = onDark ? "text-white font-semibold" : "text-foreground font-semibold";
  const pillBg = onDark
    ? "bg-white/10 border-white/15 backdrop-blur-md"
    : "bg-card/80 border-border/70 backdrop-blur";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex items-center gap-2 rounded-full border ${pillBg} px-3 py-1.5 text-sm shadow-sm ${className}`}
    >
      <ol className={`flex items-center gap-1.5 ${baseText}`}>
        <li>
          <Link
            to="/"
            className={`inline-flex items-center gap-1 ${linkText} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded`}
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              <ChevronRight className={`h-3.5 w-3.5 ${sepText}`} aria-hidden="true" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={`${linkText} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded`}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={currentText}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PageBreadcrumbs;