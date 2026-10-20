// Homepage section registry. The order and selection of sections is driven by
// site.json -> homeSections.
import type { ComponentType } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessSection from "@/components/sections/ProcessSection";
import CTABanner from "@/components/sections/CTABanner";
import EstimateSection from "@/components/sections/EstimateSection";

export const SECTION_REGISTRY: Record<string, ComponentType> = {
  hero: HeroSection,
  services: ServicesSection,
  whyChooseUs: WhyChooseUs,
  process: ProcessSection,
  ctaBanner: CTABanner,
  estimateForm: EstimateSection,
};
