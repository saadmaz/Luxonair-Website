// Home page route - pure composition of section components.
// Each section lives in src/components/home/ and can be edited independently.
import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/shared/Newsletter";
import {
  Hero,
  StatsStrip,
  TrustPillars,
  FeaturedDestinations,
  HolidayTypeTiles,
  DealsSection,
  WhyLuxonair,
  SocialProof,
  FinalCTA,
  BlogCarousel,
} from "@/features/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxonair - UK travel specialists for long-haul, family & corporate trips" },
      {
        name: "description",
        content:
          "Tailor-made long-haul, family escapes and corporate trips from the UK. Start a structured quote in minutes - a consultant replies within 4 working hours.",
      },
      { property: "og:title", content: "Luxonair - UK travel specialists" },
      {
        property: "og:description",
        content: "Tailor-made long-haul, family escapes and corporate trips from the UK.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      {
        // Preload the hero background so it's ready before the above-the-fold paint
        rel: "preload",
        as: "image",
        href: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=70",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <TrustPillars />
      <FeaturedDestinations />
      <HolidayTypeTiles />
      <DealsSection />
      <WhyLuxonair />
      <SocialProof />
      <BlogCarousel />
      <Newsletter variant="section" />
      <FinalCTA />
    </>
  );
}
