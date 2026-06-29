import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews as staticReviews } from "@/data/reviews";

type Testimonial = {
  id: number;
  author: string;
  trip: string;
  rating: number;
  body: string;
};

// Pool of Unsplash portrait photos — assigned by index, loops if more testimonials than photos
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&h=100&q=80",
];

type Row = { id: number | string; author: string; trip: string; rating: number; body: string };

// Positions avatars on a circle centred at (50%, 50%)
function orbitStyle(angleDeg: number, radiusPx: number): React.CSSProperties {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${Math.cos(rad) * radiusPx}px), calc(-50% + ${Math.sin(rad) * radiusPx}px))`,
  };
}

// Outer-ring angles for up to 5 non-active avatars, inner ring for remaining
const OUTER_ANGLES = [-70, 10, 90, 170, 250];
const INNER_ANGLES = [30, 150, 270];

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  const rows: Row[] = testimonials.length > 0
    ? testimonials.map((t) => ({ id: t.id, author: t.author, trip: t.trip, rating: t.rating, body: t.body }))
    : staticReviews.map((r) => ({ id: r.id, author: r.author, trip: r.trip, rating: r.rating, body: r.body }));

  const [current, setCurrent] = useState(0);
  const review = rows[current];

  const prev = () => setCurrent((c) => (c - 1 + rows.length) % rows.length);
  const next = () => setCurrent((c) => (c + 1) % rows.length);

  // All non-active rows positioned on the orbit rings
  const others = rows
    .map((r, i) => ({ ...r, idx: i }))
    .filter((_, i) => i !== current);

  const positioned = others.map((r, i) => {
    const isOuter = i < OUTER_ANGLES.length;
    const angle  = isOuter ? OUTER_ANGLES[i] : INNER_ANGLES[i - OUTER_ANGLES.length];
    const radius = isOuter ? 170 : 100;
    return { ...r, angle, radius };
  });

  return (
    <section className="container-page py-10 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

        {/* ── Left: orbital graphic ─────────────────────────────────── */}
        <div className="flex items-center justify-center">
          <div className="relative h-95 w-95">

            {/* Outer grey ring */}
            <div className="absolute inset-0 rounded-full border-2 border-border/20" />
            {/* Inner grey ring */}
            <div
              className="absolute rounded-full border-2 border-border/20"
              style={{ inset: "calc(50% - 100px)" }}
            />

            {/* Centre avatar — active reviewer */}
            <img
              src={AVATARS[current % AVATARS.length]}
              alt={review.author}
              className="absolute h-[88px] w-[88px] rounded-full object-cover ring-4 ring-background shadow-lg"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            />

            {/* Orbiting avatars */}
            {positioned.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setCurrent(r.idx)}
                style={orbitStyle(r.angle, r.radius)}
                className="group transition-transform hover:scale-110 focus:outline-none"
                aria-label={`View review by ${r.author}`}
              >
                <img
                  src={AVATARS[r.idx % AVATARS.length]}
                  alt={r.author}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-background shadow-md transition-shadow group-hover:ring-gold"
                />
              </button>
            ))}

            {/* Bottom stat strip */}
            <div
              className="absolute flex items-center gap-3"
              style={{ bottom: 6, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
            >
              <div className="flex -space-x-2.5">
                {rows.slice(0, 4).map((r, i) => (
                  <img
                    key={r.id}
                    src={AVATARS[i % AVATARS.length]}
                    alt={r.author}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
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

        {/* ── Right: testimonial content ────────────────────────────── */}
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            What Our Travellers Say
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            We go beyond just booking trips — we create unforgettable travel experiences that match your dreams.
          </p>

          <div className="mt-8">
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(review.rating, 5) }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>

            {/* Trip label */}
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {review.trip}
            </p>

            {/* Quote */}
            <blockquote className="mt-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
              "{review.body}"
            </blockquote>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              <img
                src={AVATARS[current % AVATARS.length]}
                alt={review.author}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
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
              {current + 1} / {rows.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
