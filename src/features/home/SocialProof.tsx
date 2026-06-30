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

type Row = { id: number | string; author: string; trip: string; rating: number; body: string };

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&h=120&q=80",
];

const OUTER_R = 158;
const INNER_R = 93;
const ORBIT_BOX = 360;
const OUTER_ANGLES = [-68, 17, 102, 178, 258];
const INNER_ANGLES = [42, 162, 282];

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  const rows: Row[] =
    testimonials.length > 0
      ? testimonials.map((t) => ({ id: t.id, author: t.author, trip: t.trip, rating: t.rating, body: t.body }))
      : staticReviews.map((r) => ({ id: r.id, author: r.author, trip: r.trip, rating: r.rating, body: r.body }));

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const switchTo = (idx: number) => {
    if (idx === current) return;
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 220);
  };

  const prev = () => switchTo((current - 1 + rows.length) % rows.length);
  const next = () => switchTo((current + 1) % rows.length);

  const review = rows[current];

  const orbiting = rows
    .map((r, i) => ({ ...r, idx: i }))
    .filter((_, i) => i !== current)
    .map((r, slot) => {
      const isOuter = slot < OUTER_ANGLES.length;
      const angle = isOuter ? OUTER_ANGLES[slot] : INNER_ANGLES[slot - OUTER_ANGLES.length];
      const radius = isOuter ? OUTER_R : INNER_R;
      const size = isOuter ? 50 : 42;
      const { x, y } = polar(angle ?? 0, radius);
      return { ...r, x, y, size };
    });

  return (
    <section className="container-page py-14 md:py-20">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">

        {/* ── Left: orbital constellation ─────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-8">
          <div className="relative shrink-0" style={{ width: ORBIT_BOX, height: ORBIT_BOX }}>
            <div
              className="pointer-events-none absolute rounded-full border-[1.5px] border-foreground/[0.14]"
              style={{ inset: `calc(50% - ${OUTER_R}px)` }}
            />
            <div
              className="pointer-events-none absolute rounded-full border-[1.5px] border-foreground/[0.10]"
              style={{ inset: `calc(50% - ${INNER_R}px)` }}
            />

            <img
              src={AVATARS[current % AVATARS.length]}
              alt={review.author}
              className="absolute rounded-full object-cover shadow-xl ring-4 ring-background transition-all duration-300"
              style={{ width: 86, height: 86, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            />

            {orbiting.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => switchTo(r.idx)}
                aria-label={`Read review by ${r.author}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                style={{ left: `calc(50% + ${r.x}px)`, top: `calc(50% + ${r.y}px)` }}
              >
                <img
                  src={AVATARS[r.idx % AVATARS.length]}
                  alt={r.author}
                  className="rounded-full object-cover shadow-md ring-2 ring-background transition-all duration-200 group-hover:ring-[3px] group-hover:ring-gold"
                  style={{ width: r.size, height: r.size }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-border bg-background px-5 py-2.5 shadow-sm">
            <div className="flex -space-x-2.5">
              {rows.slice(0, 4).map((r, i) => (
                <img key={r.id} src={AVATARS[i % AVATARS.length]} alt={r.author} className="h-8 w-8 rounded-full object-cover ring-2 ring-background" />
              ))}
            </div>
            <p className="text-sm text-foreground">
              <span className="font-bold">500+</span>
              <span className="ml-1 text-muted-foreground">happy travellers</span>
            </p>
          </div>
        </div>

        {/* ── Right: testimonial content ───────────────────────────────── */}
        <div>
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex -space-x-2.5">
              {rows.slice(0, 5).map((r, i) => (
                <img key={r.id} src={AVATARS[i % AVATARS.length]} alt={r.author} className="h-9 w-9 rounded-full object-cover ring-2 ring-background shadow-sm" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">500+</strong> happy travellers
            </p>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What our travellers say
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Every review below is from a Luxeonair-booked trip. Nothing curated, nothing fabricated.
          </p>

          {/* Review card — fades when switching */}
          <div
            className="mt-8 space-y-4 transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? "fill-gold text-gold" : "fill-muted-foreground/20 text-muted-foreground/20"}`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">{review.trip}</p>
            </div>

            <blockquote className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl lg:text-[1.55rem] lg:leading-snug">
              "{review.body}"
            </blockquote>

            <div className="flex items-center gap-3 pt-3">
              <img
                src={AVATARS[current % AVATARS.length]}
                alt={review.author}
                className="h-12 w-12 rounded-full object-cover shadow ring-2 ring-border"
              />
              <div>
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-sm text-muted-foreground">{review.trip}</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-muted hover:scale-110 active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-muted hover:scale-110 active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-sm tabular-nums text-muted-foreground">{current + 1} / {rows.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
