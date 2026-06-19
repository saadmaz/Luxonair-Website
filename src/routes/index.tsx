import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { destinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/site/DestinationCard";
import { deals } from "@/lib/deals";
import { holidayTypes } from "@/lib/holidayTypes";
import { HeroSearchTabs } from "@/components/site/HeroSearchTabs";
import { AwardsStrip } from "@/components/site/AwardsStrip";
import { Newsletter } from "@/components/site/Newsletter";
import { ArrowRight, Briefcase, Clock, MessageCircle, Plane, ShieldCheck, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxonair — UK travel specialists for long-haul, family & corporate trips" },
      { name: "description", content: "Tailor-made long-haul, family escapes and corporate trips from the UK. Start a structured quote in minutes — a consultant replies within 4 working hours." },
      { property: "og:title", content: "Luxonair — UK travel specialists" },
      { property: "og:description", content: "Tailor-made long-haul, family escapes and corporate trips from the UK." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = destinations.slice(0, 4);
  return (
    <>
      <Hero />
      <AwardsStrip />
      <TrustStrip />
      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Itineraries our consultants build most often
            </h2>
          </div>
          <Link to="/destinations" className="hidden text-sm font-medium text-foreground hover:text-primary sm:inline-flex">
            All destinations <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 4).map((d) => <DestinationCard key={d.slug} d={d} />)}
        </div>
      </section>

      <HolidayTypeTiles />
      <DealsTeaser />
      <ParallelPaths />
      <SocialProof />
      <Newsletter variant="section" />
      <FinalCTA />
    </>
  );
}

function HolidayTypeTiles() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Holiday types</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">Pick a trip shape.</h2>
          </div>
          <Link to="/holiday-types" className="hidden text-sm font-medium hover:text-primary sm:inline-flex">All types <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holidayTypes.map((h) => (
            <Link key={h.slug} to="/holiday-types/$slug" params={{ slug: h.slug }} className="group relative overflow-hidden rounded-2xl border border-border">
              <div className="aspect-[5/3] w-full overflow-hidden">
                <img src={h.heroImage} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{h.name}</div>
                <div className="text-xs text-primary-foreground/80">{h.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DealsTeaser() {
  const top = deals.slice(0, 3);
  return (
    <section className="container-page py-16 md:py-20">
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Limited deals</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">Held by a consultant, not an algorithm.</h2>
        </div>
        <Link to="/deals" className="hidden text-sm font-medium hover:text-primary sm:inline-flex">All deals <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((d) => (
          <article key={d.id} className="group overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {d.badge && <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-medium text-gold-foreground">{d.badge}</span>}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{d.region} · {d.nights} nights</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{d.title}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold">£{d.fromPrice.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">from, pp</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=70)" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/90" />
      <div className="container-page relative py-24 text-primary-foreground md:py-36">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur">
            <Sparkles className="h-3 w-3 text-gold" /> UK travel specialists since [PLACEHOLDER]
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl text-balance">
            Tailor-made trips, <span className="text-gold">quoted in minutes,</span> built by people.
          </h1>
          <p className="mt-6 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Premium long-haul, family escapes, and corporate travel — structured quote first, then a single consultant who owns your trip end-to-end.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Start a quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/destinations">Explore destinations</Link>
            </Button>
          </div>
        </div>
      </div>
      <HeroSearchTabs />
    </section>
  );
}


function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "ATOL-protected", note: "[PLACEHOLDER]" },
    { icon: Plane, label: "Premium-cabin partners", note: "BA, Virgin, Emirates, Qatar" },
    { icon: Clock, label: "4-hour response", note: "Mon–Fri 09:00–19:00" },
    { icon: Users, label: "Single consultant", note: "From quote to return" },
  ];
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{label}</div>
              <div className="truncate text-xs text-muted-foreground">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ParallelPaths() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <Path
          icon={Briefcase}
          eyebrow="Corporate & business"
          title="Single-invoice trips for UK businesses"
          body="Premium-cabin returns, DIFC- and Midtown-adjacent hotels, account-managed by one consultant. We integrate with your travel policy and reconcile to a single monthly invoice."
          cta="Book a corporate intro call"
          to="/quote"
        />
        <Path
          icon={Users}
          eyebrow="Families & couples"
          title="School-holiday escapes & honeymoons"
          body="Direct flights from Gatwick, Heathrow and Manchester. Family suites, kids clubs, and adult-only caldera retreats — all ATOL-protected and indicatively priced before you commit."
          cta="Plan a family trip"
          to="/quote"
        />
      </div>
    </section>
  );
}

function Path({ icon: Icon, eyebrow, title, body, cta, to }: { icon: typeof Briefcase; eyebrow: string; title: string; body: string; cta: string; to: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <Link to={to} className="mt-5 inline-flex items-center text-sm font-medium text-foreground hover:text-primary">
        {cta} <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}

function SocialProof() {
  const reviews = [
    { quote: "Quoted on Monday morning, on a plane Friday afternoon. The consultant rebooked us in-flight when our connection slipped.", author: "[PLACEHOLDER] — Family of 4, Antigua" },
    { quote: "Our finance team gets one invoice a month. Travellers get a human at 3am. That's the bit other agencies miss.", author: "[PLACEHOLDER] — Head of Ops, UK SaaS" },
    { quote: "Honeymoon in the Maldives, then Tokyo for two weeks. They held the whole thing together, calmly.", author: "[PLACEHOLDER] — Honeymooners" },
  ];
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why travellers stay</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl text-balance">
          Reviews are real, ratings are not yet aggregated.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          We will publish a verified Trustpilot/Feefo score here once the client supplies access. Until then, here are unedited extracts.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-gold">★★★★★</div>
              <blockquote className="mt-3 text-sm leading-relaxed">"{r.quote}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground md:px-14">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Tell us where, when, and roughly how much. We'll do the rest.
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Four short steps. No phone-tag, no auto-mailers. A consultant replies within 4 working hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <a href="https://wa.me/440000000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
