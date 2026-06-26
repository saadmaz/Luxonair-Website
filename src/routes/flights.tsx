import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AIRLINES, FLIGHT_ROUTES } from "@/data/flights";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Globe2,
  Plane,
  ShieldCheck,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Business & First Class Flights from the UK | Luxeonair" },
      { name: "description", content: "Independent fare comparison across BA, Virgin Atlantic, Emirates, Qatar Airways and more. Business class, first class and premium economy — one consultant, one invoice, no booking fee." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Business & First Class Flights from the UK | Luxeonair" },
      { property: "og:description", content: "Compare business and first class fares across BA, Virgin, Emirates & Qatar. One consultant, one invoice. No booking fee." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.com/flights" },
      { name: "twitter:title", content: "Business & First Class Flights | Luxeonair" },
      { name: "twitter:description", content: "Independent fare search across BA, Virgin Atlantic, Emirates & Qatar. One consultant, one invoice. No fee." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.com/flights" }],
  }),
  component: FlightsPage,
});

function FlightsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Premium flights
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-navy-fg sm:text-5xl md:text-6xl text-balance">
            Business class. First class. The right airline for your route.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-fg/70 leading-relaxed">
            We're independent - we compare fares across every major carrier so you get the best
            seat for your budget, not whoever pays us the highest commission. One consultant, one
            invoice, no booking fee.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/quote" search={{ tripType: "Flight only" }}>
                Get a flight quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-fg/25 bg-transparent text-navy-fg hover:bg-navy-fg/10"
            >
              <Link to="/contact">Talk to a consultant</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: Plane,       label: "Independent - not tied to one airline" },
              { icon: Star,        label: "4.9★ average rating" },
              { icon: ShieldCheck, label: "ATOL Protected" },
              { icon: Clock,       label: "Rapid response" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-navy-fg/60">
                <Icon className="h-3.5 w-3.5 text-gold/70" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why use a consultant for flights */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Why not just book direct?
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              The best fare isn't always on the airline's own site.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Consolidator fares, mixed-carrier itineraries, and flexible ticketing - these are
              available through agents, not publicly. We access them all and present you with a
              clear comparison, explained in plain English.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Net and consolidator fares below public pricing",
                "Mixed-carrier outbound/return combinations",
                "Flexible ticketing for corporate travellers",
                "Lounge access, seat pre-selection, baggage - all included at booking",
                "24/7 support while you're travelling",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Globe2,    title: "All major carriers", body: "BA, Virgin, Emirates, Qatar, Etihad, Singapore Airlines and more - one search." },
              { icon: Briefcase, title: "Corporate accounts", body: "Single monthly invoice, flexible rebooking, preferred rate agreements." },
              { icon: Plane,     title: "Any cabin class", body: "Economy to First. Premium economy often the sweet spot for long-haul." },
              { icon: ShieldCheck, title: "ATOL protected", body: "Every flight booking is financially protected. No risk if an airline fails." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airlines */}
      <section className="bg-secondary/30">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Airlines we book
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
            Independent access to every major carrier.
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            We're not tied to any airline. We pick the right one for your route, dates and budget.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AIRLINES.map(({ name, cabins, hub }) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{name}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {hub}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {cabins.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="container-page py-16 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Popular routes
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
          Indicative fares. Confirmed at quote stage.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Prices are per person, return, from UK departure airports. Actual fares depend on dates and
          availability - get a quote for a live price.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Route
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Cabin
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  From pp return
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FLIGHT_ROUTES.map(({ from, to, cabin, from_price }) => (
                <tr key={`${from}-${to}`} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-4 font-medium">
                    {from} → {to}
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                    {cabin}
                  </td>
                  <td className="px-5 py-4 text-right font-display text-lg font-semibold text-teal">
                    £{from_price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to="/quote"
                      search={{ destination: to, tripType: "Flight only" }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Quote <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          All prices are indicative and subject to availability. Fares confirmed at quote stage.
        </p>
      </section>

      {/* Process */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The process
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy-fg sm:text-4xl text-balance">
            A flight quote in four steps.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Tell us your route", body: "Origin, destination, travel dates, number of passengers and cabin preference." },
              { n: "2", title: "We search every carrier", body: "Published fares, net fares and consolidator rates - compared on your behalf." },
              { n: "3", title: "You pick", body: "We present 2–3 options with clear trade-offs. No pressure, no upsell." },
              { n: "4", title: "One invoice, full protection", body: "ATOL-protected booking. We handle any changes, delays or rebooking en route." },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-navy-fg/15 bg-navy-fg/5 p-6">
                <div className="font-display text-4xl font-semibold text-gold/40">{n}</div>
                <h3 className="mt-4 text-sm font-semibold text-navy-fg">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-navy-fg/60">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote" search={{ tripType: "Flight only" }}>
                Get a flight quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-page py-16 md:py-24">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Not sure which airline or cabin is right for your route?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Tell us your route, dates and budget and a consultant will reply with a genuine
            comparison - no jargon, no hidden fees, within 4 working hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote" search={{ tripType: "Flight only" }}>
                Start a quote
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Call or WhatsApp</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
