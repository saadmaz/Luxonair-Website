import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { destinations, regions, tripTypes, budgetBands } from "@/lib/destinations";
import { DestinationCard } from "@/components/site/DestinationCard";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinations — Luxonair" },
      { name: "description", content: "Browse Luxonair's curated long-haul, Caribbean, Indian Ocean and European itineraries. Filter by region, trip type and budget." },
      { property: "og:title", content: "Destinations — Luxonair" },
      { property: "og:description", content: "Curated UK-departing itineraries. Filter by region, trip type and budget." },
      { property: "og:url", content: "/destinations" },
    ],
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
  component: DestinationsList,
});

function DestinationsList() {
  const [region, setRegion] = useState<string>("All");
  const [trip, setTrip] = useState<string>("All");
  const [budget, setBudget] = useState<string>("All");

  const filtered = useMemo(() => destinations.filter((d) =>
    (region === "All" || d.region === region) &&
    (trip === "All" || d.tripType.includes(trip as never)) &&
    (budget === "All" || d.budgetBand === budget)
  ), [region, trip, budget]);

  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Destinations</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Trips our consultants know inside-out.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Indicative pricing, departing the UK. Every itinerary is tailor-made — these are starting points, not packages.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        <Filter label="Region" value={region} setValue={setRegion} options={["All", ...regions]} />
        <Filter label="Trip type" value={trip} setValue={setTrip} options={["All", ...tripTypes]} />
        <Filter label="Budget" value={budget} setValue={setBudget} options={["All", ...budgetBands]} />
        <div className="ml-auto flex items-center text-sm text-muted-foreground">
          {filtered.length} of {destinations.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">No matches. Try widening your filters.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <DestinationCard key={d.slug} d={d} />)}
        </div>
      )}
    </div>
  );
}

function Filter({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: readonly string[] }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setValue(o)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              value === o ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
