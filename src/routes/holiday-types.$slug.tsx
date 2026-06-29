import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import { Newsletter } from "@/components/shared/Newsletter";
import { PackageCard } from "@/components/shared/PackageCard";
import { getHolidayTypeBySlug, getDestinations } from "@/server/queries";
import { holidayPackages } from "@/data/packages";
import { SITE } from "@/config";

export const Route = createFileRoute("/holiday-types/$slug")({
  loader: async ({ params }) => {
    const [holidayType, allDests] = await Promise.all([
      getHolidayTypeBySlug({ data: params.slug }),
      getDestinations(),
    ]);
    if (!holidayType) throw notFound();
    const destinationSlugs = holidayType.destinationSlugs as string[];
    const linkedDestinations = allDests.filter((d) =>
      destinationSlugs.includes(d.slug)
    );
    const packages = holidayPackages.filter(
      (p) => p.holidayTypeSlug === params.slug
    );
    return { holidayType, linkedDestinations, packages };
  },
  head: ({ loaderData, params }) => {
    const h = loaderData?.holidayType;
    if (!h) return { meta: [{ title: "Holiday Type | Luxeonair" }] };
    return {
      meta: [
        {
          title: `${h.name} Holidays from the UK | Tailor-Made | Luxeonair`,
        },
        {
          name: "description",
          content: `${h.tagline}. Handcrafted ${h.name.toLowerCase()} holidays departing the UK — ATOL protected, one dedicated consultant from first quote to return gate.`,
        },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: `${h.name} Holidays from the UK | Luxeonair`,
        },
        {
          property: "og:description",
          content: `${h.tagline}. Tailor-made, ATOL protected, departing UK airports.`,
        },
        { property: "og:image", content: h.heroImage },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: `https://www.luxeonair.co.uk/holiday-types/${params.slug}`,
        },
        {
          name: "twitter:title",
          content: `${h.name} Holidays | Luxeonair`,
        },
        {
          name: "twitter:description",
          content: `${h.tagline}. Tailor-made from the UK, ATOL protected.`,
        },
        { name: "twitter:image", content: h.heroImage },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://www.luxeonair.co.uk/holiday-types/${params.slug}`,
        },
      ],
    };
  },
  component: HolidayTypePage,
  notFoundComponent: () => (
    <div className="container-page py-20">
      <h1 className="font-display text-3xl">Not found</h1>
      <Link to="/holiday-types" className="mt-4 inline-flex text-primary">
        Back to holiday types
      </Link>
    </div>
  ),
});

function HolidayTypePage() {
  const { holidayType: h, packages } = Route.useLoaderData();
  const bullets = h.bullets as string[];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[500px] items-center md:min-h-[560px]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${h.heroImage})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/80 via-navy/65 to-navy/90" />

        <div className="container-page py-20 text-navy-fg md:py-28">
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl md:text-7xl text-balance">
            <span className="text-gold">{h.name}</span>{" "}
            <span className="text-teal">Holidays</span>{" "}
            <span className="text-white">2026</span>
          </h1>
          <p className="mt-4 max-w-xl text-base font-medium text-navy-fg/80 sm:text-lg">
            Browse Our Best {h.name} Holidays
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`tel:${SITE.phone.tel}`}>
                <Phone className="mr-2 h-4 w-4" /> Talk to an Expert
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/quote">
                <MessageCircle className="mr-2 h-4 w-4" /> Request a Quote
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] text-white hover:bg-[#22c55e]"
            >
              <a
                href={`https://wa.me/${SITE.phone.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Enquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── DISCOVER ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-20">
        <div className="container-page max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl text-balance">
            Discover{" "}
            <span className="text-gold">{h.name}</span>{" "}
            <span className="text-teal">Holidays</span>{" "}
            in 2026
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {h.summary}
          </p>
        </div>
      </section>

      {/* ── PACKAGES GRID ────────────────────────────────────────────────── */}
      {packages.length > 0 && (
        <section className="bg-secondary/30 py-16 md:py-20">
          <div className="container-page">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Top {h.name} Holidays 2026
              </h2>
              <p className="mt-2 text-muted-foreground">{h.tagline}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                <Link to="/quote" search={{ tripType: h.name }}>
                  Get a personalised {h.name.toLowerCase()} quote{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── WHAT'S INCLUDED ──────────────────────────────────────────────── */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Why choose Luxeonair
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-balance">
              Every {h.name.toLowerCase()} holiday includes
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {h.summary}
            </p>
            <Button
              asChild
              className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/quote" search={{ tripType: h.name }}>
                Start a {h.name.toLowerCase()} quote{" "}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ul className="space-y-3 self-start">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-sm"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <Newsletter variant="section" />

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="container-page pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-navy-fg shadow-2xl md:px-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-navy-fg/5" />
          <div className="pointer-events-none absolute -bottom-10 right-36 h-40 w-40 rounded-full bg-gold/10" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Ready to plan your {h.name.toLowerCase()} holiday?
            </h2>
            <p className="mt-3 text-navy-fg/70">
              Tell us where you'd like to go, roughly when, and how many are
              travelling. A consultant replies within 4 working hours — no spam,
              no auto-mailers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                <Link to="/quote">
                  Start a {h.name.toLowerCase()} quote
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-fg/30 bg-transparent text-navy-fg hover:bg-navy-fg/10"
              >
                <Link to="/contact">Speak to someone first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
