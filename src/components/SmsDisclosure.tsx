import { Link } from "react-router-dom";
import { site } from "@/lib/site";

/**
 * Plain-text SMS consent disclosure. Must appear directly under every copy of
 * the lead form, outside the iframe, with links to both policies (A2P 10DLC).
 */
const SmsDisclosure = () => (
  <p
    className="sms-disclosure mt-4 text-[13px] leading-relaxed text-muted-foreground"
    data-sms-disclosure="true"
  >
    By submitting this form and checking the SMS consent box, you agree to receive text messages from{" "}
    {site.business.legalName} about appointments, estimates and promotional offers at the number provided.
    Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is
    not a condition of purchase. See our{" "}
    <Link to="/privacy-policy" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark">
      Privacy Policy
    </Link>{" "}
    and{" "}
    <Link to="/terms-of-service" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark">
      Terms of Service
    </Link>
    .
  </p>
);

export default SmsDisclosure;
