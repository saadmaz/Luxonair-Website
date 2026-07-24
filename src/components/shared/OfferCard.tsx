// Offer (deal) card: image + badge/region/nights → board → title → blurb → price → expiry.
// Used on /deals and on holiday-type detail pages to show offers tagged with that type.
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

export type OfferCardData = {
  id: string;
  title: string;
  region: string;
  nights: number;
  board: string;
  fromPrice: number;
  oldPrice?: number | null;
  badge?: string;
  expires: string;
  image: string;
  blurb: string;
};

export function OfferCard({ d }: { d: OfferCardData }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-video w-full overflow-hidden bg-muted sm:aspect-16/10">
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
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {d.region}
          </span>
          <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {d.nights} nights
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {d.board}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-xl font-semibold leading-snug">{d.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
          {d.blurb}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-teal">
                £{d.fromPrice.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground">/PP</span>
              </span>
              {d.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  £{d.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <Link
            to="/quote"
            search={{ destination: d.title }}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold/90"
          >
            Get a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {d.expires && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            Expires{" "}
            {new Date(d.expires).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </article>
  );
}
