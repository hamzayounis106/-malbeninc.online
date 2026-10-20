// Services content lives in src/data/services.json - edit that file, not this one.
import servicesJson from "@/data/services.json";

export interface ServiceData {
  slug: string;
  title: string;
  /** lucide icon name, resolved through src/lib/icons.ts */
  icon: string;
  /** one-line summary for cards */
  short: string;
  /** the single paragraph shown on the Services page */
  description: string;
}

export const services: ServiceData[] = servicesJson as ServiceData[];
