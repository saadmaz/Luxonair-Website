import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews } from "@/data/reviews";

// Colour pool for avatar initials bubbles
const COLOURS = [
  "bg-[#3b82f6]", // blue
  "bg-[#8b5cf6]", // purple
  "bg-[#ec4899]", // pink
  "bg-[#f97316]", // orange
  "bg-[#14b8a6]", // teal
  "bg-[#22c55e]", // green
];

function InitialsAvatar({
  name,
  colourClass,
  className = "",
}: {
  name: string;
  colourClass: string;
  className?: string;
}) {
  const initials = name
    .split(/[\s&,]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`${colourClass} ${className} flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-background`}
    >
      {initials}
    </div>
  );
}

// Positions avatars on a circle centred at (50%, 50%) of the parent
function orbitStyle(angleDeg: number, radiusPx: number): React.CSSProperties {
  const rad = (angleDeg * Math.PI) / 180;
  const x = Math.cos(rad) * radiusPx;
  const y = Math.sin(rad) * radiusPx;
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
  };
}

export function SocialProof() {
  const [current, setCurrent] = useState(0);
  const review = reviews[current];

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  // Spread non-active avatars evenly around the two orbit rings
  const others = reviews
    .map((r, i) => ({ ...r, colour: COLOURS[i % COLOURS.length], origIndex: i }))
    .filter((_, i) => i !== current);

  const outerAngles = [-60, 20, 110, 200];
  const innerAngles = [40, 160, 280];

  const positioned = others.map((r, i) => {
    const isOuter = i < outerAngles.length;
    const angle = isOuter ? outerAngles[i] : innerAngles[i - outerAngles.length];
    const radius = isOuter ? 175 : 105;
    return { ...r, angle, radius };
  });

  return (
    <section className="container-page py-10 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

        {/* ── Left: orbital graphic ── */}
        <div className="flex items-center justify-center">
          <div className="relative h-95 w-95">

            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-border/25" />
            {/* Inner ring */}
            <div
              className="absolute rounded-full border border-border/25"
              style={{ inset: "calc(50% - 105px)" }}
            />

            {/* Centre avatar (active reviewer) */}
            <InitialsAvatar
              name={review.author}
              colourClass={COLOURS[current % COLOURS.length]}
              className="absolute h-20 w-20 text-xl"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" } as React.CSSProperties}
            />

            {/* Orbiting avatars */}
            {positioned.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setCurrent(r.origIndex)}
                style={orbitStyle(r.angle, r.radius)}
                className="transition-transform hover:scale-110 focus:outline-none"
                aria-label={`View review by ${r.author}`}
              >
                <InitialsAvatar
                  name={r.author}
                  colourClass={r.colour}
                  className="h-12 w-12 text-xs"
                />
              </button>
            ))}

            {/* Bottom stat strip */}
            <div
              className="absolute flex items-center gap-3"
              style={{ bottom: 4, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
            >
              <div className="flex -space-x-2.5">
                {reviews.slice(0, 4).map((r, i) => (
                  <InitialsAvatar
                    key={r.id}
                    name={r.author}
                    colourClass={COLOURS[i % COLOURS.length]}
                    className="h-9 w-9 text-[10px]"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">500+ Customers</p>
                <p className="text-xs text-muted-foreground">Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: testimonial content ── */}
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            What Our Travellers Say
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            We go beyond just booking trips — we create unforgettable travel experiences that match your dreams.
          </p>

          <div className="mt-8">
            {/* Star rating */}
            <div className="flex gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>

            {/* Trip label */}
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-primary">
              {review.trip}
            </p>

            {/* Quote body */}
            <blockquote className="mt-3 text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              "{review.body}"
            </blockquote>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              <InitialsAvatar
                name={review.author}
                colourClass={COLOURS[current % COLOURS.length]}
                className="h-11 w-11 text-sm"
              />
              <div>
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-sm text-muted-foreground">{review.trip}</p>
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {current + 1} / {reviews.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
