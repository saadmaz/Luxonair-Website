import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { getTestimonials } from "@/server/queries";

export const Route = createFileRoute("/reviews")({
  loader: async () => getTestimonials(),
  head: ({ loaderData }) => {
    const items = loaderData ?? [];
    const average = items.length
      ? +(items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
      : 5.0;
    const count = items.length || 6;
    return {
      meta: [
        { title: `Client Reviews & Testimonials | ${average}★ from ${count} Trips | Luxeonair` },
        { name: "description", content: `${average}/5 from ${count} verified trips. Unedited reviews from Luxeonair clients covering honeymoons, family holidays, corporate travel and long-haul escapes.` },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `Client Reviews | ${average}/5 from ${count} Verified Trips | Luxeonair` },
        { property: "og:description", content: `${average}/5 from ${count} verified trips — honeymoons, family holidays, corporate travel and long-haul escapes. Unedited.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://www.luxeonair.co.uk/reviews" },
        { name: "twitter:title", content: `Luxeonair Reviews | ${average}/5 from ${count} Trips` },
        { name: "twitter:description", content: `Unedited client reviews — ${average}/5 from ${count} verified trips. Honeymoons, family holidays and corporate travel.` },
      ],
      links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/reviews" }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://www.luxeonair.co.uk/#organization",
          "name": "Luxeonair",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": average,
            "reviewCount": count,
            "bestRating": "5",
            "worstRating": "1"
          }
        }),
      }],
    };
  },
  component: ReviewsPage,
});

function ReviewsPage() {
  const items = Route.useLoaderData();
  const average = items.length
    ? +(items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
    : 0;

  return (
    <>
      {/* Dark hero with aggregate score */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Reviews</p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
                Real travellers. Unedited words.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
                We'll publish a verified Trustpilot / Feefo aggregate here once enabled. Until
                then: every review below is from a Luxeonair-booked trip - nothing fabricated.
              </p>
            </div>

            {/* Score card */}
            <div className="rounded-2xl border border-navy-fg/15 bg-navy-fg/5 p-7">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <div className="mt-3 font-display text-5xl font-semibold text-navy-fg">
                {average}
                <span className="ml-1 text-2xl text-navy-fg/40">/ 5</span>
              </div>
              <div className="mt-2 text-sm text-navy-fg/55">
                From {items.length} verified trips
              </div>
              <div className="mt-5 border-t border-navy-fg/10 pt-4 text-xs text-navy-fg/40">
                Trustpilot / Feefo score pending - ask us for references directly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="container-page py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "opacity-25"}`} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                "{r.body}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <span className="text-sm font-medium text-foreground">{r.author}</span>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {r.trip} ·{" "}
                  {new Date(r.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-page pb-16">
        <div className="rounded-2xl bg-navy px-8 py-10 text-navy-fg md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Ready to write your own review?</h2>
              <p className="mt-2 text-sm text-navy-fg/70">Start with a free quote - a consultant replies within 4 working hours.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/quote">Start a quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-navy-fg/30 bg-transparent text-navy-fg hover:bg-navy-fg/10">
                <a href={`https://wa.me/${SITE.phone.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-1.5 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
