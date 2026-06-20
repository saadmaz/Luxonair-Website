import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

export function BlogCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const total = blogPosts.length;

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(index);
        setFading(false);
      }, 220);
    },
    [current]
  );

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total), 6000);
    return () => clearInterval(id);
  }, [current, goTo, total]);

  const post = blogPosts[current];

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeader
        eyebrow="From the journal"
        title="Guides, insights & destination notes."
        cta={{ label: "All articles", to: "/blog" }}
      />

      <div className="relative mt-10">
        {/* Carousel card */}
        <div
          className={cn(
            "overflow-hidden rounded-2xl shadow-xl transition-opacity duration-200",
            fading ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="grid md:grid-cols-2">
            {/* Left — text panel */}
            <div className="flex flex-col justify-center bg-[#042045] px-8 py-10 md:px-12 md:py-14">
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                {post.category}
              </span>

              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
                {post.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">
                {post.excerpt}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/35">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readMinutes} min read</span>
                <span>·</span>
                <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>

              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — image panel */}
            <div className="relative min-h-56 overflow-hidden md:min-h-80">
              <img
                key={post.slug}
                src={post.heroImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              {/* Subtle left-edge fade so image blends into the text panel on wide screens */}
              <div className="absolute inset-y-0 left-0 hidden w-16 bg-linear-to-r from-[#042045] to-transparent md:block" />
            </div>
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous article"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#042045]/70 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-[#042045] md:-left-5 md:border-border md:bg-background md:text-foreground md:hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next article"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#042045]/70 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-[#042045] md:-right-5 md:border-border md:bg-background md:text-foreground md:hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {blogPosts.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to article ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-[#042045] dark:bg-white"
                : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/20 dark:hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
