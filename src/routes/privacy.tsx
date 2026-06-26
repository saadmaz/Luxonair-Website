import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Luxe on Air" },
      { name: "description", content: "How Luxeonair LTD collects, uses and protects your personal data in accordance with UK GDPR." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.com/privacy" }],
  }),
  component: PrivacyPage,
});

const TOC = [
  { id: "who-we-are", label: "1. Who We Are" },
  { id: "data-we-collect", label: "2. Data We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Data" },
  { id: "legal-basis", label: "4. Legal Basis" },
  { id: "who-we-share", label: "5. Who We Share With" },
  { id: "international-transfers", label: "6. International Transfers" },
  { id: "retention", label: "7. Retention Periods" },
  { id: "your-rights", label: "8. Your Rights" },
  { id: "cookies", label: "9. Cookies" },
  { id: "children", label: "10. Children's Privacy" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact-dpo", label: "12. Contact Us" },
];

function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            We respect your privacy. This policy explains what personal data we collect, why we collect it, and your rights under UK GDPR.
          </p>
          <p className="mt-3 text-xs text-navy-fg/40">Last updated: June 2026</p>
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Contents</p>
              <nav className="space-y-0.5">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-10 text-sm leading-relaxed">

            {/* Intro */}
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">LUXEONAIR LTD</strong> (&ldquo;Luxeonair&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose and safeguard information about you when you use our website or services, in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>

            <Section id="who-we-are" number="1" title="Who We Are">
              <p>The data controller responsible for your personal data is:</p>
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">LUXEONAIR LTD</p>
                <p className="mt-1 text-muted-foreground">{SITE.address}</p>
                <p className="mt-1">
                  Email:{" "}
                  <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Company No. 17264512 · Registered in England &amp; Wales</p>
              </div>
              <p className="mt-4">If you have any questions about this policy or wish to exercise your rights, please contact us at the address above.</p>
            </Section>

            <Section id="data-we-collect" number="2" title="Data We Collect">
              <p>We collect personal data in the following ways:</p>

              <SubHeading>Data you provide directly</SubHeading>
              <ul className="space-y-1.5 pl-0">
                <BulletItem><strong>Identity data:</strong> first name, last name, date of birth</BulletItem>
                <BulletItem><strong>Contact data:</strong> email address, telephone number, postal address</BulletItem>
                <BulletItem><strong>Travel data:</strong> passport number, nationality, travel preferences, dietary requirements, seat preferences</BulletItem>
                <BulletItem><strong>Payment data:</strong> payment card details and billing address (processed securely — we do not store full card details)</BulletItem>
                <BulletItem><strong>Special category data:</strong> health or medical conditions, disabilities, dietary requirements related to religion or belief — only where you volunteer this and it is necessary to arrange your travel</BulletItem>
                <BulletItem><strong>Communications data:</strong> any correspondence you send us via email, phone or our contact form</BulletItem>
              </ul>

              <SubHeading>Data collected automatically</SubHeading>
              <ul className="space-y-1.5 pl-0">
                <BulletItem><strong>Technical data:</strong> IP address, browser type and version, time zone, operating system</BulletItem>
                <BulletItem><strong>Usage data:</strong> pages visited, links clicked, referral source, session duration</BulletItem>
                <BulletItem><strong>Cookie data:</strong> see Clause 9 for full details</BulletItem>
              </ul>

              <SubHeading>Data from third parties</SubHeading>
              <ul className="space-y-1.5 pl-0">
                <BulletItem>Travel suppliers and airlines may provide updated information about your bookings</BulletItem>
                <BulletItem>Credit reference or fraud prevention agencies where necessary</BulletItem>
              </ul>
            </Section>

            <Section id="how-we-use" number="3" title="How We Use Your Data">
              <p>We use your personal data for the following purposes:</p>

              <div className="mt-4 space-y-3">
                <PurposeRow
                  purpose="Making and managing your booking"
                  detail="Processing your travel arrangements, communicating booking confirmations, sending travel documents and providing pre-departure information."
                />
                <PurposeRow
                  purpose="Providing customer support"
                  detail="Responding to your enquiries, handling complaints, and supporting you during your trip."
                />
                <PurposeRow
                  purpose="Processing payments"
                  detail="Collecting deposits and balances, issuing refunds, and preventing fraudulent transactions."
                />
                <PurposeRow
                  purpose="Legal and regulatory obligations"
                  detail="Providing information to border control, customs, immigration and other public authorities as required by law. Complying with ATOL obligations."
                />
                <PurposeRow
                  purpose="Marketing communications"
                  detail="Sending you information about our services, travel offers and destination content — only where you have given consent or we have a legitimate interest and you have not opted out."
                />
                <PurposeRow
                  purpose="Improving our services"
                  detail="Analysing usage patterns to improve our website and services. Conducting customer satisfaction surveys."
                />
                <PurposeRow
                  purpose="Fraud prevention and security"
                  detail="Detecting, investigating and preventing fraudulent transactions and other illegal activities."
                />
              </div>

              <p className="mt-4 text-xs text-muted-foreground">We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason compatible with the original purpose.</p>
            </Section>

            <Section id="legal-basis" number="4" title="Legal Basis for Processing">
              <p>Under UK GDPR, we rely on the following lawful bases:</p>
              <ul className="mt-3 space-y-3 pl-0">
                <li className="list-none rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">Performance of a contract</p>
                  <p className="mt-1 text-muted-foreground text-xs">Processing is necessary to perform the contract we have with you — including making your booking, issuing tickets and providing travel services.</p>
                </li>
                <li className="list-none rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">Legal obligation</p>
                  <p className="mt-1 text-muted-foreground text-xs">Processing is necessary to comply with our legal and regulatory obligations — including ATOL requirements, HMRC reporting and disclosure to border authorities.</p>
                </li>
                <li className="list-none rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">Legitimate interests</p>
                  <p className="mt-1 text-muted-foreground text-xs">Processing is necessary for our legitimate business interests (such as fraud prevention, improving our services, and direct marketing to existing customers), where these are not overridden by your rights and interests.</p>
                </li>
                <li className="list-none rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">Consent</p>
                  <p className="mt-1 text-muted-foreground text-xs">Where we process special category data (health, dietary, disability information) or send marketing to new contacts, we rely on your explicit consent. You may withdraw consent at any time.</p>
                </li>
              </ul>
            </Section>

            <Section id="who-we-share" number="5" title="Who We Share Your Data With">
              <p>We share your personal data with the following categories of third parties, only to the extent necessary:</p>
              <ul className="mt-3 space-y-2 pl-0">
                <BulletItem><strong>Travel suppliers:</strong> airlines, hotels, cruise operators, car hire companies, transfer providers and tour operators — to fulfil your booking</BulletItem>
                <BulletItem><strong>Payment processors:</strong> for secure handling of payment card transactions</BulletItem>
                <BulletItem><strong>Regulatory authorities:</strong> Civil Aviation Authority (ATOL), HMRC, and other statutory bodies as required by law</BulletItem>
                <BulletItem><strong>Border and immigration authorities:</strong> customs, immigration and border control agencies as required for international travel (including US CBP for US-bound travel)</BulletItem>
                <BulletItem><strong>IT and software providers:</strong> providers of our website, CRM, email and booking management systems — bound by data processing agreements</BulletItem>
                <BulletItem><strong>Fraud prevention agencies:</strong> to protect against fraudulent transactions</BulletItem>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">We do not sell, rent or trade your personal data to any third party for their own marketing purposes. We require all third parties to maintain the security of your data and to treat it in accordance with applicable data protection law.</p>
            </Section>

            <Section id="international-transfers" number="6" title="International Transfers">
              <p>Your personal data may be transferred to and processed in countries outside the UK and the European Economic Area (EEA), particularly where your travel destination requires it (for example, disclosure to US Customs and Border Protection for travel to the United States).</p>
              <p className="mt-3">Where we transfer your data outside the UK/EEA, we ensure it is protected by at least one of the following:</p>
              <ul className="mt-3 space-y-1.5 pl-0">
                <BulletItem>The country has been deemed to provide adequate data protection by the UK Government</BulletItem>
                <BulletItem>We have put in place UK-approved Standard Contractual Clauses with the recipient</BulletItem>
                <BulletItem>The transfer is necessary to perform your travel contract (e.g. passing booking data to a hotel in your destination country)</BulletItem>
              </ul>
            </Section>

            <Section id="retention" number="7" title="Retention Periods">
              <p>We retain personal data only for as long as is necessary for the purposes for which it was collected, including to satisfy legal, accounting or regulatory requirements.</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th className="px-5 py-3 text-left font-semibold">Data type</th>
                      <th className="px-5 py-3 text-left font-semibold">Retention period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-5 py-3">Booking and travel records</td>
                      <td className="px-5 py-3 text-muted-foreground">7 years from travel date</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Payment and financial records</td>
                      <td className="px-5 py-3 text-muted-foreground">7 years (HMRC requirement)</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">ATOL certificates and records</td>
                      <td className="px-5 py-3 text-muted-foreground">5 years after ATOL expiry</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Customer communications</td>
                      <td className="px-5 py-3 text-muted-foreground">3 years from last contact</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Marketing preferences</td>
                      <td className="px-5 py-3 text-muted-foreground">Until you unsubscribe or withdraw consent</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Website usage data</td>
                      <td className="px-5 py-3 text-muted-foreground">26 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="your-rights" number="8" title="Your Rights">
              <p>Under UK GDPR, you have the following rights in relation to your personal data:</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Right to access", desc: "Request a copy of the personal data we hold about you (Subject Access Request)." },
                  { title: "Right to rectification", desc: "Request correction of any inaccurate or incomplete personal data." },
                  { title: "Right to erasure", desc: "Request deletion of your personal data where we no longer have a lawful basis to hold it." },
                  { title: "Right to restriction", desc: "Request that we restrict the processing of your data in certain circumstances." },
                  { title: "Right to data portability", desc: "Receive your data in a structured, machine-readable format and transfer it to another organisation." },
                  { title: "Right to object", desc: "Object to processing based on legitimate interests or for direct marketing purposes." },
                  { title: "Right to withdraw consent", desc: "Withdraw consent at any time where we rely on consent as the legal basis — without affecting prior processing." },
                  { title: "Right to complain", desc: "Lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk." },
                ].map((r) => (
                  <div key={r.title} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-semibold text-foreground text-sm">{r.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-muted-foreground">To exercise any of these rights, please contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>. We will respond within one month. We may need to verify your identity before processing your request.
              </p>
              <p className="mt-3 text-muted-foreground">To make a complaint to the ICO:{" "}
                <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk/make-a-complaint</a>{" "}
                or call 0303 123 1113.
              </p>
            </Section>

            <Section id="cookies" number="9" title="Cookies">
              <p>Our website uses cookies — small text files placed on your device — to make the site work, to understand how it is used, and to improve your experience.</p>

              <div className="mt-4 space-y-3">
                <CookieRow
                  type="Strictly necessary"
                  examples="Session management, security tokens, shopping cart"
                  basis="These are essential for the site to function and cannot be disabled."
                />
                <CookieRow
                  type="Performance &amp; analytics"
                  examples="Page load times, popular pages, error tracking"
                  basis="Help us understand how visitors interact with the site. Enabled with your consent."
                />
                <CookieRow
                  type="Functional"
                  examples="Remembering your preferences, language settings"
                  basis="Improve the experience by remembering choices you make. Enabled with your consent."
                />
                <CookieRow
                  type="Marketing"
                  examples="Advertising network cookies for retargeting"
                  basis="Only placed with your explicit consent via our cookie banner."
                />
              </div>

              <p className="mt-4 text-xs text-muted-foreground">You can manage or withdraw your cookie consent at any time via your browser settings or our cookie preference centre. Disabling strictly necessary cookies may affect site functionality.</p>
            </Section>

            <Section id="children" number="10" title="Children's Privacy">
              <p>Our services are not directed to children under the age of 18. We do not knowingly collect personal data from anyone under 18 without the consent of a parent or guardian. When minors are included in a booking, their data is provided and consented to by the adult lead passenger on the booking. If you believe we have inadvertently collected data about a child without proper consent, please contact us immediately.</p>
            </Section>

            <Section id="changes" number="11" title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will reflect any changes. Where changes are material, we will notify you by email or by a prominent notice on our website. We encourage you to review this policy periodically.</p>
            </Section>

            <Section id="contact-dpo" number="12" title="Contact Us">
              <p>If you have questions, concerns or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</p>
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">LUXEONAIR LTD — Data Privacy</p>
                <p className="mt-2 text-muted-foreground">{SITE.address}</p>
                <p className="mt-1">
                  Email:{" "}
                  <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a>
                </p>
              </div>
              <p className="mt-4 text-muted-foreground">
                If you are not satisfied with our response, you have the right to lodge a complaint with the{" "}
                <strong>Information Commissioner&apos;s Office (ICO)</strong>:{" "}
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a>{" "}
                · Tel: 0303 123 1113.
              </p>
            </Section>

            {/* Cross-link to T&C */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Related</p>
              <p className="mt-2 text-sm">
                This Privacy Policy should be read alongside our{" "}
                <a href="/terms" className="text-primary font-medium hover:underline">Terms &amp; Conditions</a>, which govern your bookings with Luxeonair.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function Section({ id, number, title, children }: { id: string; number?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
        {number && (
          <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
            {number}
          </span>
        )}
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 mb-1 font-semibold text-foreground">{children}</p>;
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 list-none">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}

function PurposeRow({ purpose, detail }: { purpose: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
      <div>
        <p className="font-semibold text-foreground">{purpose}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function CookieRow({ type, examples, basis }: { type: string; examples: string; basis: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-semibold text-foreground text-sm">{type}</p>
      <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground/70">Examples:</span> {examples}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{basis}</p>
    </div>
  );
}
