import { Link } from "react-router-dom";
import PolicyPage, { H2, H3, P, UL, Rule, Notice, ExtLink } from "@/components/PolicyPage";
import { site, content, phoneHref, mailHref } from "@/lib/site";

const { business } = site;
const NAME = business.legalName;
const EMAIL = business.email;
const WEBSITE = site.domain;
// The legal name already ends with a period, so sentences that end with it need no second one.
const NAME_END = NAME.endsWith(".") ? NAME : `${NAME}.`;

/** Privacy Policy, from the client's template with the business values filled in. */
const PrivacyPolicy = () => (
  <PolicyPage
    title="Privacy Policy"
    path="/privacy-policy"
    seoTitle={content.pages.privacy.seoTitle}
    seoDescription={content.pages.privacy.seoDescription}
  >
    <Notice title="Important Notice Regarding Text Messaging Data">
      {NAME} ("we," "us," or "our") DOES NOT share customer opt-in information, including phone numbers and consent
      records, with any affiliates or third parties for marketing, promotional, or any other purposes unrelated to
      providing our direct services. All text messaging originator opt-in data is kept strictly confidential.
    </Notice>

    <H2>1. Information We Collect</H2>
    <P>We collect the following types of information:</P>
    <H3>Personal Information:</H3>
    <UL
      items={[
        "Name, email address, phone number, physical address",
        "Payment information when you make a purchase or request a quote",
        "Opt-in records and timestamps for all communication channels (SMS, email, etc.)",
      ]}
    />
    <H3>Non-Personal Information:</H3>
    <UL items={["IP address, browser type, device information", "Website usage patterns and analytics", "Cookies and similar technologies"]} />
    <H3>Customer Communication:</H3>
    <UL items={["Records of inquiries and service requests", "Appointment details and preferences", "Service history and feedback"]} />
    <Rule />

    <H2>2. How We Use Your Information</H2>
    <P>We use collected data for:</P>
    <UL
      items={[
        "Providing and improving our services",
        "Processing transactions and payments",
        "Communicating with you about your inquiries, appointments, and promotions",
        "Enhancing website functionality and user experience",
        "Ensuring security and fraud prevention",
        "Maintaining records of your communication preferences and consent",
      ]}
    />
    <Rule />

    <H2>3. SMS Messaging &amp; Compliance</H2>
    <H3>Text Message Program Terms &amp; Conditions</H3>
    <P>
      By opting into our SMS messaging services, you agree to receive text messages related to our services, including
      appointment reminders, customer support, and important updates.
    </P>
    <H3>Opt-In &amp; Consent:</H3>
    <UL
      items={[
        "You will only receive messages if you have explicitly opted in",
        "We maintain timestamped records of all opt-in actions",
        "We comply with the Telephone Consumer Protection Act (TCPA) and all applicable laws",
      ]}
    />
    <H3>Opt-Out Instructions:</H3>
    <UL
      items={[
        'You can cancel SMS notifications at any time by replying "STOP"',
        "You will receive a final confirmation message, and no further messages will be sent unless you re-opt in",
        "All opt-out requests are processed immediately.",
      ]}
    />
    <H3>Message Frequency &amp; Content:</H3>
    <UL
      items={[
        "Message frequency varies based on your interactions with our business",
        "Messages will be directly related to the services you have requested",
        "We do not send promotional content without specific consent",
      ]}
    />
    <H3>Help &amp; Support:</H3>
    <UL
      items={[
        <>
          Reply "HELP" for assistance or contact us at <ExtLink href={mailHref}>{EMAIL}</ExtLink>
        </>,
        "Customer support is available during regular business hours",
      ]}
    />
    <H3>Carrier Information:</H3>
    <UL
      items={[
        "Standard message and data rates may apply",
        "Carriers are not liable for delayed or undelivered messages",
        "Supported carriers include AT&T, Verizon, T-Mobile, Sprint, and most regional carriers",
      ]}
    />
    <H3>SMS Data Protection Statement</H3>
    <P>
      No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information
      sharing to subcontractors in support services, such as customer service is permitted. All other use case categories
      exclude text messaging originator opt-in data and consent; this information will not be shared with any third
      parties.
    </P>
    <P>We implement strict data protection measures to safeguard your SMS opt-in information and consent records.</P>
    <Rule />

    <H2>4. Information Sharing &amp; Disclosure</H2>
    <P>We do not sell, rent, or trade personal information. We may share information with:</P>
    <H3>Service Providers:</H3>
    <UL
      items={[
        "Third-party vendors who assist in our operations (e.g., payment processing, appointment scheduling)",
        "SMS aggregators and providers solely for the purpose of delivering messages you've consented to receive",
        "All service providers are contractually obligated to maintain confidentiality and security",
      ]}
    />
    <H3>Legal Compliance:</H3>
    <UL
      items={[
        "If required by law, legal process, or to protect our rights",
        "In response to valid law enforcement requests or court orders",
      ]}
    />
    <H3>Business Transfers:</H3>
    <UL
      items={[
        "In case of mergers, acquisitions, or sale of assets",
        "In such cases, your data remains protected under the terms of this policy",
      ]}
    />
    <P>
      All the above categories exclude text messaging originator opt-in data and consent; this information will not be
      shared with any third parties, excluding aggregators and providers of the Text Message services.
    </P>
    <Rule />

    <H2>5. Data Security</H2>
    <P>We implement and maintain reasonable security measures to protect your personal information:</P>
    <UL
      items={[
        "Encryption of sensitive data in transit and at rest",
        "Secure access controls and authentication mechanisms",
        "Regular security assessments and updates",
        "Employee training on data protection",
        "Breach notification protocols in accordance with applicable laws",
        "Secure backup systems and disaster recovery procedures",
      ]}
    />
    <P>
      Despite these measures, no method of transmission over the Internet or electronic storage is 100% secure. We strive
      to use commercially acceptable means to protect your personal information but cannot guarantee absolute security.
    </P>
    <Rule />

    <H2>6. Cookies &amp; Tracking Technologies</H2>
    <P>We use cookies and similar technologies to:</P>
    <UL
      items={[
        "Analyze site traffic and user behavior",
        "Remember your preferences",
        "Improve website functionality and user experience",
        "Measure the effectiveness of our services",
      ]}
    />
    <P>
      You may control cookies through your browser settings. Disabling cookies may limit your ability to use certain
      features of our website.
    </P>
    <Rule />

    <H2>7. Your Rights &amp; Choices</H2>
    <P>You have the right to:</P>
    <UL
      items={[
        "Access, update, or delete your personal information",
        'Opt-out of marketing emails by clicking "unsubscribe" in our emails',
        'Opt-out of SMS messages by replying "STOP"',
        "Request information on how we process your data",
        "Withdraw consent at any time for future communications",
        "Lodge a complaint with a supervisory authority if you believe your rights have been violated",
      ]}
    />
    <P>To exercise these rights, please contact us using the information in Section 10.</P>
    <Rule />

    <H2>8. Third-Party Links</H2>
    <P>
      Our website may contain links to third-party websites. We are not responsible for their privacy practices and
      encourage you to review their policies. This privacy policy applies only to information collected by {NAME_END}
    </P>
    <Rule />

    <H2>9. Changes to This Privacy Policy</H2>
    <P>
      We may update this policy periodically. The latest version will always be available on our website with the
      effective date. For significant changes, we will notify you by email or through a notice on our website.
    </P>
    <Rule />

    <H2>10. Contact Us</H2>
    <P>If you have questions about this Privacy Policy or how your information is handled, contact us at:</P>
    <P>
      <strong className="text-foreground">{NAME}</strong>
      <br />
      Phone: <ExtLink href={phoneHref}>{business.phone}</ExtLink>
      <br />
      Email: <ExtLink href={mailHref}>{EMAIL}</ExtLink>
      <br />
      Website: <ExtLink href={`${WEBSITE}/`}>{WEBSITE}</ExtLink>
    </P>
    <P>By using our website and services, you consent to this Privacy Policy.</P>
    <P>
      See also our{" "}
      <Link to="/terms-of-service" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark">
        Terms of Service
      </Link>
      .
    </P>
  </PolicyPage>
);

export default PrivacyPolicy;
