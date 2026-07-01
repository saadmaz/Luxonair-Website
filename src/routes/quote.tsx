import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/shared/QuoteForm";
import { Clock, Phone, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SITE } from "@/config/site";
import { getHolidayTypes } from "@/server/queries";

export const Route = createFileRoute("/quote")({
  loader: async () => {
    try {
      const holidayTypes = await getHolidayTypes();
      return { holidayTypeNames: holidayTypes.map((h) => h.name) };
    } catch {
      return { holidayTypeNames: [] };
    }
  },
  validateSearch: (search: Record<string, unknown>): {
    destination?: string;
    when?: string;
    depart?: string;
    tripType?: string;
    travellers?: string;
    cabin?: string;
  } => ({
    destination: (search.destination as string) || undefined,
    when: (search.when as string) || undefined,
    depart: (search.depart as string) || undefined,
    tripType: (search.tripType as string) || undefined,
    travellers: (search.travellers as string) || undefined,
    cabin: (search.cabin as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Get a Free Holiday Quote | 4 Steps | Luxeonair" },
      { name: "description", content: "Four quick steps. A dedicated UK travel consultant reviews your brief and replies within 4 working hours. Mon–Fri 09:00–18:00, Sat–Sun 09:00–16:00 GMT. ATOL protected. No obligation, no spam." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Get a Free Holiday Quote | Luxeonair" },
      { property: "og:description", content: "Four quick steps. A UK consultant replies within 4 working hours. ATOL protected. No obligation, no spam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/quote" },
      { name: "twitter:title", content: "Get a Free Holiday Quote | Luxeonair" },
      { name: "twitter:description", content: "Four quick steps. A UK consultant replies within 4 hours. ATOL protected. No obligation." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/quote" }],
  }),
  component: QuotePage,
});

function parseTravellers(str: string): { adults?: string; children?: string } {
  if (!str) return {};
  const adults = str.match(/(\d+)\s*adult/i)?.[1];
  const children = str.match(/(\d+)\s*child/i)?.[1];
  return {
    ...(adults ? { adults } : {}),
    ...(children ? { children } : {}),
  };
}

function QuotePage() {
  const search = Route.useSearch();
  const { holidayTypeNames } = Route.useLoaderData();

  // Map hero search widget params → QuoteForm initial state
  const initialValues = {
    destination: search.destination ?? "",
    departWindow: search.when ?? search.depart ?? "",
    tripType: search.tripType ?? "",
    ...parseTravellers(search.travellers ?? ""),
  };

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_1.4fr] md:py-16 lg:py-20 lg:gap-12">
      <aside className="order-last lg:order-first">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get a quote</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl">
          Four short steps. One human reply.
        </h1>
        <p className="mt-4 text-muted-foreground">
          We don't auto-route, auto-quote, or pass you to a call centre. Your enquiry lands with a consultant who builds the trip and stays with you through it.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <Row icon={Clock} title="Rapid response" body="Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT. Outside hours, first thing next morning." />
          <Row icon={ShieldCheck} title="ATOL-protected" body="Where flights are included. Membership numbers shown on About page." />
          <Row icon={Phone} title="Or call us" body={`${SITE.phone.display} - direct to a consultant, never a queue.`} href={`tel:${SITE.phone.tel}`} />
          <Row icon={WhatsAppIcon} title="WhatsApp" body="Send the same details on WhatsApp if you prefer." href={`https://wa.me/${SITE.phone.whatsapp}`} />
        </ul>
      </aside>
      <QuoteForm initialValues={initialValues} holidayTypeNames={holidayTypeNames} />
    </div>
  );
}

function Row({ icon: Icon, title, body, href }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; href?: string }) {
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
