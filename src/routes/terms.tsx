import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Luxe on Air" },
      { name: "description", content: "Booking conditions, cancellation policy, financial protection and your rights as a customer of Luxeonair LTD." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.com/terms" }],
  }),
  component: TermsPage,
});

const TOC = [
  { id: "preamble", label: "Introduction" },
  { id: "section-a", label: "Section A – All Bookings" },
  { id: "contract", label: "1. Contract" },
  { id: "package-bookings", label: "2. Package Bookings" },
  { id: "booking", label: "3. Booking" },
  { id: "flight-bookings", label: "4. Flight Bookings" },
  { id: "price-payment", label: "5. Price & Payment" },
  { id: "cancellation", label: "6. Cancellation & Amendment" },
  { id: "travel-insurance", label: "7. Travel Insurance" },
  { id: "financial-protection", label: "8. Financial Protection" },
  { id: "documents", label: "9. Delivery of Documents" },
  { id: "passports", label: "10. Passports, Visas & Health" },
  { id: "final-arrangements", label: "11. Final Travel Arrangements" },
  { id: "complaints", label: "12. Complaints" },
  { id: "responsibility", label: "13. Responsibility" },
  { id: "extraordinary", label: "14. Extraordinary Circumstances" },
  { id: "accommodation", label: "15. Accommodation Ratings" },
  { id: "documentation", label: "16. Documentation & Information" },
  { id: "safety", label: "17. Safety & Security" },
  { id: "behaviour", label: "18. Your Behaviour" },
  { id: "data-protection", label: "19. Data Protection" },
  { id: "service-charges", label: "20. Service Charges" },
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
            These booking conditions govern your relationship with Luxeonair LTD. Please read them carefully before making any booking.
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
                    className={`block rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary hover:text-foreground ${
                      item.id === "section-a" ? "mt-2 font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="prose-terms space-y-10 text-sm leading-relaxed">

            {/* Preamble */}
            <Section id="preamble" title="Introduction">
              <p>
                These Terms &amp; Conditions (otherwise known as booking conditions), together with our Privacy Policy, Cookie Policy and any other written information we have brought to your attention before we confirmed your booking, will apply to your booking with <strong>LUXEONAIR LTD</strong>, trading as Luxeonair, registered in England &amp; Wales under company number <strong>17264512</strong>, with our registered office at <strong>{SITE.address}</strong>.
              </p>
              <p className="mt-3">
                On this page, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;operator&rdquo;, and &ldquo;our&rdquo; refers to Luxeonair, and &ldquo;you&rdquo;, &ldquo;participant&rdquo;, &ldquo;passenger&rdquo;, &ldquo;guest&rdquo;, &ldquo;client&rdquo; and &ldquo;your&rdquo; refers to you, the user of our website and services. References to &ldquo;you&rdquo; and &ldquo;your&rdquo; mean all persons named on the booking (including anyone who is added or substituted at a later date).
              </p>
              <p className="mt-3">
                Please read these Booking Conditions carefully prior to making any bookings or contacting Luxeonair. By making a booking, you agree on behalf of all persons detailed on the booking that each person:
              </p>
              <ul className="mt-3 space-y-2 pl-0">
                <BulletItem>Has read these Booking Conditions and agrees to be bound by them.</BulletItem>
                <BulletItem>Consents to our use of personal data in accordance with our Privacy Policy and is authorised on behalf of all persons named on the booking to disclose their personal details to us, including special categories of data (such as health or medical information and disabilities).</BulletItem>
                <BulletItem>Is over 18 years of age.</BulletItem>
                <BulletItem>Accepts financial responsibility for payment of the booking on behalf of all persons detailed on the booking.</BulletItem>
              </ul>

              <InfoBox className="mt-5">
                <p className="font-semibold">Single component bookings</p>
                <p className="mt-1">Where we sell a single travel service (such as a flight, hotel or car hire only), we act as agent in respect of all such bookings and Section A applies. We do not provide financial protection for single component bookings except for some flights protected by our Air Travel Organiser&apos;s Licence (&ldquo;ATOL&rdquo;). Where we sell and issue tickets as an authorised airline ticket agent, no ATOL protection applies. You will be issued an ATOL Certificate where applicable — see Clause 8.</p>
              </InfoBox>

              <InfoBox className="mt-4">
                <p className="font-semibold">Packages that we organise</p>
                <p className="mt-1">Where we combine and sell two or more different types of travel service for the same trip (e.g. flight and hotel), we accept responsibility for the performance of those contracts as a package organiser in accordance with the Package Travel and Linked Travel Arrangements Regulations 2018 (&ldquo;Package Travel Regulations&rdquo;). Section B sets out the additional terms that apply. Financial protection details are in Section B, Clause 5.</p>
              </InfoBox>

              <InfoBox className="mt-4">
                <p className="font-semibold">Packages organised by a third party</p>
                <p className="mt-1">Occasionally we sell a package organised by a tour operator/principal, acting as their agent. In that event, the tour operator/principal is responsible to you for the package and financial protection. Where a flight is included, the package will be protected by their ATOL — the ATOL holder&apos;s name and number will be in your booking confirmation.</p>
              </InfoBox>

              <p className="mt-5 text-muted-foreground">
                All customer service communications should be sent to: <strong>Luxeonair, {SITE.address}</strong> or by email to{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
              </p>
            </Section>

            {/* Section A header */}
            <div id="section-a" className="rounded-2xl bg-navy px-6 py-5 text-navy-fg">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Section A</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">Applicable to All Bookings</h2>
            </div>

            <Section id="contract" number="1" title="Contract">
              <p>When making your booking, we will arrange for you to enter into a contract with each of the relevant third-party suppliers of your travel arrangements (such as tour operators, airlines, cruise operators, accommodation providers, car hire providers and transfer providers), as specified on your booking confirmation. Your contract comes into existence once we issue the booking confirmation.</p>
              <p className="mt-3">Your booking is subject to these Booking Conditions and to those of each third-party supplier. In the event of any conflict between a supplier&apos;s terms and these Booking Conditions, the supplier&apos;s term will take precedence unless it is deemed invalid or unenforceable under English law, in which case the relevant term in these Booking Conditions will prevail. Some suppliers&apos; conditions may limit or exclude their liability to you. Copies of the relevant supplier&apos;s terms and any applicable international conventions are available on request.</p>
              <p className="mt-3">As an agent, we accept no responsibility for the acts or omissions of suppliers or for the travel services they provide, unless we are the organiser of your package holiday under the Package Travel Regulations — in which case Section B applies.</p>
            </Section>

            <Section id="package-bookings" number="2" title="Package Bookings">
              <p>Where we combine and sell two or more of the travel services below for the same trip, this will comprise a &ldquo;Package&rdquo; and we will take responsibility as an &ldquo;organiser&rdquo; under the Package Travel Regulations, provided those services are:</p>
              <ul className="mt-3 space-y-1.5 pl-0">
                <BulletItem>Purchased together from a single visit to our website and selected before you agree to pay; or</BulletItem>
                <BulletItem>Advertised, sold or charged at an inclusive or total price; or</BulletItem>
                <BulletItem>Advertised or sold under the term &ldquo;package&rdquo; or a similar term.</BulletItem>
              </ul>
              <p className="mt-4">The travel services that can constitute a Package are: <strong>(a)</strong> transport (e.g. flight); <strong>(b)</strong> accommodation; <strong>(c)</strong> rental of cars or other motor vehicles; <strong>(d)</strong> any other tourist service not intrinsically part of (a)–(c).</p>
              <p className="mt-3 text-muted-foreground text-xs">Note: &ldquo;Other tourist services&rdquo; only create a Package where they account for 25% or more of the combined value or are an essential feature. Tourist services selected after the main service has started do not create a Package.</p>
              <p className="mt-3">Where we are the organiser under the Package Travel Regulations, we still act as agent in relation to the individual travel services, and you will have contracts with each supplier. Your booking confirmation will specify whether a Package has been purchased and identify the responsible party. See Section B for our liabilities as organiser.</p>
            </Section>

            <Section id="booking" number="3" title="Booking">
              <p>Bookings may be made online at <strong>www.luxeonair.co.uk</strong>, by telephone, or in person at our agency premises. All bookings are subject to availability at the time of booking.</p>
              <p className="mt-3">Where you book online, the order summary email is <strong>not</strong> contractual acceptance; it is an acknowledgement that we have received your offer. We will issue a booking confirmation once the travel services are confirmed as available — this is when your contract comes into existence.</p>
              <p className="mt-3">It is your responsibility to ensure that all names in the booking confirmation are accurate as per the passports of all travellers, and that the travel itinerary accords with your requirements. Changes are rarely possible once flight tickets and travel documents are issued and may incur additional charges. If you wish to make changes, please contact us on the same day of reservation before 11:30pm to benefit from minimum amendment penalties.</p>
              <p className="mt-3">On receipt of all travel documents, please check that names, dates and timings are accurate and advise us immediately of any errors. Please note that all flight tickets and products are non-refundable, non-changeable and non-transferable unless otherwise stated.</p>
              <p className="mt-3">There may be instances where a confirmed product becomes unavailable due to a technical issue or a supplier reducing availability. We will inform you as soon as we are made aware and reserve the right to withdraw our contract. In the event of concert, sporting or other event cancellations, you will be offered an available alternative of similar value, or a full refund of all monies paid.</p>
            </Section>

            <Section id="flight-bookings" number="4" title="Flight Bookings">
              <SubHeading>Financial protection</SubHeading>
              <p>When you buy an ATOL-protected flight from us, you will receive an ATOL Certificate listing what is financially protected. You will be advised at the time of booking whether your flight is ATOL protected. Not all flights are ATOL protected — some flight-only sales are sold by us as agents for the airline.</p>

              <SubHeading>Availability</SubHeading>
              <p>Seat availability and pricing are at the airline&apos;s discretion. Flight times shown are provisional and may be subject to change. Most airlines stipulate that bookings are non-refundable. Where possible, we will send seat requests to the airline, though seat allocation is entirely at the airline&apos;s discretion — early check-in will help. Exit row and extra-legroom seats are generally assigned at check-in only. Meal requests are not guaranteed but will be forwarded.</p>

              <SubHeading>Fares</SubHeading>
              <p>Airfares can increase quickly after initial quotation. Please make payment within 1 hour of booking confirmation to guarantee the offered fare. If your fare has changed by the time of payment, you have the right to cancel and receive a full refund. Should the originally offered flight no longer be available, we will provide a closely matching alternative.</p>

              <SubHeading>Indirect flights</SubHeading>
              <p>Some flights may be indirect and fly via other airports. Full details of any stopovers will be made clear at the time of booking.</p>

              <SubHeading>Baggage allowance</SubHeading>
              <p>Our prices include the standard baggage allowance allowed by the airline. Some airlines treat hold luggage as an optional extra — where this applies, it will not be included in headline prices and can be added at booking. Please refer to your booking confirmation for hand luggage allowances. Many countries, including the UK, have restrictions on imported food, plant and animal products.</p>
              <p className="mt-2 rounded-lg bg-secondary/50 px-4 py-3 text-xs text-muted-foreground"><strong>Hand luggage liquids:</strong> Containers must hold no more than 100ml and be placed in a single transparent re-sealable plastic bag (max 1 litre, approx 20cm × 20cm). See <a href="https://www.gov.uk/hand-luggage-restrictions/overview" target="_blank" rel="noopener noreferrer" className="underline">gov.uk/hand-luggage-restrictions</a> for full details.</p>

              <SubHeading>Check-in</SubHeading>
              <p>Check-in procedures are included in your booking confirmation. Some airlines require online check-in — failure to do so will result in check-in fees at the airport payable by you. We recommend arriving 3 hours before departure for intercontinental flights and 2 hours for European/domestic flights. Check-in counters close 60 minutes before departure. Gates close 15 minutes before departure. Tickets cannot be refunded or changed because of a no-show or late check-in.</p>

              <SubHeading>Amendment and cancellation</SubHeading>
              <p>Most flight bookings are non-refundable by the airline. Any amendment or cancellation will incur charges. If any part of your flight is missed or marked as a no-show, the airline may automatically cancel remaining segments. Please inform us in advance if you are unable to travel. Contact us for any amendment or cancellation — see Clause 6.</p>
            </Section>

            <Section id="price-payment" number="5" title="Price &amp; Payment">
              <p>The price of your holiday includes all taxes and additional fees known at the time of booking. Where additional taxes or charges cannot be calculated in advance, you will be given an indication of likely additional costs.</p>
              <p className="mt-3">To book, you will be required to pay a deposit or the full balance, depending on when you book relative to the departure date. Where only a deposit is paid, the balance must be paid on or before the due date in your booking confirmation. Failure to pay the balance may result in cancellation by the supplier and cancellation fees.</p>

              <InfoBox className="mt-4">
                <p className="text-xs">Except where otherwise stated, all monies you pay for travel arrangements are held on behalf of the relevant supplier, except for bookings protected by ATOL. Money paid for ATOL-protected bookings is held on behalf of and for the benefit of the Trustees of the Air Travel Trust.</p>
              </InfoBox>

              <SubHeading>Changes to the price</SubHeading>
              <p>We may change your holiday price after booking only in the following circumstances: changes in the price of passenger carriage due to fuel costs, taxes/fees imposed by third parties, or exchange rate movements. There will be no price change within 20 days of departure.</p>
              <ul className="mt-3 space-y-1.5 pl-0">
                <BulletItem>We will absorb increases up to 2% of the travel price (excluding amendment charges). You will be charged for any amount over 2%.</BulletItem>
                <BulletItem>If the increase exceeds 8%, you may accept an alternative holiday (with a price difference refund if lower value) or cancel and receive a full refund of all monies paid, except amendment charges.</BulletItem>
                <BulletItem>If the price decreases due to the above factors, we will refund you after deducting our administrative expenses.</BulletItem>
              </ul>
            </Section>

            <Section id="cancellation" number="6" title="Cancellation &amp; Amendment">
              <SubHeading>Cancellations</SubHeading>
              <p>You may cancel your booking at any time. Cancellation requests must be sent in writing to: Customer Services, Luxeonair, {SITE.address}, United Kingdom, or by email to{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>, by the lead name on the booking. Cancellation will not take effect until received by us.
              </p>
              <p className="mt-3">The supplier may charge cancellation fees as specified in their terms — potentially up to 100% of the travel service price, depending on when cancellation occurs. Bookings are generally non-refundable after the date of booking unless otherwise stated. We also charge an administration fee per passenger — see Clause 20.</p>

              <SubHeading>Amendments</SubHeading>
              <p>Amendment requests must be notified in writing by post or by email to{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>. We cannot guarantee that amendments can be made after booking — this depends on the supplier&apos;s terms. An amendment fee per passenger applies (see Clause 20), together with any airline/supplier amendment charges. If you have travel insurance, you may be able to claim amendment charges under your policy.
              </p>
            </Section>

            <Section id="travel-insurance" number="7" title="Travel Insurance">
              <p>Travel insurance is strongly recommended and you should take it out as soon as you book. Check that it covers all destinations, the full duration of your trip, any planned activities (such as adventure sports) and any pre-existing medical conditions. A good policy will cover cancellation charges, delays, lost baggage, and medical expenses abroad. Read the policy details carefully to ensure adequate cover.</p>
            </Section>

            <Section id="financial-protection" number="8" title="Financial Protection">
              <SubHeading>Flight only</SubHeading>
              <p>We provide financial protection for some (but not all) of our flight-only services via our Air Travel Organiser&apos;s Licence (ATOL), issued by the Civil Aviation Authority, Gatwick Airport South, West Sussex, RH6 0YR — telephone: 0333 103 6350, email:{" "}
                <a href="mailto:claims@caa.co.uk" className="text-primary hover:underline">claims@caa.co.uk</a>.
              </p>
              <p className="mt-3">When you buy an ATOL-protected flight, you will receive an ATOL Certificate. Flights sold as authorised ticket agents for the airline are not ATOL protected. We will tell you at the time of booking whether your flight is ATOL protected. If you do not receive an ATOL Certificate, your flight will not be ATOL protected.</p>

              <SubHeading>Flight package</SubHeading>
              <p>Where we sell a flight package as agent for an organiser, you will be protected by the organiser&apos;s ATOL (their name and number will be in your booking confirmation). Where we sell a flight package as organiser, please refer to Section B, Clause 5. Where your flight is ATOL protected, the suppliers (or we) will provide the services you have bought or a suitable alternative. In the unlikely event of insolvency, an alternative ATOL holder may provide the services at no extra cost. You agree to pay any outstanding amounts to that alternative ATOL holder. If no alternative ATOL holder can be appointed, you may make a claim under the ATOL scheme (or via your credit card issuer).</p>

              <SubHeading>Non-flight package</SubHeading>
              <p>Where we act as agent for a package organised by a third party, we will advise you of the financial protection arranged by the organiser. We are only responsible for arranging financial protection where we are the organiser (see Section B, Clause 5).</p>
            </Section>

            <Section id="documents" number="9" title="Delivery of Documents">
              <p>All travel documents (tickets, etc.) will be sent by email within 48–72 hours following full payment, or by post on request. In the case of a very late booking, documents can be sent within 24 hours. Once documents are posted, no liability will be accepted by us unless the loss is caused by our negligence. If tickets need to be reissued, all costs are to be borne by you. Documents can only be reissued up to 7 days before departure. You may request courier delivery at your own cost.</p>
            </Section>

            <Section id="passports" number="10" title="Passports, Visas &amp; Health">
              <p>It is your responsibility to inform us of any medical conditions and reduced mobility before booking, so we can ensure the suitability of your trip. While we can provide general information on passport, visa and health requirements, it is your responsibility to check and confirm your specific circumstances with the relevant Embassies, Consulates and your doctor.</p>

              <SubHeading>Passports</SubHeading>
              <p>Most countries require passports to be valid for at least 6 months after your return date and in excellent condition. A machine-readable passport is mandatory for travel to the USA. We strongly advise checking with your respective embassy for precise requirements.</p>

              <SubHeading>Visas</SubHeading>
              <p>A transit visa may be required for connecting flights through certain countries. We will advise where possible, but please also check{" "}
                <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gov.uk/foreign-travel-advice</a>. An ESTA is required for all USA-bound travel. ETA is required for Australia and Canada. For European holidays, please obtain a completed EHIC prior to departure.
              </p>

              <SubHeading>Pregnancy</SubHeading>
              <p>Most airlines reserve the right to refuse embarkation to a woman in advanced pregnancy. Please inform us at the time of booking if you or anyone in your party is pregnant, so we can check the airline&apos;s policy. A medical certificate confirming fitness to travel may be required.</p>

              <SubHeading>Children</SubHeading>
              <p>Additional documentation is usually required for children travelling without parents or unaccompanied. Please notify us in advance. We are not responsible for any refusal to embark or delay due to failure to obtain requisite documentation.</p>

              <p className="mt-3 text-muted-foreground text-xs">We do not accept any responsibility if you cannot travel or incur any loss because you have not complied with passport, visa, immigration or health requirements. You agree to reimburse us for any fines or losses we incur as a result of your non-compliance.</p>
            </Section>

            <Section id="final-arrangements" number="11" title="Final Travel Arrangements">
              <p>Ensure that all travel, passport, visa and insurance documents are in order and that you arrive in plenty of time for check-in (see Clause 4). It may be necessary to reconfirm your flight prior to departure — please ask us for your airline contact details and reconfirm at least 72 hours before your outbound flight. Take note of any reference number or contact name when reconfirming. Failure to reconfirm may result in refusal of boarding and you are unlikely to receive a refund.</p>
            </Section>

            <Section id="complaints" number="12" title="Complaints">
              <p>As agent, we will assist you with any complaints. Contact our Customer Services at{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a> or by post to Customer Services, Luxeonair, {SITE.address}, United Kingdom. However, as your contract is with the supplier(s), any queries should be addressed to them first.
              </p>
              <p className="mt-3">If you have a problem during your holiday, report it to the principal/supplier or their local representative immediately. Failure to do so may reduce any compensation you are entitled to. On return, write to the principal/supplier and contact us for assistance. You may also access the European Commission Online Dispute Resolution platform at{" "}
                <a href="https://www.ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ec.europa.eu/consumers/odr</a>.
              </p>
            </Section>

            <Section id="responsibility" number="13" title="Responsibility for Your Booking">
              <p>Your contract is with the supplier/principal, and their booking conditions apply. As an agent, we accept no responsibility for the actual provision of travel arrangements. Our responsibilities are limited to making the booking in accordance with your instructions. We accept no responsibility for any information we pass on to you in good faith.</p>
              <p className="mt-3">In the event we are found liable on any basis, our maximum liability is limited to twice the commission we earn on your booking (or the appropriate proportion if not everyone on the booking is affected).</p>
              <p className="mt-3">We do not exclude or limit liability for death or personal injury arising from our negligence or that of our employees acting in the course of employment.</p>
              <p className="mt-2 text-xs text-muted-foreground">Where we are the organiser of a Package under the Package Travel Regulations, the additional terms in Section B apply.</p>
            </Section>

            <Section id="extraordinary" number="14" title="Unavoidable &amp; Extraordinary Circumstances">
              <p>We will not be liable or pay compensation if our contractual obligations are affected by unavoidable and extraordinary circumstances beyond our control, the consequences of which could not have been avoided even if all reasonable measures had been taken. These include (but are not limited to):</p>
              <ul className="mt-3 space-y-1.5 pl-0">
                <BulletItem>Warfare, acts of terrorism (and threat thereof), and civil strife</BulletItem>
                <BulletItem>Significant risks to human health, including serious disease outbreaks at the travel destination</BulletItem>
                <BulletItem>Natural disasters (floods, earthquakes) or weather conditions making travel unsafe</BulletItem>
                <BulletItem>Acts of any government or local authority, industrial dispute, strikes, lock closures</BulletItem>
                <BulletItem>Nuclear, chemical or biological disasters</BulletItem>
                <BulletItem>Unavoidable technical problems with transport, air traffic control strikes or flight cancellations</BulletItem>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Brexit note: Changes resulting from the UK&apos;s departure from the European Union (including unavailability of certain flight routes, port access or changes to visa requirements) may be treated as unavoidable and extraordinary circumstances. We will advise customers of any confirmed impact on their bookings as soon as possible. See <a href="https://www.gov.uk/transition" target="_blank" rel="noopener noreferrer" className="underline">gov.uk/transition</a>.</p>
            </Section>

            <Section id="accommodation" number="15" title="Accommodation Ratings &amp; Standards">
              <p>All ratings are as provided by the relevant supplier, or are our own average ratings based on industry knowledge and customer feedback. Our own ratings are clearly marked and are intended as a guide to the services and facilities you should expect. Standards and ratings may vary between countries and suppliers, and we cannot guarantee the accuracy of any rating given.</p>
            </Section>

            <Section id="documentation" number="16" title="Documentation &amp; Information">
              <p>All descriptions and content on our website or otherwise issued by us are produced on behalf of the relevant supplier and are intended to present a general idea of the services provided. Not all details can be included on our website. All services shown are subject to availability. Please contact us if you require further information.</p>
            </Section>

            <Section id="safety" number="17" title="Safety &amp; Security">
              <p>You are responsible for making yourself aware of Foreign &amp; Commonwealth Office advice regarding the safety of the countries and areas in which you will be travelling and for making your decisions accordingly. Up-to-date travel advice is available at{" "}
                <a href="https://www.gov.uk/travelaware" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gov.uk/travelaware</a>. FCO advice to avoid or leave a particular country may constitute an Unavoidable and Extraordinary Circumstance under Clause 14.
              </p>
            </Section>

            <Section id="behaviour" number="18" title="Your Behaviour">
              <p>You are expected to conduct yourself in an orderly and acceptable manner and not to disrupt the enjoyment of others. If, in the opinion of the supplier/principal or any person in authority, your behaviour or that of any member of your party is causing or is likely to cause distress, danger or annoyance to any other customer or third party, or damage to property, the supplier reserves the right to terminate your booking immediately with no further liability to you.</p>
              <p className="mt-3">You and your party will be jointly and individually liable for any damage or losses caused. Full payment for any such damage or losses must be paid directly to the supplier/principal prior to departure. If you fail to make payment, you will be responsible for meeting any claims (including legal costs) subsequently made against us, together with all costs we incur in pursuing any claim against you.</p>
            </Section>

            <Section id="data-protection" number="19" title="Data Protection">
              <p>As part of your booking, we will need to collect personal information including your name, email address, telephone number, passport number and other identifying information. We may also need to collect special category information such as health and medical information, details of disabilities, or religion.</p>
              <p className="mt-3">We will process your personal information for the purpose of making your booking and will pass it to the relevant suppliers and other persons involved in providing your travel services, as necessary. If required by law, information may be provided to public authorities such as customs or immigration. Certain information may be passed to security or credit checking companies. For travel to the United States, we are required to send information to US Customs and Border Protection for the purposes of preventing and combating terrorism and other serious transnational crimes.</p>
              <p className="mt-3">Where you travel outside the European Economic Area, we will pass your data to suppliers outside the EEA in compliance with the requirements of the General Data Protection Regulation (UK GDPR) as regards such transfers.</p>
              <p className="mt-3">
                Please see our{" "}
                <a href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</a>{" "}
                for full details of how we use personal data and your rights.
              </p>
            </Section>

            <Section id="service-charges" number="20" title="Service Charges">
              <p>The following administration charges apply for certain services:</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th className="px-5 py-3 text-left font-semibold">Service</th>
                      <th className="px-5 py-3 text-left font-semibold">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-5 py-3">Administration fees</td>
                      <td className="px-5 py-3 text-muted-foreground">£10 – £50 per booking</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Tailor-made itinerary planning</td>
                      <td className="px-5 py-3 text-muted-foreground">No charge</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Bookings</td>
                      <td className="px-5 py-3 text-muted-foreground">No charge</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">Ticket delivery by hand</td>
                      <td className="px-5 py-3 text-muted-foreground">Not available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">If you proceed with a financial reimbursement claim or payment dispute to retrieve the cost of your holiday or any additional compensation via third-party channels, a surcharge of 10% of the total payment may be applicable. These charges are subject to change and you will be notified of the applicable charge at the time of your request.</p>
            </Section>

            {/* Contact card */}
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">Questions?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                If you have any questions about these Terms &amp; Conditions, please contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary font-medium hover:underline">{SITE.email}</a>{" "}
                or call{" "}
                <a href={`tel:${SITE.phone.tel}`} className="text-primary font-medium hover:underline">{SITE.phone.display}</a>.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Luxeonair LTD · {SITE.address} · Company No. 17264512</p>
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
      <div className="text-sm text-foreground/80 leading-relaxed space-y-0">{children}</div>
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

function InfoBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}
