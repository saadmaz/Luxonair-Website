import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  heroImage: string;
  readMinutes: number;
  date: string;
};

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 50 }),
  center: { opacity: 1, x: 0 },
  exit:  (d: number) => ({ opacity: 0, x: d * -50 }),
};

export function BlogCarousel({ posts: blogPosts }: { posts: BlogPost[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = blogPosts.length;

  const goTo = useCallback(
    (index: number, dir?: number) => {
      if (index === current) return;
      setDirection(dir ?? (index > current ? 1 : -1));
      setCurrent(index);
    },
    [current]
  );

  const prev = () => goTo((current - 1 + total) % total, -1);
  const next = () => goTo((current + 1) % total, 1);

  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(() => {
      goTo((current + 1) % total, 1);
    }, 7000);
    return () => clearInterval(id);
  }, [current, goTo, total]);

  if (total === 0) return null;
  const post = blogPosts[current];

  return (
    <section className="py-8 md:py-12">
      {/* Section header stays inside the page container */}
      <div className="container-page mb-5 sm:mb-6">
        <SectionHeader
          eyebrow="From the journal"
          title="Guides, insights & destination notes."
          cta={{ label: "All articles", to: "/blog" }}
        />
      </div>

      {/* Carousel wrapper — padded to create space for the outer arrows */}
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8 md:px-12">
        <div className="relative">
          {/* ── Card ─────────────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl shadow-xl" style={{ minHeight: 0 }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex h-full flex-col md:flex-row md:h-[320px] lg:h-[360px]"
              >
                {/* Mobile: image strip across the top */}
                <div className="relative h-40 w-full shrink-0 md:hidden">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />
                </div>

                {/* Text panel */}
                <div className="flex flex-col justify-center bg-[#042045] px-4 py-5 sm:px-7 sm:py-6 md:w-[46%] md:shrink-0 md:px-10 lg:px-12 lg:py-8">
                  <span className="inline-flex w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                    {post.category}
                  </span>

                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white md:text-xl lg:text-[1.35rem]">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55 md:line-clamp-3 md:text-sm">
                    {post.excerpt}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
                    <Clock className="h-3 w-3" />
                    <span>{post.readMinutes} min read</span>
                    <span className="mx-0.5">·</span>
                    <span>
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
                  >
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Image panel — desktop only */}
                <div className="relative hidden flex-1 overflow-hidden md:block">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Blend edge between text and image */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-[#042045] to-transparent" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Arrow buttons — centred in the mobile image strip (h-40 = 160px), outside on md+ ── */}
          <button
            onClick={prev}
            aria-label="Previous article"
            className="absolute left-2 top-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md transition-all hover:border-gray-300 hover:shadow-lg md:left-0 md:top-1/2 md:-translate-x-full md:-ml-3 md:h-11 md:w-11 dark:border-white/10 dark:bg-navy/80 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700 md:h-5 md:w-5 dark:text-white" />
          </button>

          <button
            onClick={next}
            aria-label="Next article"
            className="absolute right-2 top-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md transition-all hover:border-gray-300 hover:shadow-lg md:right-0 md:top-1/2 md:translate-x-full md:ml-3 md:h-11 md:w-11 dark:border-white/10 dark:bg-navy/80 dark:hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4 text-gray-700 md:h-5 md:w-5 dark:text-white" />
          </button>
        </div>

        {/* ── Dot indicators ─────────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {blogPosts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Article ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-7 bg-[#042045] dark:bg-white"
                  : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/20 dark:hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
