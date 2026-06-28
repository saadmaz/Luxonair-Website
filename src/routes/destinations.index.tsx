import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { destinations, regions, tripTypes, budgetBands } from "@/data/destinations";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Luxury Holiday Destinations from the UK | Luxeonair" },
      { name: "description", content: "Explore Maldives, Dubai, Japan, Antigua, Santorini and beyond. Curated long-haul holidays departing the UK — tailor-made to your dates, budget and travel style. Filter by region and trip type." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Luxury Holiday Destinations from the UK | Luxeonair" },
      { property: "og:description", content: "Maldives, Dubai, Japan, Antigua & more — tailor-made to your dates and budget. Departing UK airports." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/destinations" },
      { name: "twitter:title", content: "Luxury Holiday Destinations | Luxeonair" },
      { name: "twitter:description", content: "Maldives, Dubai, Japan, Antigua & more. Bespoke UK-departing holidays filtered by region, type and budget." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/destinations" }],
  }),
  component: DestinationsList,
});

function DestinationsList() {
  const [region, setRegion] = useState<string>("All");
  const [trip, setTrip] = useState<string>("All");
  const [budget, setBudget] = useState<string>("All");

  const filtered = useMemo(
    () =>
      destinations.filter(
        (d) =>
          (region === "All" || d.region === region) &&
          (trip === "All" || d.tripType.includes(trip as never)) &&
          (budget === "All" || d.budgetBand === budget)
      ),
    [region, trip, budget]
  );

  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Destinations
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Trips our consultants know inside-out.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Indicative pricing, departing the UK. Every itinerary is tailor-made - these are
            starting points, not packages.
          </p>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="container-page py-8 md:py-14">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-5 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>
              <span className="hidden sm:inline"> of {destinations.length} destinations</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
            <Filter
              label="Region"
              value={region}
              setValue={setRegion}
              options={["All", ...regions]}
            />
            <Filter
              label="Trip type"
              value={trip}
              setValue={setTrip}
              options={["All", ...tripTypes]}
            />
            <Filter
              label="Budget"
              value={budget}
              setValue={setBudget}
              options={["All", ...budgetBands]}
            />
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No matches. Try widening your filters.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DestinationCard key={d.slug} d={d} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Filter({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="grid gap-1.5 sm:gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setValue(o)}
            className={`inline-flex shrink-0 items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:py-1.5 ${
              value === o
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
