import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { holidayTypes } from "@/lib/holidayTypes";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/site/DestinationCard";
import {
  ArrowRight,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/holidays")({
  head: () => ({
    meta: [
      { title: "Tailor-Made Holidays from the UK — Luxonair" },
      {
        name: "description",
        content:
          "Beach, honeymoon, family, luxury and city break holidays from the UK. One consultant builds and manages your entire trip — quote within 4 working hours.",
      },
      { property: "og:title", content: "Tailor-Made Holidays — Luxonair" },
      {
        property: "og:description",
        content:
          "Premium tailor-made holidays from the UK. Beach, family, honeymoon, luxury and more. A real consultant — not a call centre.",
      },
      { property: "og:url", content: "/holidays" },
    ],
    links: [{ rel: "canonical", href: "/holidays" }],
  }),
  component: HolidaysPage,
});

function HolidaysPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Holidays from the UK
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-navy-fg sm:text-5xl md:text-6xl text-balance">
            Your holiday, built around you. Not a template.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-fg/70 leading-relaxed">
            Every Luxonair holiday is tailor-made: you tell us the destination, travel window, and
            budget, and one consultant builds the flights, transfers, hotels and extras into a
            single confirmed itinerary — at no booking fee.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">
                Start a holiday quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-fg/25 bg-transparent text-navy-fg hover:bg-navy-fg/10"
            >
              <Link to="/destinations">Browse destinations</Link>
            </Button>
          </div>

          {/* Trust micro-strip */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheck, label: "ATOL Protected" },
              { icon: Star,        label: "4.9★ average rating" },
              { icon: Clock,       label: "4-hr response Mon–Fri" },
              { icon: Users,       label: "500+ trips delivered" },
              { icon: Phone,       label: "No call centre — a named consultant" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-navy-fg/60">
                <Icon className="h-3.5 w-3.5 text-gold/70" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Holiday types */}
      <section className="container-page py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              What kind of holiday?
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Every shape of trip, handled by one person.
            </h2>
          </div>
          <Link
            to="/holiday-types"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium hover:text-primary sm:inline-flex"
          >
            View all types <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {holidayTypes.map((h) => (
            <Link
              key={h.slug}
              to="/holiday-types/$slug"
              params={{ slug: h.slug }}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div className="aspect-4/3 w-full overflow-hidden">
                <img
                  src={h.heroImage}
                  alt={h.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{h.name}</div>
                <div className="mt-0.5 text-sm text-primary-foreground/75">{h.tagline}</div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/30">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
            Four steps. One consultant. No surprises.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Tell us where",
                body: "Destination, rough dates, travel party size, and cabin class. Takes under 3 minutes.",
              },
              {
                step: "02",
                title: "Consultant replies",
                body: "Within 4 working hours. A real person — no automated quotes, no call queue.",
              },
              {
                step: "03",
                title: "Itinerary built",
                body: "Flights, transfers, accommodation and extras in a single confirmed quote.",
              },
              {
                step: "04",
                title: "One invoice",
                body: "Book and pay once. We manage any changes, delays or reroutes throughout.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="font-display text-4xl font-semibold text-gold/40">{step}</div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">
                Start your quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Popular right now
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Itineraries our consultants build most often.
            </h2>
          </div>
          <Link
            to="/destinations"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium hover:text-primary sm:inline-flex"
          >
            All destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.slice(0, 6).map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-page pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground shadow-2xl md:px-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
          <div className="pointer-events-none absolute -bottom-10 right-36 h-40 w-40 rounded-full bg-gold/10" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Ready to plan your holiday?
            </h2>
            <p className="mt-3 text-primary-foreground/70">
              Tell us where you'd like to go, roughly when, and how many are travelling. A
              consultant replies within 4 working hours — no spam, no auto-mailers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/quote">Start a holiday quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/contact">Speak to someone first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
