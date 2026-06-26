import { createFileRoute } from "@tanstack/react-router";
import { User, Database, Settings, Share2, Globe, Clock, ShieldCheck, Cookie, Baby, RefreshCw, Phone } from "lucide-react";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Luxeonair" },
      { name: "description", content: "How Luxeonair LTD collects, uses and protects your personal data in line with UK GDPR. Learn what we collect, why we collect it, and your rights." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.com/privacy" }],
  }),
  component: PrivacyPage,
});

const TOC = [
  { id: "who-we-are",           icon: User,        label: "1. Who We Are" },
  { id: "data-we-collect",      icon: Database,    label: "2. Data We Collect" },
  { id: "how-we-use",           icon: Settings,    label: "3. How We Use Your Data" },
  { id: "legal-basis",          icon: ShieldCheck, label: "4. Legal Basis" },
  { id: "who-we-share",         icon: Share2,      label: "5. Who We Share With" },
  { id: "international",        icon: Globe,       label: "6. International Transfers" },
  { id: "retention",            icon: Clock,       label: "7. Retention Periods" },
  { id: "your-rights",          icon: ShieldCheck, label: "8. Your Rights" },
  { id: "cookies",              icon: Cookie,      label: "9. Cookies" },
  { id: "children",             icon: Baby,        label: "10. Children's Privacy" },
  { id: "changes",              icon: RefreshCw,   label: "11. Policy Changes" },
  { id: "contact",              icon: Phone,       label: "12. Contact Us" },
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
            Your data is yours. This policy explains exactly what we collect when you use our services, why we need it, and what you can do about it.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-navy-fg/40">
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">Last updated: June 2026</span>
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">UK GDPR compliant</span>
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">ICO registered</span>
          </div>
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Jump to section</p>
              <nav className="space-y-0.5">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <item.icon className="h-3 w-3 shrink-0 text-gold/60" />
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-5 border-t border-border pt-4 space-y-2">
                <a href="/terms" className="flex items-center gap-2 text-xs text-primary hover:underline">
                  <ShieldCheck className="h-3 w-3" /> View Terms &amp; Conditions
                </a>
                <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:underline">
                  <Globe className="h-3 w-3" /> ICO Complaints
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-10 text-sm leading-relaxed">

            {/* Intro card */}
            <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
              <p className="text-sm text-foreground/80">
                <strong className="text-foreground">LUXEONAIR LTD</strong> is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share and safeguard information about you when you use our website or book travel with us, in full compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>

            <Section id="who-we-are" number="1" icon={User} title="Who We Are">
              <p>The data controller responsible for your personal data is:</p>
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">LUXEONAIR LTD</p>
                <p className="mt-1 text-muted-foreground">{SITE.address}</p>
                <div className="mt-2 space-y-0.5">
                  <p>Email: <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a></p>
                  <p>Phone: <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a></p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Company No. 17264512, registered in England &amp; Wales</p>
              </div>
              <p className="mt-4 text-muted-foreground">If you have any questions about this policy or want to exercise your rights, please use the contact details above.</p>
            </Section>

            <Section id="data-we-collect" number="2" icon={Database} title="Data We Collect">
              <p>We collect personal data in the following ways:</p>

              <div className="mt-4 space-y-3">
                <DataRow
                  title="Identity & contact data"
                  items={["Full name and date of birth", "Email address and telephone number", "Postal address"]}
                />
                <DataRow
                  title="Travel data"
                  items={["Passport number and nationality", "Travel preferences, seat preferences and dietary requirements", "Booking history and trip details"]}
                />
                <DataRow
                  title="Payment data"
                  items={["Payment card details and billing address (processed securely; we do not store full card numbers)", "Bank transfer details where relevant"]}
                />
                <DataRow
                  title="Special category data"
                  items={["Health or medical conditions and disabilities", "Dietary requirements related to religion or belief", "Only collected where you volunteer it and it is necessary to arrange your travel"]}
                  highlight
                />
                <DataRow
                  title="Technical & usage data"
                  items={["IP address, browser type and version", "Pages visited, links clicked and session duration", "Cookie data (see Clause 9)"]}
                />
              </div>
            </Section>

            <Section id="how-we-use" number="3" icon={Settings} title="How We Use Your Data">
              <p>We use your personal data only for the following clearly defined purposes:</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Making & managing your booking", detail: "Processing your travel arrangements, sending booking confirmations, issuing tickets and providing pre-departure information." },
                  { title: "Customer support", detail: "Responding to your enquiries, handling complaints and supporting you during your trip or on your return." },
                  { title: "Processing payments", detail: "Collecting deposits and balances, processing refunds and detecting fraudulent transactions." },
                  { title: "Legal & regulatory compliance", detail: "Providing information to border control, customs, immigration authorities and other bodies as required by law, including ATOL obligations." },
                  { title: "Travel inspiration & offers", detail: "Sending you curated travel ideas and member-only deals only where you have given consent or where we have a legitimate interest you have not opted out of." },
                  { title: "Improving our services", detail: "Analysing how our website is used, running customer satisfaction surveys and improving the overall experience." },
                ].map((p) => (
                  <div key={p.title} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-semibold text-foreground text-sm">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="legal-basis" number="4" icon={ShieldCheck} title="Legal Basis for Processing">
              <p>Under UK GDPR, we must have a lawful reason for processing your personal data. We rely on the following:</p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    basis: "Performance of a contract",
                    detail: "Most of our processing is necessary to perform the contract we have with you, including making your booking, issuing tickets and delivering your travel services.",
                    tag: "Core processing",
                  },
                  {
                    basis: "Legal obligation",
                    detail: "Some processing is required to meet legal and regulatory obligations, including ATOL requirements, HMRC reporting and disclosure to border control authorities.",
                    tag: "Required by law",
                  },
                  {
                    basis: "Legitimate interests",
                    detail: "Fraud prevention, improving our services and direct marketing to existing customers, where these interests are not overridden by your rights and freedoms.",
                    tag: "Balanced interests",
                  },
                  {
                    basis: "Consent",
                    detail: "Where we process special category data (health, disability or dietary information) or send marketing to new contacts, we rely on your explicit consent. You can withdraw this at any time.",
                    tag: "Opt-in only",
                  },
                ].map((l) => (
                  <div key={l.basis} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="mt-0.5 flex h-6 shrink-0 items-center">
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">{l.tag}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{l.basis}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="who-we-share" number="5" icon={Share2} title="Who We Share Your Data With">
              <p>We share your personal data only to the extent necessary, and only with the following categories of third parties:</p>
              <ul className="mt-4 space-y-2">
                <BulletItem><strong>Travel suppliers:</strong> airlines, hotels, cruise operators, car hire companies, transfer providers and tour operators, to fulfil your booking.</BulletItem>
                <BulletItem><strong>Payment processors:</strong> for secure handling of payment card transactions.</BulletItem>
                <BulletItem><strong>Regulatory authorities:</strong> Civil Aviation Authority (ATOL), HMRC and other statutory bodies as required by law.</BulletItem>
                <BulletItem><strong>Border and immigration authorities:</strong> customs and border control agencies as required for international travel, including US CBP for US-bound travel.</BulletItem>
                <BulletItem><strong>IT and software providers:</strong> providers of our website, email and booking management systems, all bound by data processing agreements.</BulletItem>
                <BulletItem><strong>Fraud prevention agencies:</strong> to protect against fraudulent transactions.</BulletItem>
              </ul>
              <p className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">We do not sell, rent or trade your personal data to any third party for their own marketing purposes. We require all third parties to maintain appropriate security and treat your data in accordance with applicable data protection law.</p>
            </Section>

            <Section id="international" number="6" icon={Globe} title="International Transfers">
              <p>Your personal data may be transferred to and processed in countries outside the UK and the European Economic Area (EEA), particularly where your travel destination requires it. For example, we are required to disclose certain booking data to US Customs and Border Protection for US-bound travel.</p>
              <p className="mt-3">Where we transfer your data internationally, we ensure it is protected by at least one of the following:</p>
              <ul className="mt-3 space-y-1.5">
                <BulletItem>The recipient country has been deemed to provide adequate data protection by the UK Government.</BulletItem>
                <BulletItem>We have put in place UK-approved Standard Contractual Clauses with the recipient.</BulletItem>
                <BulletItem>The transfer is necessary to perform your travel contract (e.g. sharing booking data with a hotel in your destination country).</BulletItem>
              </ul>
            </Section>

            <Section id="retention" number="7" icon={Clock} title="Retention Periods">
              <p>We only keep your personal data for as long as we genuinely need it, taking into account legal, accounting and regulatory requirements.</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Data type</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Kept for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Booking and travel records", "7 years from travel date"],
                      ["Payment and financial records", "7 years (HMRC requirement)"],
                      ["ATOL certificates and records", "5 years after ATOL expiry"],
                      ["Customer communications", "3 years from last contact"],
                      ["Marketing preferences", "Until you unsubscribe or withdraw consent"],
                      ["Website usage data", "26 months"],
                    ].map(([type, period]) => (
                      <tr key={type} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3">{type}</td>
                        <td className="px-5 py-3 text-muted-foreground">{period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="your-rights" number="8" icon={ShieldCheck} title="Your Rights">
              <p>Under UK GDPR, you have the following rights over your personal data. You can exercise any of these by contacting us at <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>. We will respond within one month and may need to verify your identity first.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Right to access", desc: "Request a copy of the personal data we hold about you (Subject Access Request)." },
                  { title: "Right to rectification", desc: "Ask us to correct any inaccurate or incomplete information we hold." },
                  { title: "Right to erasure", desc: "Ask us to delete your data where we no longer have a lawful reason to hold it." },
                  { title: "Right to restriction", desc: "Ask us to limit how we process your data in certain circumstances." },
                  { title: "Right to portability", desc: "Receive your data in a structured format and transfer it to another organisation." },
                  { title: "Right to object", desc: "Object to processing based on legitimate interests, or to direct marketing at any time." },
                  { title: "Right to withdraw consent", desc: "Withdraw consent at any time where we rely on it as our legal basis, without affecting prior processing." },
                  { title: "Right to complain", desc: "Lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk." },
                ].map((r) => (
                  <div key={r.title} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{r.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-muted-foreground text-xs">
                To complain to the ICO: <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk/make-a-complaint</a> or call 0303 123 1113.
              </p>
            </Section>

            <Section id="cookies" number="9" icon={Cookie} title="Cookies">
              <p>Our website uses cookies, small text files stored on your device, to make the site work correctly, understand how it is used, and improve your experience.</p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    type: "Strictly necessary",
                    tag: "Always on",
                    examples: "Session management, security tokens",
                    note: "Essential for the site to function. Cannot be disabled.",
                    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                  },
                  {
                    type: "Performance & analytics",
                    tag: "Consent required",
                    examples: "Page load times, popular pages, error tracking",
                    note: "Help us understand how visitors use the site. Enabled with your consent.",
                    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                  },
                  {
                    type: "Functional",
                    tag: "Consent required",
                    examples: "Language settings, remembered preferences",
                    note: "Improve your experience by remembering choices you make.",
                    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                  },
                  {
                    type: "Marketing",
                    tag: "Opt-in only",
                    examples: "Advertising networks, retargeting",
                    note: "Only placed with your explicit consent via our cookie banner.",
                    tagColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
                  },
                ].map((c) => (
                  <div key={c.type} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-foreground">{c.type}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.tagColor}`}>{c.tag}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground/70">Examples:</span> {c.examples}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">You can manage or withdraw your cookie preferences at any time via your browser settings or our cookie preference centre. Disabling strictly necessary cookies may affect how the site works.</p>
            </Section>

            <Section id="children" number="10" icon={Baby} title="Children's Privacy">
              <p>Our services are not directed at children under 18. We do not knowingly collect personal data from anyone under 18 without the consent of a parent or guardian. Where minors are included in a booking, their data is provided and consented to by the adult lead passenger. If you believe we have inadvertently collected data about a child without proper consent, please contact us immediately so we can address it.</p>
            </Section>

            <Section id="changes" number="11" icon={RefreshCw} title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time as our services evolve or legal requirements change. The &ldquo;Last updated&rdquo; date at the top of this page will always reflect the most recent version. Where changes are material, we will let you know by email or by a prominent notice on our website. We encourage you to review this page periodically.</p>
            </Section>

            <Section id="contact" number="12" icon={Phone} title="Contact Us">
              <p>Questions, concerns or requests about your data are always welcome. Please reach out to us directly:</p>
              <div className="mt-4 rounded-xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">LUXEONAIR LTD, Data Privacy</p>
                <p className="mt-2 text-muted-foreground">{SITE.address}</p>
                <div className="mt-2 space-y-0.5">
                  <p>Email: <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a></p>
                  <p>Phone: <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a></p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                If you are not satisfied with our response, you have the right to contact the <strong>Information Commissioner's Office (ICO)</strong> directly: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a>, telephone: 0303 123 1113.
              </p>
            </Section>

            {/* Cross-link */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">Related</p>
              <p className="text-sm text-muted-foreground">
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

function Section({ id, number, icon: Icon, title, children }: { id: string; number: string; icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy">
          <Icon className="h-3.5 w-3.5 text-gold" />
        </span>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <span className="ml-auto text-xs text-muted-foreground">{number}</span>
      </div>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </section>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 list-none">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}

function DataRow({ title, items, highlight }: { title: string; items: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20" : "border-border bg-card"}`}>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
