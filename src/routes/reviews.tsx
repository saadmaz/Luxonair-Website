import { createFileRoute } from "@tanstack/react-router";
import { reviews, aggregate } from "@/lib/reviews";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Luxonair" },
      { name: "description", content: `Read unedited reviews from Luxonair travellers. Average rating ${aggregate.average} from ${aggregate.count} verified trips.` },
      { property: "og:title", content: "Customer Reviews — Luxonair" },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <header className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reviews</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">
            Real travellers. Unedited words.
          </h1>
          <p className="mt-3 text-muted-foreground">
            We'll publish a verified Trustpilot/Feefo aggregate here once enabled. Until then: every review below is from a Luxonair-booked trip.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
          </div>
          <div className="mt-2 font-display text-3xl font-semibold">{aggregate.average} / 5</div>
          <div className="text-sm text-muted-foreground">Across {aggregate.count} verified trips</div>
        </div>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <figure key={r.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-1 text-gold">
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed">"{r.body}"</blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">
              {r.author} · {r.trip} · {new Date(r.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
