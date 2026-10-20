// Icon-name to component map so data files can reference icons by string.
// Add to this map if a new icon name is used in src/data/*.json.
import {
  Award,
  Bath,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  CookingPot,
  Eye,
  Facebook,
  Gem,
  Hammer,
  HeartHandshake,
  Home,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  PaintRoller,
  Phone,
  Ruler,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Twitter,
  Users,
  Wrench,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Award,
  Bath,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  CookingPot,
  Eye,
  Facebook,
  Gem,
  Hammer,
  HeartHandshake,
  Home,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  PaintRoller,
  Phone,
  Ruler,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Twitter,
  Users,
  Wrench,
  Youtube,
};

/** Look up a lucide icon by name; falls back to CheckCircle. */
export const getIcon = (name: string): LucideIcon => ICONS[name] ?? CheckCircle;

/** Social platform to icon, for footer links. */
export const getSocialIcon = (platform: string): LucideIcon => {
  const key = platform.toLowerCase();
  if (key.includes("insta")) return Instagram;
  if (key.includes("face")) return Facebook;
  if (key.includes("twitter") || key === "x") return Twitter;
  if (key.includes("linked")) return Linkedin;
  if (key.includes("you")) return Youtube;
  return getIcon(platform);
};
