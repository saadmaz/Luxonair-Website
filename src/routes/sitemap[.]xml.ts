import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getDestinations, getHolidayTypes, getPublishedBlogPosts } from "@/server/queries";

const BASE_URL = "https://www.luxeonair.co.uk";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [dests, types, posts] = await Promise.all([
          getDestinations(),
          getHolidayTypes(),
          getPublishedBlogPosts(),
        ]);

        const today = new Date().toISOString().split("T")[0];
        const lastmod = (d: string | Date) => new Date(d).toISOString().split("T")[0];

        type Entry = { path: string; changefreq: string; priority: string; lastmod: string };
        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/destinations", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/holiday", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/deals", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: today },
          { path: "/reviews", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/faq", changefreq: "monthly", priority: "0.5", lastmod: today },
          { path: "/quote", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/contact", changefreq: "monthly", priority: "0.6", lastmod: today },
          ...dests.map((d) => ({ path: `/destinations/${d.slug}`, changefreq: "monthly", priority: "0.7", lastmod: lastmod(d.createdAt) })),
          ...types.map((h) => ({ path: `/holiday/${h.slug}`, changefreq: "monthly", priority: "0.7", lastmod: lastmod(h.createdAt) })),
          ...posts.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6", lastmod: lastmod(p.createdAt) })),
        ];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
