import { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type DestinationHighlight = { id: number; image: string; country: string; city: string; type: string };

type Props = { highlights: DestinationHighlight[] };

export function FeaturedDestinations({ highlights }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (highlights.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Popular Destinations
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Explore top picks with trending destinations our clients love
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        >
          {highlights.map((h) => (
            <div
              key={h.id}
              className="group flex w-52.5 shrink-0 snap-start flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  src={h.image}
                  alt={`${h.city}, ${h.country}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-sm">
                  {h.type}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm font-bold text-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                {h.city}
              </p>
              <p className="text-xs text-muted-foreground">{h.country}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
