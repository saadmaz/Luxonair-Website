import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findPost } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const p = findPost(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Article | Luxeonair Travel Journal" }] };
    return {
      meta: [
        { title: `${loaderData.title} | Luxeonair` },
        { name: "description", content: loaderData.excerpt },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:image", content: loaderData.heroImage },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://www.luxeonair.com/blog/${params.slug}` },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.excerpt },
        { name: "twitter:image", content: loaderData.heroImage },
      ],
      links: [{ rel: "canonical", href: `https://www.luxeonair.com/blog/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `https://www.luxeonair.com/blog/${params.slug}`,
          "headline": loaderData.title,
          "description": loaderData.excerpt,
          "image": loaderData.heroImage,
          "author": {
            "@type": "Organization",
            "name": loaderData.author,
            "@id": "https://www.luxeonair.com/#organization"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Luxeonair",
            "@id": "https://www.luxeonair.com/#organization",
            "logo": { "@type": "ImageObject", "url": "https://www.luxeonair.com/Logo/Main%20Logo.png" }
          },
          "datePublished": loaderData.date,
          "dateModified": loaderData.date,
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.luxeonair.com/blog/${params.slug}` },
          "inLanguage": "en-GB",
          "keywords": loaderData.category,
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
  const p = Route.useLoaderData();
  return (
    <article className="container-page py-12 md:py-20">
      <Link to="/blog" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">← All articles</Link>
      <header className="mx-auto mt-6 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.category} · {p.readMinutes} min read</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-balance">{p.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{p.excerpt}</p>
        <p className="mt-4 text-xs text-muted-foreground">{p.author} · {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      </header>
      <img src={p.heroImage} alt={p.title} className="mt-10 aspect-video w-full rounded-2xl object-cover" />
      <div className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-foreground">
        {p.content.map((b: { heading?: string; body: string }, i: number) => (
          <div key={i}>
            {b.heading && <h2 className="mt-8 font-display text-2xl font-semibold">{b.heading}</h2>}
            <p className="mt-3 text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
