import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/siteConfig";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a quote — Luxonair" },
      { name: "description", content: "Four short steps. A Luxonair consultant replies within 4 working hours, Mon–Fri 09:00–19:00 GMT. No spam." },
      { property: "og:title", content: "Get a quote — Luxonair" },
      { property: "og:description", content: "Structured 4-step quote. A consultant replies within 4 working hours." },
      { property: "og:url", content: "/quote" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: QuotePage,
});

function QuotePage() {
  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  // Map hero search widget params to QuoteForm fields
  const initialValues = {
    destination: params.get("destination") ?? "",
    // "when" from package form, "depart" (date) from flight form
    departWindow: params.get("when") ?? params.get("depart") ?? "",
    // "tripType" is set as a hidden input in the flight form
    tripType: params.get("tripType") ?? "",
  };

  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.4fr] md:py-20">
      <aside>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get a quote</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-balance sm:text-5xl">
          Four short steps. One human reply.
        </h1>
        <p className="mt-4 text-muted-foreground">
          We don't auto-route, auto-quote, or pass you to a call centre. Your enquiry lands with a consultant who builds the trip and stays with you through it.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <Row icon={Clock} title="Reply within 4 working hours" body="Mon–Fri 09:00–19:00 GMT. Outside hours, first thing next morning." />
          <Row icon={ShieldCheck} title="ATOL-protected" body="Where flights are included. Membership numbers shown on About page." />
          <Row icon={Phone} title="Or call us" body={`${SITE.phone.display} — direct to a consultant, never a queue.`} href={`tel:${SITE.phone.tel}`} />
          <Row icon={MessageCircle} title="WhatsApp" body="Send the same details on WhatsApp if you prefer." href={`https://wa.me/${SITE.phone.whatsapp}`} />
        </ul>
      </aside>
      <QuoteForm initialValues={initialValues} />
    </div>
  );
}

function Row({ icon: Icon, title, body, href }: { icon: typeof Clock; title: string; body: string; href?: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="font-medium">{title}</div>
        {href
          ? <a href={href} target={href.startsWith("https") ? "_blank" : undefined} rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:underline">{body}</a>
          : <div className="text-muted-foreground">{body}</div>
        }
      </div>
    </li>
  );
}
