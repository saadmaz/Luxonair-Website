import { createFileRoute } from "@tanstack/react-router";
import { faqGroups } from "@/data/faq";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ - Luxe on Air Help Centre" },
      { name: "description", content: "Answers to common questions about quotes, ATOL protection, payments and 24/7 support." },
      { property: "og:title", content: "FAQ - Luxe on Air Help Centre" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqGroups.flatMap((g) => g.items).map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }),
    }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help centre</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">Frequently asked questions.</h1>
        <p className="mt-3 text-muted-foreground">Can't find your answer? Call <a href={`tel:${SITE.phone.tel}`} className="text-primary hover:underline">{SITE.phone.display}</a> or WhatsApp us.</p>
      </header>

      <div className="mt-12 space-y-12">
        {faqGroups.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
            <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-card">
              {g.items.map((i, idx) => (
                <details key={idx} className="group p-5">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                    <span className="font-medium">{i.q}</span>
                    <span className="mt-1 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{i.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
