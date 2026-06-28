import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { getFaqsNested } from "@/server/queries";

export const Route = createFileRoute("/faq")({
  loader: async () => getFaqsNested(),
  head: ({ loaderData }) => {
    const groups = loaderData ?? [];
    return {
      meta: [
        { title: "FAQs | ATOL Protection, Quotes & How We Work | Luxeonair" },
        { name: "description", content: "Everything you need to know before booking. How quotes work, ATOL protection, deposit requirements, payment methods and 24/7 in-trip support — answered plainly." },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "Frequently Asked Questions | Luxeonair Help Centre" },
        { property: "og:description", content: "Answers about ATOL protection, how quotes work, deposits, payments and in-trip support." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://www.luxeonair.co.uk/faq" },
        { name: "twitter:title", content: "FAQs | Luxeonair Help Centre" },
        { name: "twitter:description", content: "ATOL protection, how quotes work, deposits, payment methods and 24/7 support — all answered." },
      ],
      links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/faq" }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: groups.flatMap((g) => g.items).map((i) => ({
            "@type": "Question",
            name: i.question,
            acceptedAnswer: { "@type": "Answer", text: i.answer },
          })),
        }),
      }],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  const groups = Route.useLoaderData();

  return (
    <div className="container-page py-8 md:py-16">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help centre</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl text-balance">Frequently asked questions.</h1>
        <p className="mt-3 text-muted-foreground">Can't find your answer? Call <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a> or WhatsApp us.</p>
      </header>

      <div className="mt-12 space-y-12">
        {groups.map((g) => (
          <section key={g.id}>
            <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
            <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-card">
              {g.items.map((i) => (
                <details key={i.id} className="group p-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                    <span className="font-medium">{i.question}</span>
                    <span className="mt-1 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{i.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
