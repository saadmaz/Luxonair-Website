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

        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/destinations", changefreq: "weekly", priority: "0.9" },
          { path: "/holiday", changefreq: "monthly", priority: "0.8" },
          { path: "/deals", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/reviews", changefreq: "monthly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.5" },
          { path: "/quote", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          ...dests.map((d) => ({ path: `/destinations/${d.slug}`, changefreq: "monthly", priority: "0.7" })),
          ...types.map((h) => ({ path: `/holiday/${h.slug}`, changefreq: "monthly", priority: "0.7" })),
          ...posts.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" })),
        ];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
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
