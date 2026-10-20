import { Link } from "react-router-dom";
import PolicyPage, { H2, H3, P, Rule, ExtLink } from "@/components/PolicyPage";
import { site, content, phoneHref, mailHref } from "@/lib/site";

const { business } = site;
const NAME = business.legalName;
const EMAIL = business.email;
const WEBSITE = site.domain;
const PRIVACY_URL = `${WEBSITE}/privacy-policy`;
// The legal name already ends with a period, so sentences that end with it need no second one.
const NAME_END = NAME.endsWith(".") ? NAME : `${NAME}.`;

const PrivacyLink = () => (
  <Link to="/privacy-policy" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark break-words">
    {PRIVACY_URL}
  </Link>
);

/** Terms of Service, from the client's template with the business values filled in. */
const TermsOfService = () => (
  <PolicyPage
    title="Terms of Service"
    path="/terms-of-service"
    seoTitle={content.pages.terms.seoTitle}
    seoDescription={content.pages.terms.seoDescription}
  >
    <H2>SMS Messaging Terms &amp; Compliance</H2>
    <P>
      <strong className="text-foreground">1. Program Description:</strong> This messaging program sends appointment
      confirmation and reminder messages to customers who have booked an appointment with {NAME} through our website at{" "}
      <ExtLink href={`${WEBSITE}/`}>{WEBSITE}</ExtLink>, or via our scheduling forms, and have explicitly opted in to
      receive SMS notifications. Opt-in is collected via web forms with a dedicated checkbox for SMS consent. Messages
      include scheduling confirmations, appointment reminders, rescheduling updates, and customer support communications.
    </P>
    <P>
      <strong className="text-foreground">2. Cancellation Instructions:</strong> You can cancel the SMS service at any
      time. Simply text "STOP" to the same number that sent you messages. Upon sending "STOP," we will confirm your
      unsubscribe status via SMS. Following this confirmation, you will no longer receive SMS messages from us. To rejoin,
      sign up as you did initially, and we will resume sending SMS messages to you.
    </P>
    <P>
      <strong className="text-foreground">3. Support Information:</strong> If you experience issues with the messaging
      program, reply with the keyword "HELP" for more assistance, or reach out directly to{" "}
      <ExtLink href={mailHref}>{EMAIL}</ExtLink> or call <ExtLink href={phoneHref}>{business.phone}</ExtLink> during
      business hours.
    </P>
    <P>
      <strong className="text-foreground">4. Carrier Liability:</strong> Carriers are not liable for delayed or
      undelivered messages.
    </P>
    <P>
      <strong className="text-foreground">5. Message &amp; Data Rates:</strong> Message and data rates may apply for
      messages sent to you from us and to us from you. Message frequency varies based on your service usage and
      appointment schedule. For questions about your text plan or data plan, contact your wireless provider.
    </P>
    <P>
      <strong className="text-foreground">6. Supported Carriers:</strong> Our SMS program works with all major U.S.
      wireless carriers, including AT&amp;T, T-Mobile, Verizon, Sprint, and most regional carriers.
    </P>
    <P>
      <strong className="text-foreground">7. Age Restriction:</strong> You must be 18 years or older to participate in
      our SMS program.
    </P>
    <P>
      <strong className="text-foreground">8. Privacy Policy:</strong> For privacy-related inquiries, please refer to our
      Privacy Policy at <PrivacyLink />
    </P>
    <P>
      We comply with all applicable laws and regulations, including the Telephone Consumer Protection Act (TCPA) and CTIA
      guidelines, regarding the use of SMS communications.
    </P>
    <Rule />

    <H2>General Terms</H2>
    <P>
      This website (the "Site") is owned and operated by {NAME} ("COMPANY," "we" or "us"). By using the Site, you agree
      to be bound by these Terms of Service and to use the Site in accordance with these Terms of Service, our Privacy
      Policy, and any additional terms and conditions that may apply to specific sections of the Site or to products and
      services available through the Site or from {NAME_END}
    </P>
    <P>
      Accessing the Site, in any manner, whether automated or otherwise, constitutes use of the Site and your agreement to
      be bound by these Terms of Service.
    </P>
    <P>
      We reserve the right to change these Terms of Service or to impose new conditions on the use of the Site from time
      to time, in which case we will post the revised Terms of Service on this website. By continuing to use the Site
      after we post any such changes, you accept the Terms of Service, as modified.
    </P>
    <Rule />

    <H2>Intellectual Property Rights</H2>
    <H3>Our Limited License to You</H3>
    <P>
      This Site and all the materials available on the Site are the property of {NAME} and/or our affiliates or licensors
      and are protected by copyright, trademark, and other intellectual property laws. The Site is provided solely for
      your personal non-commercial use.
    </P>
    <P>
      You may not use the Site or the materials available on the Site in a manner that constitutes an infringement of our
      rights or that has not been authorized by us.
    </P>
    <P>
      Unless explicitly authorized, you may not modify, copy, reproduce, republish, upload, post, transmit, translate,
      sell, create derivative works, exploit, or distribute in any manner or medium any material from the Site. However,
      you may download and/or print one copy of individual pages for your personal, non-commercial use, provided that you
      keep intact all copyright and other proprietary notices.
    </P>
    <H3>Your License to Us</H3>
    <P>
      By posting or submitting any material (including comments, blog entries, social media posts, photos, and videos) to
      us via the Site, internet groups, or other digital venues, you represent that you own the material or have obtained
      the necessary permissions. You grant us a royalty-free, perpetual, irrevocable, non-exclusive, worldwide license to
      use, modify, transmit, sell, exploit, create derivative works from, distribute, and publicly perform or display such
      material.
    </P>
    <Rule />

    <H2>Disclaimers</H2>
    <P>
      Throughout the Site, we may provide links and pointers to Internet sites maintained by third parties. Our linking to
      such third-party sites does not imply an endorsement or sponsorship of such sites or the information, products, or
      services offered on or through the sites.
    </P>
    <P>
      The information, products, and services offered on or through the Site are provided "as is" and without warranties
      of any kind, either express or implied. To the fullest extent permissible pursuant to applicable law, we disclaim
      all warranties, including implied warranties of merchantability and fitness for a particular purpose.
    </P>
    <P>
      You agree at all times to indemnify and hold harmless {NAME} its affiliates, and their respective officers,
      directors, agents, and employees from any claims, causes of action, damages, liabilities, costs, and expenses
      arising out of or related to your breach of any obligation, warranty, or representation under these Terms of
      Service.
    </P>
    <Rule />

    <H2>Online Commerce</H2>
    <P>
      Certain sections of the Site may allow you to purchase products and services from third-party vendors. We are not
      responsible for the quality, accuracy, timeliness, reliability, or any other aspect of these products and services.
      If you make a purchase from a third party linked through the Site, the information obtained during your visit,
      including payment information, may be collected by both the merchant and us.
    </P>
    <P>
      Your participation in any dealings with third-party vendors is solely between you and the third party. {NAME} shall
      not be responsible for any loss or damage incurred as a result of such dealings.
    </P>
    <Rule />

    <H2>Registration &amp; Passwords</H2>
    <P>
      To access certain features of the Site, you may be required to register and create an account. You agree to provide
      accurate, current, and complete information during the registration process. You are responsible for maintaining
      the confidentiality of your login credentials and for all activities conducted under your account.
    </P>
    <P>
      If you suspect unauthorized use of your account, notify us immediately at <ExtLink href={mailHref}>{EMAIL}</ExtLink>.
      We are not liable for any loss or damage arising from your failure to comply with this obligation.
    </P>
    <Rule />

    <H2>Termination</H2>
    <P>
      We reserve the right to terminate or suspend your access to the Site, without notice, if we determine that you have
      violated these Terms of Service or engaged in conduct that we deem inappropriate or unlawful. Upon termination, you
      must cease all use of the Site and any content obtained from it.
    </P>
    <Rule />

    <H2>Governing Law</H2>
    <P>
      These Terms of Service shall be governed by and construed in accordance with the laws of the state in which {NAME}{" "}
      operates. Any dispute arising under these Terms shall be resolved exclusively through binding arbitration in that
      jurisdiction.
    </P>
    <Rule />

    <H2>Changes to Terms of Service</H2>
    <P>
      We may update these Terms of Service from time to time. The latest version will always be available on our website
      with the effective date.
    </P>
    <P>For any questions regarding these Terms of Service, please contact us at:</P>
    <P>
      <strong className="text-foreground">{NAME}</strong>
      <br />
      Phone: <ExtLink href={phoneHref}>{business.phone}</ExtLink>
      <br />
      Email: <ExtLink href={mailHref}>{EMAIL}</ExtLink>
      <br />
      Website: <ExtLink href={`${WEBSITE}/`}>{WEBSITE}</ExtLink>
    </P>
    <P>By using our website and services, you consent to these Terms of Service.</P>
  </PolicyPage>
);

export default TermsOfService;
