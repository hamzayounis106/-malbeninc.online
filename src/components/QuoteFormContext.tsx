import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getLenis } from "@/components/SmoothScroll";

/** id of the section that holds the lead form (bottom of Home, and Contact). */
export const ESTIMATE_SECTION_ID = "estimate";
/** id of the hero form card on the Home page (preferred scroll target when present). */
export const HERO_FORM_ID = "estimate-hero";

const QuoteFormContext = createContext<{ openQuoteForm: () => void }>({
  openQuoteForm: () => {},
});

export const useQuoteForm = () => useContext(QuoteFormContext);

/** Smooth-scrolls to the estimate form on the current page. Returns false when the page has none. */
export const scrollToEstimateForm = (immediate = false): boolean => {
  const el = document.getElementById(HERO_FORM_ID) ?? document.getElementById(ESTIMATE_SECTION_ID);
  if (!el) return false;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -16, immediate });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  return true;
};

/**
 * "Get a Free Estimate" buttons across the site call openQuoteForm(): on a page
 * with the form it scrolls there, otherwise it goes to the Contact page.
 * (There is deliberately no popup copy of the form: every form on the site sits
 * directly above its SMS disclosure.)
 */
export const QuoteFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const openQuoteForm = useCallback(() => {
    if (scrollToEstimateForm()) return;
    navigate(`/contact#${ESTIMATE_SECTION_ID}`);
  }, [navigate]);
  const value = useMemo(() => ({ openQuoteForm }), [openQuoteForm]);

  return <QuoteFormContext.Provider value={value}>{children}</QuoteFormContext.Provider>;
};
