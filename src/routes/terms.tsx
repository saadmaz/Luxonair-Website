import { createFileRoute } from "@tanstack/react-router";
import { FileText, Shield, Plane, CreditCard, AlertTriangle, Phone, Globe, Briefcase, Lock } from "lucide-react";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Luxeonair" },
      { name: "description", content: "Booking conditions for Luxeonair LTD. Covers ATOL protection, flight bookings, cancellation policy, payments and your rights as a UK travel customer." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/terms" }],
  }),
  component: TermsPage,
});

const TOC = [
  { id: "preamble",           icon: FileText,      label: "Introduction" },
  { id: "contract",           icon: Shield,        label: "1. Contract" },
  { id: "package-bookings",   icon: Briefcase,     label: "2. Package Bookings" },
  { id: "booking",            icon: Globe,         label: "3. Booking" },
  { id: "flight-bookings",    icon: Plane,         label: "4. Flight Bookings" },
  { id: "price-payment",      icon: CreditCard,    label: "5. Price & Payment" },
  { id: "cancellation",       icon: AlertTriangle, label: "6. Cancellation & Amendment" },
  { id: "travel-insurance",   icon: Shield,        label: "7. Travel Insurance" },
  { id: "financial-protection", icon: Shield,      label: "8. Financial Protection" },
  { id: "documents",          icon: FileText,      label: "9. Delivery of Documents" },
  { id: "passports",          icon: Globe,         label: "10. Passports, Visas & Health" },
  { id: "final-arrangements", icon: Plane,         label: "11. Final Arrangements" },
  { id: "complaints",         icon: Phone,         label: "12. Complaints" },
  { id: "responsibility",     icon: Shield,        label: "13. Responsibility" },
  { id: "extraordinary",      icon: AlertTriangle, label: "14. Extraordinary Circumstances" },
  { id: "accommodation",      icon: Globe,         label: "15. Accommodation Ratings" },
  { id: "documentation",      icon: FileText,      label: "16. Documentation" },
  { id: "safety",             icon: Shield,        label: "17. Safety & Security" },
  { id: "behaviour",          icon: Shield,        label: "18. Your Behaviour" },
  { id: "data-protection",    icon: Lock,          label: "19. Data Protection" },
  { id: "service-charges",    icon: CreditCard,    label: "20. Service Charges" },
];

function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            We've written these in plain English wherever the law allows. These booking conditions govern everything between you and Luxeonair LTD. Please read them before making any booking.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-navy-fg/40">
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">Last updated: June 2026</span>
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">Governed by English law</span>
            <span className="rounded-full border border-navy-fg/15 px-3 py-1">Company No. 17264512</span>
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
              <div className="mt-5 border-t border-border pt-4">
                <a href="/privacy" className="flex items-center gap-2 text-xs text-primary hover:underline">
                  <Lock className="h-3 w-3" /> View Privacy Policy
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-10 text-sm leading-relaxed">

            {/* Preamble */}
            <section id="preamble" className="scroll-mt-6">
              <div className="mb-5 rounded-2xl border border-gold/25 bg-gold/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-2">Who this applies to</p>
                <p className="text-foreground/80">
                  These Terms &amp; Conditions (also called booking conditions), together with our Privacy Policy, Cookie Policy and any other written information we have brought to your attention before confirming your booking, apply to your booking with <strong>LUXEONAIR LTD</strong>, trading as Luxeonair, registered in England &amp; Wales under company number <strong>17264512</strong>, with our registered office at <strong>{SITE.address}</strong>.
                </p>
                <p className="mt-3 text-foreground/80">
                  On this page, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Luxeonair. &ldquo;You&rdquo;, &ldquo;your&rdquo; and &ldquo;client&rdquo; refer to you and all persons named on the booking, including anyone added or substituted at a later date.
                </p>
              </div>

              <p className="text-foreground/80">By making a booking, you confirm on behalf of all persons named that each person:</p>
              <ul className="mt-3 space-y-2">
                <BulletItem>Has read these Booking Conditions and agrees to be bound by them.</BulletItem>
                <BulletItem>Consents to our use of personal data in accordance with our Privacy Policy, including any special category data such as health information or disabilities.</BulletItem>
                <BulletItem>Is over 18 years of age.</BulletItem>
                <BulletItem>Accepts financial responsibility for payment on behalf of all persons on the booking.</BulletItem>
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoBox icon={Plane} title="Single bookings">
                  When we sell a single travel service (flight, hotel or car hire only), we act as agent. ATOL protection applies to some but not all flight-only sales. We will tell you which apply and issue an ATOL Certificate where relevant. See Clause 8.
                </InfoBox>
                <InfoBox icon={Briefcase} title="Packages we organise">
                  When we combine two or more travel services for the same trip, we accept responsibility as a package organiser under the Package Travel Regulations 2018. Financial protection details are in Section B, Clause 5.
                </InfoBox>
                <InfoBox icon={Shield} title="Third-party packages">
                  Where we sell a package organised by a tour operator acting as their agent, that operator is responsible to you for the package and financial protection. Their ATOL number will appear in your booking confirmation.
                </InfoBox>
              </div>

              <p className="mt-5 text-muted-foreground text-xs">
                All customer service queries should be sent to: <strong>Luxeonair, {SITE.address}</strong> or by email to <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
              </p>
            </section>

            {/* Section A banner */}
            <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-6 text-navy-fg">
              <div className="absolute inset-y-0 left-0 w-1 bg-gold rounded-l-2xl" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Section A</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">Applicable to All Bookings</h2>
              <p className="mt-1 text-sm text-navy-fg/55">The following clauses apply regardless of booking type.</p>
            </div>

            <Clause id="contract" number="1" title="Contract">
              <p>When you make a booking, we arrange for you to enter into a contract with each relevant third-party supplier, as specified on your booking confirmation. Your contract comes into existence once we issue that confirmation.</p>
              <p className="mt-3">Your booking is subject to both these Booking Conditions and the individual terms of each supplier. Where any conflict arises between them, the supplier's term will take precedence unless it is found invalid under English law, in which case our term prevails. Suppliers' conditions may also limit their liability to you. Copies are available on request.</p>
              <p className="mt-3">As an agent, we accept no responsibility for the acts or omissions of suppliers or for the travel services they provide, unless we are the organiser of your package holiday under the Package Travel Regulations, in which case Section B applies.</p>
            </Clause>

            <Clause id="package-bookings" number="2" title="Package Bookings">
              <p>Where we combine and sell two or more of the travel services below for the same trip, this constitutes a &ldquo;Package&rdquo; and we take responsibility as an organiser under the Package Travel Regulations, provided those services are purchased together in a single visit, sold at an inclusive price, or advertised as a package.</p>
              <p className="mt-3">Qualifying travel services: <strong>(a)</strong> transport (e.g. flight); <strong>(b)</strong> accommodation; <strong>(c)</strong> car or vehicle rental; <strong>(d)</strong> other tourist services not intrinsically part of the above.</p>
              <Note>Other tourist services only create a Package where they account for 25% or more of the combined value or form an essential feature. Tourist services selected after the main service has begun do not create a Package. Your booking confirmation will confirm whether a Package has been purchased and identify the responsible party.</Note>
            </Clause>

            <Clause id="booking" number="3" title="Booking">
              <p>Bookings can be made online at <strong>www.luxeonair.co.uk</strong>, by telephone, or in person. All bookings are subject to availability at the time of booking.</p>
              <p className="mt-3">Where you book online, the order summary email is an acknowledgement only, not a contractual acceptance. We will issue a formal booking confirmation once the travel services are confirmed as available, and that is when the binding contract comes into existence.</p>
              <p className="mt-3">It is your responsibility to check that all names in the booking confirmation exactly match the passports of all travellers, and that the travel itinerary reflects your requirements. Changes are rarely possible once flight tickets are issued and may incur extra charges. If you need to make any changes, please contact us on the same day of reservation before 11:30pm to benefit from minimum amendment penalties.</p>
              <p className="mt-3">On receipt of travel documents, check that names, dates and timings are accurate and notify us immediately of any errors. All flight tickets and products are non-refundable, non-changeable and non-transferable unless otherwise stated.</p>
            </Clause>

            <Clause id="flight-bookings" number="4" title="Flight Bookings">
              <SubHeading>Financial protection</SubHeading>
              <p>When you buy an ATOL-protected flight from us, you will receive an ATOL Certificate listing what is financially protected. You will be informed at time of booking whether your flight is ATOL protected. Not all flights are ATOL protected; some flight-only sales are sold by us as agents for the airline.</p>

              <SubHeading>Availability &amp; fares</SubHeading>
              <p>Seat availability and pricing are at the airline's discretion. Flight times shown are provisional and subject to change. Most airlines stipulate that bookings are non-refundable. Airfares can increase quickly after an initial quotation, so please complete payment within 1 hour of booking confirmation to secure the offered fare. If the fare has changed by payment time, you have the right to cancel and receive a full refund.</p>

              <SubHeading>Seating &amp; meals</SubHeading>
              <p>Where possible we will send your seat requests to the airline, though seat allocation is entirely at the airline's discretion; early check-in is the best way to secure your preferred seat. Exit row and extra-legroom seats are generally assigned at check-in only. Meal requests will be forwarded but are not guaranteed.</p>

              <SubHeading>Baggage</SubHeading>
              <p>Our prices include the standard baggage allowance set by the airline. Some airlines treat hold luggage as an optional extra; where this applies, it will not be included in headline prices and can be added at booking. Please refer to your booking confirmation for your specific allowances.</p>
              <div className="mt-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Hand luggage liquids:</strong> Containers must hold no more than 100ml and be placed in a single transparent re-sealable plastic bag (max 1 litre, approx 20cm x 20cm). See <a href="https://www.gov.uk/hand-luggage-restrictions/overview" target="_blank" rel="noopener noreferrer" className="underline">gov.uk/hand-luggage-restrictions</a>.
              </div>

              <SubHeading>Check-in</SubHeading>
              <p>Check-in procedures are included in your booking confirmation. Some airlines require online check-in; failure to complete this will result in airport check-in fees payable by you. We recommend arriving at least 3 hours before departure for intercontinental flights and 2 hours for European or domestic flights. Check-in counters close 60 minutes before departure and gates close 15 minutes before departure. Tickets cannot be refunded or changed due to a no-show or late check-in.</p>

              <SubHeading>Amendments &amp; cancellations</SubHeading>
              <p>Most flight bookings are non-refundable by the airline. Any amendment or cancellation will incur charges. If any part of your flight is missed or marked as a no-show, the airline may automatically cancel remaining segments. Please inform us in advance if you are unable to travel. See Clause 6 for full details.</p>
            </Clause>

            <Clause id="price-payment" number="5" title="Price &amp; Payment">
              <p>The price of your holiday includes all taxes and fees known at the time of booking. Where additional charges cannot be calculated in advance, you will be given a clear indication of likely additional costs.</p>
              <p className="mt-3">To book, you will be required to pay a deposit or the full balance depending on when you book relative to the departure date. Where only a deposit is paid, the balance must be paid by the due date shown on your booking confirmation. Failure to pay the balance may result in the supplier cancelling your booking and applying cancellation fees.</p>
              <Note>Except where otherwise stated, all monies you pay are held on behalf of the relevant supplier. Money paid for ATOL-protected bookings is held on behalf of and for the benefit of the Trustees of the Air Travel Trust.</Note>

              <SubHeading>Price changes</SubHeading>
              <p>We may change your holiday price after booking only if costs change due to fuel prices, third-party taxes or fees, or exchange rate movements. There will be no price change within 20 days of departure.</p>
              <ul className="mt-3 space-y-2">
                <BulletItem>We will absorb increases up to 2% of the travel price. You will be charged for any amount above 2%.</BulletItem>
                <BulletItem>If the increase exceeds 8%, you may accept an alternative holiday (with a refund if lower in value) or cancel and receive a full refund of all monies paid, excluding amendment charges.</BulletItem>
                <BulletItem>If the price decreases, we will pass on the saving after deducting our administrative costs.</BulletItem>
              </ul>
            </Clause>

            <Clause id="cancellation" number="6" title="Cancellation &amp; Amendment">
              <SubHeading>Cancellations</SubHeading>
              <p>You may cancel your booking at any time by sending a written request to Customer Services, Luxeonair, {SITE.address}, or by email to <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>. Cancellation takes effect from the moment we receive it in writing.</p>
              <p className="mt-3">The supplier may charge cancellation fees as specified in their terms, potentially up to 100% of the travel price depending on timing. Bookings are generally non-refundable once confirmed unless otherwise stated. An administration fee per passenger also applies; see Clause 20.</p>

              <SubHeading>Amendments</SubHeading>
              <p>All amendment requests must be submitted in writing to Customer Services at the postal address or email above. We cannot guarantee that amendments can be made after confirmation; this depends on the relevant supplier's terms. An amendment fee per passenger applies (see Clause 20), together with any charges from the airline or supplier. If you hold travel insurance, you may be able to claim any such charges under your policy.</p>
            </Clause>

            <Clause id="travel-insurance" number="7" title="Travel Insurance">
              <p>We strongly recommend taking out comprehensive travel insurance as soon as you book. Check that it covers all destinations, the full duration of your trip, planned activities and any pre-existing medical conditions. A good policy will cover cancellation charges, delays, lost baggage and medical expenses abroad. Don't just go with the cheapest; read the policy carefully to make sure the cover actually meets your needs.</p>
            </Clause>

            <Clause id="financial-protection" number="8" title="Financial Protection">
              <SubHeading>Flight only</SubHeading>
              <p>We provide financial protection for some of our flight-only services via our Air Travel Organiser's Licence (ATOL), issued by the Civil Aviation Authority, Gatwick Airport South, West Sussex, RH6 0YR, telephone: 0333 103 6350, email: <a href="mailto:claims@caa.co.uk" className="text-primary hover:underline">claims@caa.co.uk</a>.</p>
              <p className="mt-3">When you buy an ATOL-protected flight, you will receive an ATOL Certificate. Flights sold as authorised ticket agents for the airline are not ATOL protected. If you do not receive an ATOL Certificate, your flight will not be ATOL protected.</p>

              <SubHeading>Flight packages</SubHeading>
              <p>Where we sell a flight package as agent for an organiser, you will be protected by that organiser's ATOL; their name and number will be in your booking confirmation. Where we sell a flight package as organiser, please refer to Section B, Clause 5. In the unlikely event of insolvency, an alternative ATOL holder may provide the services at no extra cost. If no alternative can be appointed, you may make a claim under the ATOL scheme or via your credit card issuer.</p>

              <SubHeading>Non-flight packages</SubHeading>
              <p>Where we act as agent for a package organised by a third party, we will advise you of the financial protection arranged by that organiser. We are only responsible for arranging financial protection where we are the organiser (see Section B, Clause 5).</p>
            </Clause>

            <Clause id="documents" number="9" title="Delivery of Documents">
              <p>All travel documents will be sent by email within 48 to 72 hours following full payment, or by post on request. For very late bookings, documents can be sent within 24 hours. Once documents are posted, no liability is accepted by us unless any loss is due to our negligence. If tickets need to be reissued, all reissuing costs are to be borne by you. Documents can only be reissued up to 7 days before departure. Courier delivery is available at your cost on request.</p>
            </Clause>

            <Clause id="passports" number="10" title="Passports, Visas &amp; Health">
              <p>It is your responsibility to inform us of any medical conditions and reduced mobility before booking so we can ensure the trip is suitable for your specific needs. While we can provide general guidance on passport, visa and health requirements, it is ultimately your responsibility to check your specific circumstances with the relevant Embassies, Consulates and your doctor.</p>

              <SubHeading>Passports</SubHeading>
              <p>Most countries require passports to be valid for at least 6 months beyond your return date, and in excellent condition. A machine-readable passport is mandatory for travel to the USA. We strongly advise checking precise requirements with the relevant embassy before booking.</p>

              <SubHeading>Visas</SubHeading>
              <p>A transit visa may be required for connecting flights through certain countries; we will advise where possible. Please also check <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gov.uk/foreign-travel-advice</a>. An ESTA is required for all US-bound travel. An ETA is required for Australia and Canada. For European travel, obtain an EHIC prior to departure.</p>

              <SubHeading>Pregnancy</SubHeading>
              <p>Most airlines reserve the right to refuse boarding to a woman in advanced pregnancy. Please inform us at the time of booking if you or anyone in your party is pregnant so we can check the airline's policy. A medical certificate confirming fitness to travel may be required.</p>

              <SubHeading>Children travelling alone</SubHeading>
              <p>Additional documentation is generally required for children travelling unaccompanied or without their parents. Please notify us in advance. We cannot be held responsible for any refusal to board or delay caused by failure to obtain the required documentation.</p>

              <Note>We do not accept responsibility if you cannot travel or incur any loss because you have not complied with passport, visa, immigration or health requirements. You agree to reimburse us for any fines or losses we incur as a result of your non-compliance.</Note>
            </Clause>

            <Clause id="final-arrangements" number="11" title="Final Travel Arrangements">
              <p>Please ensure all your travel, passport, visa and insurance documents are in order and that you arrive at the airport in plenty of time for check-in. It may be necessary to reconfirm your flight prior to departure; please ask us for your airline's contact details and reconfirm at least 72 hours before your outbound flight. Note any reference numbers or contact names when reconfirming. Failure to reconfirm may result in refusal of boarding and it is unlikely a refund will be issued.</p>
            </Clause>

            <Clause id="complaints" number="12" title="Complaints">
              <p>As your agent, we will assist you with any complaint. Contact our Customer Services at <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a> or write to us at Luxeonair, {SITE.address}. As your contract is with the supplier directly, any queries should be raised with them first.</p>
              <p className="mt-3">If a problem arises during your holiday, report it to the supplier or their local representative immediately. Failing to do so may reduce any compensation you are entitled to. On your return, write to the principal or supplier directly and let us know so we can assist. You may also use the European Commission Online Dispute Resolution platform at <a href="https://www.ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ec.europa.eu/consumers/odr</a>.</p>
            </Clause>

            <Clause id="responsibility" number="13" title="Responsibility for Your Booking">
              <p>Your contract is with the supplier, and their booking conditions apply. As an agent, our responsibilities are limited to making the booking in accordance with your instructions. We accept no responsibility for information passed on to you in good faith. In the event we are found liable on any basis, our maximum liability is limited to twice the commission we earn on your booking (or the appropriate proportion if not everyone on the booking is affected).</p>
              <p className="mt-3">We do not exclude or limit liability for death or personal injury arising from our own negligence or that of our employees acting in the course of their employment.</p>
              <Note>Where we are the organiser of a Package under the Package Travel Regulations, the additional terms in Section B apply.</Note>
            </Clause>

            <Clause id="extraordinary" number="14" title="Unavoidable &amp; Extraordinary Circumstances">
              <p>We will not be liable or pay compensation if our contractual obligations are affected by events beyond our reasonable control, the consequences of which could not have been avoided even if all reasonable measures had been taken. These include but are not limited to:</p>
              <ul className="mt-3 space-y-1.5">
                <BulletItem>Warfare, terrorism (including the threat of) and civil unrest</BulletItem>
                <BulletItem>Serious disease outbreaks or significant health risks at the travel destination</BulletItem>
                <BulletItem>Natural disasters, floods or extreme weather conditions making travel unsafe</BulletItem>
                <BulletItem>Government or authority actions, industrial disputes, strikes or lock closures</BulletItem>
                <BulletItem>Nuclear, chemical or biological disasters</BulletItem>
                <BulletItem>Unavoidable technical problems with transport or air traffic control failures</BulletItem>
              </ul>
            </Clause>

            <Clause id="accommodation" number="15" title="Accommodation Ratings &amp; Standards">
              <p>All ratings are as provided by the relevant supplier or based on our own industry knowledge and customer feedback. Our own ratings are clearly marked and are intended as a guide to services and facilities only. Standards and ratings vary between countries and suppliers and we cannot guarantee the accuracy of any rating given.</p>
            </Clause>

            <Clause id="documentation" number="16" title="Documentation &amp; Information">
              <p>All descriptions and content on our website are produced on behalf of the relevant supplier and are intended to give a general idea of the services provided. Not all details can be included. All services shown are subject to availability. Please contact us if you need further information about any aspect of your travel arrangements.</p>
            </Clause>

            <Clause id="safety" number="17" title="Safety &amp; Security">
              <p>You are responsible for making yourself aware of Foreign, Commonwealth &amp; Development Office (FCDO) advice regarding the safety of countries and areas you will be visiting, and for making your decisions accordingly. Up-to-date travel advice is available at <a href="https://www.gov.uk/travelaware" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gov.uk/travelaware</a>. FCDO advice to avoid or leave a particular country may constitute an extraordinary circumstance under Clause 14.</p>
            </Clause>

            <Clause id="behaviour" number="18" title="Your Behaviour">
              <p>You are expected to conduct yourself in an orderly and acceptable manner and not disrupt the enjoyment of others. If, in the opinion of the supplier or any person in authority, your behaviour or that of any member of your party is causing or likely to cause distress, danger or annoyance to any other customer or third party, or damage to property, the supplier reserves the right to terminate your booking immediately with no further liability to you.</p>
              <p className="mt-3">You and your party are jointly and individually liable for any damage or losses caused. Payment for any damage or losses must be made directly to the supplier prior to departure. If payment is not made, you will be responsible for meeting any claims and costs subsequently made against us.</p>
            </Clause>

            <Clause id="data-protection" number="19" title="Data Protection">
              <p>As part of your booking, we collect personal information including names, contact details, passport numbers and other identifying information. We may also need to collect special category data such as health information, disabilities or dietary requirements relating to religion or belief.</p>
              <p className="mt-3">We process this information to make your booking and pass it to relevant suppliers and other persons involved in providing your travel services. If required by law, information may be provided to public authorities such as customs or immigration. For travel to the United States, we are required to share information with US Customs and Border Protection.</p>
              <p className="mt-3">Where you travel outside the European Economic Area, we will transfer your data to suppliers in compliance with UK GDPR requirements for international transfers.</p>
              <p className="mt-3">See our <a href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</a> for full details, including your rights over your personal data.</p>
            </Clause>

            <Clause id="service-charges" number="20" title="Service Charges">
              <p>The following administration charges may apply:</p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[360px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Service</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Administration fees", "£10 to £50 per booking"],
                      ["Tailor-made itinerary planning", "No charge"],
                      ["Bookings", "No charge"],
                      ["Ticket delivery by hand", "Not available"],
                    ].map(([service, fee]) => (
                      <tr key={service} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3">{service}</td>
                        <td className="px-5 py-3 text-muted-foreground">{fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">If you pursue a financial reimbursement claim or payment dispute via third-party channels to recover the cost of your holiday or any compensation, a surcharge of 10% of the total payment may apply. These charges are subject to change and the applicable charge will be confirmed to you at the time of your request.</p>
            </Clause>

            {/* Contact card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/10">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Got a question about your booking?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our team is here to help. Email us at{" "}
                    <a href={`mailto:${SITE.email}`} className="text-primary font-medium hover:underline">{SITE.email}</a>{" "}
                    or call{" "}
                    <a href={`tel:${SITE.phone.tel}`} className="text-primary font-medium hover:underline">{SITE.phone.display}</a>.
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Luxeonair LTD · {SITE.address} · Company No. 17264512</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function Clause({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="shrink-0 rounded-full bg-navy px-2.5 py-0.5 text-xs font-semibold text-gold">
          {number}
        </span>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="space-y-0 text-sm text-foreground/80 leading-relaxed">{children}</div>
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

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
      <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold">ℹ</span>
      <span>{children}</span>
    </div>
  );
}

function InfoBox({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/10">
          <Icon className="h-3.5 w-3.5 text-gold" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
