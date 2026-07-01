// Home page route - pure composition of section components.
// Each section lives in src/features/home/ and can be edited independently.
import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/shared/Newsletter";
import { getTestimonials } from "@/server/queries";
import {
  Hero,
  TrustPillars,
  HotDeals,
  FeaturedDestinations,
  HolidayTypeTiles,
  AllTimeFavourites,
  WhyLuxonair,
  SocialProof,
  BlogCarousel,
  HomeFAQ,
  FinalCTA,
} from "@/features/home";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const testimonials = await getTestimonials();
      return { testimonials };
    } catch {
      return { testimonials: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Luxeonair | Tailor-Made Luxury Holidays & Corporate Travel from the UK" },
      { name: "description", content: "Bespoke long-haul holidays, family escapes and corporate trips built by London consultants who know every route. ATOL protected. Quote replied to within 4 working hours." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Luxeonair | Tailor-Made Luxury Travel from the UK" },
      { property: "og:description", content: "Bespoke long-haul holidays, family escapes and corporate trips from the UK. One consultant. ATOL protected. Quote in minutes." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/" },
      { name: "twitter:title", content: "Luxeonair | Tailor-Made Luxury Travel from the UK" },
      { name: "twitter:description", content: "Bespoke long-haul holidays & corporate trips from the UK. ATOL protected. A consultant replies to every quote within 4 hours." },
    ],
    links: [
      { rel: "canonical", href: "https://www.luxeonair.co.uk/" },
      {
        rel: "preload",
        as: "image",
        href: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=70",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { testimonials } = Route.useLoaderData();
  return (
    <>
      <Hero />
      <TrustPillars />
      <HotDeals />
      <FeaturedDestinations />
      <HolidayTypeTiles />
      <AllTimeFavourites />
      <WhyLuxonair />
      <SocialProof testimonials={testimonials} />
      <BlogCarousel />
      <HomeFAQ />
      <Newsletter variant="section" />
      <FinalCTA />
    </>
  );
}
