import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/site/DestinationCard";
import { deals } from "@/lib/deals";
import { holidayTypes } from "@/lib/holidayTypes";
import { HeroSearchTabs } from "@/components/site/HeroSearchTabs";
import { Newsletter } from "@/components/site/Newsletter";
import {
  ArrowRight,
  Briefcase,
  Clock,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxonair — UK travel specialists for long-haul, family & corporate trips" },
      {
        name: "description",
        content:
          "Tailor-made long-haul, family escapes and corporate trips from the UK. Start a structured quote in minutes — a consultant replies within 4 working hours.",
      },
      { property: "og:title", content: "Luxonair — UK travel specialists" },
      {
        property: "og:description",
        content: "Tailor-made long-haul, family escapes and corporate trips from the UK.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <TrustPillars />
      <FeaturedDestinations />
      <HolidayTypeTiles />
      <DealsSection />
      <WhyLuxonair />
      <SocialProof />
      <Newsletter variant="section" />
      <FinalCTA />
    </>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative">
      {/* Backgrounds — clipped separately so the section doesn't clip the search widget */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=70)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-navy/97 via-navy/88 to-navy/55" />
        {/* Teal accent edge */}
        <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-transparent via-teal to-transparent" />
      </div>

      <div className="container-page relative pb-10 pt-20 md:pb-14 md:pt-32">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gold/70" />
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold/80">
              UK Travel Specialists
            </p>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] text-primary-foreground sm:text-6xl md:text-7xl text-balance">
            Tailor-made trips,{" "}
            <span className="text-gold">quoted in minutes,</span>{" "}
            built by people.
          </h1>

          {/* Subtitle */}
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-primary-foreground/65">
            Premium long-haul, family escapes, and corporate travel from the UK.
            One consultant owns your trip, end-to-end.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gold px-8 text-sm text-gold-foreground shadow-lg hover:bg-gold/90"
            >
              <Link to="/quote">
                Start a quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/destinations"
              className="flex items-center gap-1.5 text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
            >
              Explore destinations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <HeroSearchTabs />
    </section>
  );
}

/* ─── Stats strip ───────────────────────────────────────────────────── */

function StatsStrip() {
  const stats = [
    { value: "500+", label: "Premium trips delivered" },
    { value: "4.9★", label: "Average client rating" },
    { value: "£0", label: "Booking fees, ever" },
    { value: "4 hrs", label: "Quote response time" },
  ];
  return (
    <div className="bg-navy text-navy-fg">
      <div className="container-page grid grid-cols-2 gap-6 pt-12 pb-8 md:pt-16 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-gold">{s.value}</div>
            <div className="mt-1 text-xs text-navy-fg/60">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trust pillars ─────────────────────────────────────────────────── */

function TrustPillars() {
  const items = [
    {
      icon: ShieldCheck,
      label: "ATOL-protected",
      note: "Every booking financially protected",
    },
    { icon: Plane, label: "Premium-cabin partners", note: "BA, Virgin, Emirates, Qatar" },
    { icon: Clock, label: "4-hour response", note: "Mon–Fri 09:00–19:00 GMT" },
    { icon: Users, label: "Single consultant", note: "Quote to return, one person" },
  ];
  return (
    <section className="border-b border-border">
      <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs text-muted-foreground">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Featured destinations ─────────────────────────────────────────── */

function FeaturedDestinations() {
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeader
        eyebrow="Popular destinations"
        title="Itineraries our consultants build most often"
        cta={{ label: "All destinations", to: "/destinations" }}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.slice(0, 4).map((d) => (
          <DestinationCard key={d.slug} d={d} />
        ))}
      </div>
    </section>
  );
}

/* ─── Holiday type tiles ─────────────────────────────────────────────── */

function HolidayTypeTiles() {
  return (
    <section className="bg-secondary/30">
      <div className="container-page py-16 md:py-20">
        <SectionHeader
          eyebrow="Holiday types"
          title="Find the trip shape that fits you."
          cta={{ label: "All types", to: "/holiday-types" }}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holidayTypes.map((h) => (
            <Link
              key={h.slug}
              to="/holiday-types/$slug"
              params={{ slug: h.slug }}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div className="aspect-5/3 w-full overflow-hidden">
                <img
                  src={h.heroImage}
                  alt={h.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{h.name}</div>
                <div className="mt-0.5 text-xs text-primary-foreground/75">{h.tagline}</div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Deals section ─────────────────────────────────────────────────── */

function DealsSection() {
  const top = deals.slice(0, 3);
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeader
        eyebrow="Limited deals"
        title="Held by a consultant, not an algorithm."
        cta={{ label: "All deals", to: "/deals" }}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((d) => (
          <article
            key={d.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden">
              <img
                src={d.image}
                alt={d.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {d.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground shadow">
                  {d.badge}
                </span>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {d.region} · {d.nights} nights
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{d.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">From, per person</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-semibold text-teal">
                      £{d.fromPrice.toLocaleString()}
                    </span>
                    {d.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        £{d.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/quote" search={{ destination: d.title }}>
                    Quote
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Why Luxonair ──────────────────────────────────────────────────── */

function WhyLuxonair() {
  return (
    <section className="bg-navy text-navy-fg">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Why Luxonair
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-navy-fg sm:text-4xl text-balance">
              Single-invoice simplicity. Human expertise. Total protection.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-fg/60">
              We're not a call-centre and we're not an aggregator. One consultant builds your
              brief, books every component, and stays reachable throughout — from quote to
              return gate.
            </p>
            <Button
              asChild
              className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/about">Learn about us</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Briefcase,
                title: "Corporate & Business",
                body: "Premium-cabin returns, DIFC hotels, single monthly invoice.",
              },
              {
                icon: Users,
                title: "Families & Couples",
                body: "Direct flights, family suites, kids clubs and honeymoon retreats.",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                body: "A named consultant reachable throughout your trip.",
              },
              {
                icon: ShieldCheck,
                title: "Fully Protected",
                body: "ATOL, ABTA and IATA memberships — all legitimately held.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-navy-fg/10 bg-navy-fg/5 p-5"
              >
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 text-sm font-semibold text-navy-fg">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-fg/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Social proof ──────────────────────────────────────────────────── */

function SocialProof() {
  const reviews = [
    {
      quote:
        "Quoted on Monday morning, on a plane Friday afternoon. The consultant rebooked us in-flight when our connection slipped.",
      author: "[PLACEHOLDER]",
      trip: "Family of 4, Antigua",
      rating: 5,
    },
    {
      quote:
        "Our finance team gets one invoice a month. Travellers get a human at 3am. That's the bit other agencies miss.",
      author: "[PLACEHOLDER]",
      trip: "Head of Ops, UK SaaS",
      rating: 5,
    },
    {
      quote:
        "Honeymoon in the Maldives, then Tokyo for two weeks. They held the whole thing together, calmly.",
      author: "[PLACEHOLDER]",
      trip: "Honeymooners",
      rating: 5,
    },
  ];
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeader
        eyebrow="Why travellers stay"
        title="Real reviews. Unedited words."
        cta={{ label: "All reviews", to: "/reviews" }}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              "{r.quote}"
            </blockquote>
            <figcaption className="mt-5 border-t border-border pt-4 text-xs">
              <span className="font-medium text-foreground">{r.author}</span>
              <span className="ml-1 text-muted-foreground">· {r.trip}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground shadow-2xl md:px-14">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
        <div className="pointer-events-none absolute -bottom-12 right-32 h-40 w-40 rounded-full bg-gold/10" />
        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Tell us where, when, and roughly how much. We'll do the rest.
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/70">
              Four short steps. No phone-tag, no auto-mailers. A consultant replies within 4
              working hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <a href="https://wa.me/440000000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Shared helpers ────────────────────────────────────────────────── */

function SectionHeader({
  eyebrow,
  title,
  cta,
}: {
  eyebrow: string;
  title: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium hover:text-primary sm:inline-flex"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
