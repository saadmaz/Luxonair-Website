import { createFileRoute, Link } from "@tanstack/react-router";
import { deals } from "@/lib/deals";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Travel Deals & Offers — Luxonair" },
      { name: "description", content: "Limited-availability holiday and flight deals from the UK. Indicative pricing — confirmed at quote stage." },
      { property: "og:title", content: "Travel Deals & Offers — Luxonair" },
      { property: "og:description", content: "Hand-picked, limited-availability deals from UK departure airports." },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: DealsPage,
});

function DealsPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deals</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Curated, time-limited, never auto-generated.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Each offer is held by one of our consultants. Click through and you'll get a real-person quote within 4 working hours.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <article key={d.id} className="group overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {d.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-medium text-gold-foreground">
                  {d.badge}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{d.region} · {d.nights} nights · {d.board}</p>
              <h2 className="mt-1 font-display text-lg font-semibold">{d.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d.blurb}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">From, pp</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-semibold text-foreground">£{d.fromPrice.toLocaleString()}</span>
                    {d.oldPrice && <span className="text-sm text-muted-foreground line-through">£{d.oldPrice.toLocaleString()}</span>}
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/quote" search={{ destination: d.title }}>Quote</Link>
                </Button>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Expires {new Date(d.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
