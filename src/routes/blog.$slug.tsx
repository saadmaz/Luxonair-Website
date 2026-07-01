import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { generateHTML } from "@tiptap/html";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/server/queries";
import { editorExtensions } from "@/components/admin/RichTextEditor";

function renderContentHtml(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  try {
    return generateHTML(content as Parameters<typeof generateHTML>[0], editorExtensions);
  } catch {
    return "";
  }
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    let p;
    try {
      p = await getBlogPostBySlug({ data: params.slug });
    } catch {
      throw notFound();
    }
    if (!p) throw notFound();
    const allPosts = await getPublishedBlogPosts().catch(() => []);
    const related = allPosts.filter((post) => post.slug !== params.slug).slice(0, 3);
    return { post: p, related };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Article | Luxonair Travel Journal" }] };
    return {
      meta: [
        { title: `${p.title} | Luxonair` },
        { name: "description", content: p.excerpt },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:image", content: p.heroImage },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://www.luxonair.co.uk/blog/${params.slug}` },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: p.excerpt },
        { name: "twitter:image", content: p.heroImage },
      ],
      links: [{ rel: "canonical", href: `https://www.luxonair.co.uk/blog/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `https://www.luxonair.co.uk/blog/${params.slug}`,
          "headline": p.title,
          "description": p.excerpt,
          "image": p.heroImage,
          "author": {
            "@type": "Organization",
            "name": p.author,
            "@id": "https://www.luxonair.co.uk/#organization"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Luxonair",
            "@id": "https://www.luxonair.co.uk/#organization",
            "logo": { "@type": "ImageObject", "url": "https://www.luxonair.co.uk/Logo/main-logo.png" }
          },
          "datePublished": p.date,
          "dateModified": p.date,
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.luxonair.co.uk/blog/${params.slug}` },
          "inLanguage": "en-GB",
          "keywords": p.category,
        }),
      }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="container-page py-20">
      <h1 className="font-display text-3xl">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-flex text-primary">Back to blog</Link>
    </div>
  ),
});

function PostPage() {
  const { post: p, related } = Route.useLoaderData();
  return (
    <>
      <article className="container-page py-12 md:py-20">
        <Link to="/blog" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← All articles
        </Link>
        <header className="mx-auto mt-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {p.category} · {p.readMinutes} min read
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-balance">{p.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{p.excerpt}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {p.author}
            {p.date ? ` · ${new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}
          </p>
        </header>
        <img src={p.heroImage} alt={p.title} className="mt-10 aspect-video w-full rounded-2xl object-cover" />
        <div
          className="prose prose-lg mx-auto mt-10 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: renderContentHtml(p.content) }}
        />

        {/* Post-article CTA */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-navy px-8 py-10 text-navy-fg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Ready to travel?</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Get a quote in four short steps.</h2>
              <p className="mt-1 text-sm text-navy-fg/60">
                A consultant replies within 4 working hours — no call centre, no auto-routing.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">
                Start a quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="container-page pb-16 md:pb-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">More from the journal</h2>
            <Link to="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              All articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/blog/$slug"
                params={{ slug: r.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={r.heroImage}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {r.category} · {r.readMinutes} min
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{r.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
