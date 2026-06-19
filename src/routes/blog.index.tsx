import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Travel Guides & News — Luxonair Blog" },
      { name: "description", content: "Field-tested travel guides, corporate-travel essays, and destination notes from the Luxonair team." },
      { property: "og:title", content: "Luxonair Blog" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [feature, ...rest] = blogPosts;
  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Journal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">Travel notes from the Luxonair desk.</h1>
        <p className="mt-3 text-muted-foreground">Guides, essays, and field notes from consultants who fly the routes they sell.</p>
      </header>

      <Link
        to="/blog/$slug"
        params={{ slug: feature.slug }}
        className="mt-10 grid gap-6 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2"
      >
        <img src={feature.heroImage} alt={feature.title} loading="lazy" className="h-full w-full object-cover" />
        <div className="p-6 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{feature.category} · {feature.readMinutes} min read</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{feature.title}</h2>
          <p className="mt-3 text-muted-foreground">{feature.excerpt}</p>
          <p className="mt-6 text-xs text-muted-foreground">{feature.author} · {new Date(feature.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </Link>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img src={p.heroImage} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category} · {p.readMinutes} min</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
