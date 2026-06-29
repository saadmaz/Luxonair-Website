import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroSearchTabs } from "@/components/shared/HeroSearchTabs";
import { ArrowRight, Clock, ShieldCheck, Star, Users } from "lucide-react";

// Full-viewport hero: background image, heading, CTAs, trust micro-strip,
// and the HeroSearchTabs widget pinned to the bottom of the section.
// The hero image is preloaded via __root.tsx head() to avoid layout shift.
export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-6.25rem)] flex-col overflow-hidden">
      {/* Layered backgrounds: photo + gradient overlay + ambient glows */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=70"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center"
        />
        {/* Left-to-right: text side stays readable, image breathes on the right */}
        <div className="absolute inset-0 bg-linear-to-r from-navy/90 via-navy/60 to-navy/20" />
        {/* Subtle top scrim so the eyebrow text has contrast */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-navy/50 to-transparent" />
        {/* Bottom scrim for the search widget */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-navy/55 to-transparent" />
        <div className="absolute -bottom-40 -right-40 h-[min(700px,90vw)] w-[min(700px,90vw)] rounded-full bg-gold/10 blur-[140px]" />
        <div className="absolute left-0 top-1/2 h-[min(500px,80vw)] w-[min(500px,80vw)] -translate-y-1/2 rounded-full bg-teal/8 blur-[120px]" />
        <div className="absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-transparent via-teal/50 to-transparent" />
      </div>

      {/* Main content - grows to fill the viewport height above the search widget */}
      <div className="container-page flex flex-1 flex-col justify-center pb-3 pt-5 md:pb-4 md:pt-8">
        <div className="max-w-3xl">
          <h1 className="mt-3 font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-navy-fg sm:mt-4 sm:text-5xl md:text-[3.25rem] text-balance">
            Tailor-Made Holidays,{" "}
            <span className="text-gold">Built Around</span>{" "}
            You
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-navy-fg/75 md:mt-4 md:text-base">
            Premium long-haul flights, family escapes and corporate travel, all crafted by a dedicated UK travel consultant who knows your trip inside out.
          </p>

          {/* Primary + secondary CTAs */}
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-11 bg-gold px-6 text-sm font-semibold text-gold-foreground shadow-xl shadow-gold/25 hover:bg-gold/90 sm:px-7"
            >
              <Link to="/quote">
                Start a quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              to="/destinations"
              className="flex items-center gap-1.5 text-sm text-navy-fg/50 transition-colors hover:text-navy-fg"
            >
              Explore destinations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Trust micro-strip — 2×2 grid on mobile, single row on sm+ */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {[
              { icon: ShieldCheck, label: "ATOL Protected" },
              { icon: Star,        label: "4.9★ avg rating" },
              { icon: Clock,       label: "Rapid response" },
              { icon: Users,       label: "500+ trips" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-navy-fg/55">
                <Icon className="h-3.5 w-3.5 shrink-0 text-teal/70" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search widget - pinned to the bottom of the hero section */}
      <div className="pb-6 md:pb-8">
        <HeroSearchTabs />
      </div>
    </section>
  );
}
