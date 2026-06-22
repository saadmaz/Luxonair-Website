import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Travel Guides & News - Luxe on Air Blog" },
      {
        name: "description",
        content:
          "Field-tested travel guides, corporate-travel essays, and destination notes from the Luxe on Air team.",
      },
      { property: "og:title", content: "Luxe on Air Blog" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [feature, ...rest] = blogPosts;
  return (
    <>
      {/* Dark hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Journal</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Travel notes from the Luxe on Air desk.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Guides, essays, and field notes from consultants who fly the routes they sell.
          </p>
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        {/* Featured article */}
        <Link
          to="/blog/$slug"
          params={{ slug: feature.slug }}
          className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl md:grid-cols-[1fr_1fr]"
        >
          <div className="overflow-hidden">
            <img
              src={feature.heroImage}
              alt={feature.title}
              loading="lazy"
              className="h-full min-h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10">
            <span className="inline-flex w-fit rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              {feature.category}
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feature.excerpt}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{feature.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {feature.readMinutes} min read
              </span>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Read article <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Article grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-4/3 w-full overflow-hidden">
                <img
                  src={p.heroImage}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                    {p.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {p.readMinutes} min
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
