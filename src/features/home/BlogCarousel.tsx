import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

export function BlogCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = blogPosts.length;

  const goTo = useCallback(
    (index: number) => {
      if (index === current || animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 250);
    },
    [current, animating]
  );

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % total);
    }, 7000);
    return () => clearInterval(id);
  }, [current, goTo, total]);

  const post = blogPosts[current];

  return (
    <section className="py-14 md:py-20">
      {/* Section header stays inside the page container */}
      <div className="container-page mb-8">
        <SectionHeader
          eyebrow="From the journal"
          title="Guides, insights & destination notes."
          cta={{ label: "All articles", to: "/blog" }}
        />
      </div>

      {/* Carousel wrapper — padded to create space for the outer arrows */}
      <div className="mx-auto max-w-[1200px] px-12 md:px-16">
        <div className="relative">
          {/* ── Card ─────────────────────────────────────────────────────── */}
          <div
            className={cn(
              "overflow-hidden rounded-2xl shadow-2xl transition-opacity duration-250",
              animating ? "opacity-0" : "opacity-100"
            )}
            style={{ minHeight: 0 }}
          >
            <div className="flex h-full flex-col md:flex-row md:h-[420px] lg:h-[460px]">

              {/* Mobile: image strip across the top */}
              <div className="relative h-52 w-full shrink-0 md:hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />
              </div>

              {/* Text panel */}
              <div className="flex flex-col justify-center bg-[#042045] px-8 py-8 md:w-[46%] md:shrink-0 md:px-12 lg:px-14 lg:py-12">
                <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {post.category}
                </span>

                <h3 className="mt-4 font-display text-[1.35rem] font-semibold leading-snug text-white md:text-2xl lg:text-[1.65rem]">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55 md:line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-white/35">
                  <Clock className="h-3.5 w-3.5" />
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
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
                >
                  Read article <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Image panel — desktop only */}
              <div className="relative hidden flex-1 overflow-hidden md:block">
                <img
                  key={post.slug}
                  src={post.heroImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
                {/* Blend edge between text and image */}
                <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-[#042045] to-transparent" />
              </div>
            </div>
          </div>

          {/* ── Arrow buttons — sit outside the card in the px-12/px-16 gutter ── */}
          <button
            onClick={prev}
            aria-label="Previous article"
            className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 -ml-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all hover:border-gray-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-white" />
          </button>

          <button
            onClick={next}
            aria-label="Next article"
            className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 ml-3 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-all hover:border-gray-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 dark:text-white" />
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
