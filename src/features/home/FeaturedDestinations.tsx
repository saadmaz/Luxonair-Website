import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

// Shows the first 4 destinations as a preview grid.
// Destinations are ordered by the array in data/destinations.ts — reorder there to change this.
export function FeaturedDestinations() {
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
