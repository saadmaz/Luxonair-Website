import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { SectionHeader } from "@/components/shared/SectionHeader";

// Pulls the first 3 reviews from the shared data so author names and trip
// details stay consistent with the full /reviews page.
export function SocialProof() {
  const featured = reviews.slice(0, 3);

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeader
        eyebrow="Why travellers stay"
        title="Real reviews. Unedited words."
        cta={{ label: "All reviews", to: "/reviews" }}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {featured.map((r) => (
          <figure
            key={r.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              "{r.body}"
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
