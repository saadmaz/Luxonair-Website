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
      { title: "Luxe on Air | Tailor-Made Luxury Holidays & Corporate Travel from the UK" },
      { name: "description", content: "Bespoke long-haul holidays, family escapes and corporate trips built by London consultants who know every route. ATOL protected. Quote replied to within 4 working hours." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Luxe on Air | Tailor-Made Luxury Travel from the UK" },
      { property: "og:description", content: "Bespoke long-haul holidays, family escapes and corporate trips from the UK. One consultant. ATOL protected. Quote in minutes." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.com/" },
      { name: "twitter:title", content: "Luxe on Air | Tailor-Made Luxury Travel from the UK" },
      { name: "twitter:description", content: "Bespoke long-haul holidays & corporate trips from the UK. ATOL protected. A consultant replies to every quote within 4 hours." },
    ],
    links: [
      { rel: "canonical", href: "https://www.luxeonair.com/" },
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
