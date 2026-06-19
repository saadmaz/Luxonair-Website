import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findDestination, destinations } from "@/lib/destinations";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "@/components/site/QuoteForm";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import type { Destination } from "@/lib/destinations";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }): Destination => {
    const d = findDestination(params.slug);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Luxonair` },
          { name: "description", content: `${loaderData.tagline} ${loaderData.durationNights} nights from £${loaderData.fromPrice} pp (indicative).` },
          { property: "og:title", content: `${loaderData.name} — Luxonair` },
          { property: "og:description", content: loaderData.tagline },
          { property: "og:image", content: loaderData.heroImage },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/destinations/${params.slug}` },
          { name: "twitter:image", content: loaderData.heroImage },
        ]
      : [],
    links: [{ rel: "canonical", href: `/destinations/${params.slug}` }],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: loaderData.name,
            description: loaderData.tagline,
            image: loaderData.heroImage,
            offers: { "@type": "Offer", priceCurrency: "GBP", price: loaderData.fromPrice, availability: "https://schema.org/InStock" },
          }),
        }]
      : [],
  }),
  component: DestinationDetail,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Destination not found</h1>
      <Link to="/destinations" className="mt-4 inline-block text-primary underline">Back to destinations</Link>
    </div>
  ),
});

function DestinationDetail() {
  const d = Route.useLoaderData() as Destination;
  const others = destinations.filter((x) => x.slug !== d.slug).slice(0, 3);

  return (
    <article>
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <img src={d.heroImage} alt={d.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-primary-foreground">
          <Link to="/destinations" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="mr-1 h-3 w-3" /> All destinations
          </Link>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-6xl text-balance">{d.name}</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">{d.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {[d.region, ...d.tripType, d.budgetBand].map((t) => (
              <span key={t} className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <div className="grid grid-cols-3 gap-3">
            {d.gallery.map((g, i) => (
              <img key={i} src={g} alt={`${d.name} gallery ${i + 1}`} loading="lazy" className="aspect-[4/3] rounded-lg object-cover" />
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold">Overview</h2>
          <p className="mt-3 text-muted-foreground">{d.summary}</p>

          <h2 className="mt-10 font-display text-2xl font-semibold">Outline itinerary</h2>
          <ol className="mt-4 space-y-4">
            {d.itinerary.map((s, i) => (
              <li key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-wider text-gold">{s.day}</div>
                <div className="mt-1 font-display text-lg font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-display text-2xl font-semibold">What's included</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {h}
              </li>
            ))}
          </ul>

          <p className="mt-10 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            All prices are <strong>indicative, per person</strong>, based on lead-in seasons. Live availability and final pricing
            confirmed by your consultant within 4 working hours of your enquiry. Not bookable online.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="font-display text-3xl font-semibold">£{d.fromPrice.toLocaleString()}</span>
            </div>
            <div className="text-right text-xs text-muted-foreground">per person · {d.durationNights} nights</div>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link to="/quote" search={{ destination: d.name } as never}>Get a quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="mt-2 w-full">
              <a href="https://wa.me/440000000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp a consultant
              </a>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Reply within 4 working hours · Mon–Fri 09:00–19:00 GMT</p>
          </div>
        </aside>
      </div>

      <section className="container-page pb-20">
        <h2 className="font-display text-2xl font-semibold">More like this</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} to="/destinations/$slug" params={{ slug: o.slug }} className="group">
              <img src={o.heroImage} alt={o.name} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
              <div className="mt-3 font-medium">{o.name}</div>
              <div className="text-sm text-muted-foreground">From £{o.fromPrice.toLocaleString()} pp</div>
            </Link>
          ))}
        </div>
      </section>

      <QuoteSection defaultDestination={d.name} />
    </article>
  );
}

function QuoteSection({ defaultDestination }: { defaultDestination: string }) {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quote in 4 short steps</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-balance">Tell us roughly what you want.</h2>
          <p className="mt-3 text-muted-foreground">
            We pre-fill destination based on the page you came from. You can change anything.
          </p>
        </div>
        <QuoteForm defaultDestination={defaultDestination} />
      </div>
    </section>
  );
}
