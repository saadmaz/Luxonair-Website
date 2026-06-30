import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useInView } from "@/hooks/useInView";

export function FeaturedDestinations() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <section className="container-page py-10 md:py-20">
      <SectionHeader
        eyebrow="Popular destinations"
        title="Itineraries our consultants build most often"
        cta={{ label: "All destinations", to: "/destinations" }}
      />
      <div ref={ref} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.slice(0, 4).map((d, i) => (
          <div
            key={d.slug}
            className={`transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <DestinationCard d={d} />
          </div>
        ))}
      </div>
    </section>
  );
}
