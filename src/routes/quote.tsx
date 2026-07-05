import type React from "react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PackageQuoteForm } from "@/components/shared/quote/PackageQuoteForm";
import { FlightQuoteForm } from "@/components/shared/quote/FlightQuoteForm";
import { Clock, Package, Phone, Plane, ShieldCheck } from "lucide-react";
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
    type?: "package" | "flight";
    destination?: string;
    from?: string;
    depart?: string;
    return?: string;
    tripType?: string;
    travellers?: string;
    cabin?: string;
  } => ({
    type: search.type === "flight" ? "flight" : undefined,
    destination: (search.destination as string) || undefined,
    from: (search.from as string) || undefined,
    depart: (search.depart as string) || undefined,
    return: (search.return as string) || undefined,
    tripType: (search.tripType as string) || undefined,
    travellers: (search.travellers as string) || undefined,
    cabin: (search.cabin as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Get a Free Holiday or Flight Quote | 3 Steps | Luxeonair" },
      { name: "description", content: "Three quick steps. A dedicated UK travel consultant reviews your brief and replies with a rapid response. Mon–Fri 09:00–18:00, Sat–Sun 09:00–16:00 GMT. ATOL protected. No obligation, no spam." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Get a Free Holiday or Flight Quote | Luxeonair" },
      { property: "og:description", content: "Three quick steps. A UK consultant replies with a rapid response. ATOL protected. No obligation, no spam." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/quote" },
      { name: "twitter:title", content: "Get a Free Holiday or Flight Quote | Luxeonair" },
      { name: "twitter:description", content: "Three quick steps. A UK consultant replies with a rapid response. ATOL protected. No obligation." },
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

// Hero search widget's cabin dropdown uses short labels ("Business"); the quote
// wizards use the fuller labels shown in their cabin-class pills ("Business Class").
const CABIN_LABELS: Record<string, string> = {
  economy: "Economy",
  "premium economy": "Premium Economy",
  business: "Business Class",
  first: "First Class",
};

function parseCabin(str: string | undefined): { cabinClass?: string } {
  if (!str) return {};
  const label = CABIN_LABELS[str.trim().toLowerCase()];
  return label ? { cabinClass: label } : {};
}

// The hero search widget's date pickers hand over real yyyy-MM-dd dates, so a
// depart date means the customer already committed to specific dates — carry
// that straight into the wizard's "specific dates" mode instead of dumping it
// into the free-text "flexible window" field, which would ask them again.
function parseDates(depart?: string, ret?: string): { dateMode?: "flexible" | "specific"; departDate?: string; returnDate?: string } {
  if (!depart) return {};
  return { dateMode: "specific", departDate: depart, ...(ret ? { returnDate: ret } : {}) };
}

function QuotePage() {
  const search = Route.useSearch();
  const { holidayTypeNames } = Route.useLoaderData();
  const [type, setType] = useState<"package" | "flight">(search.type === "flight" ? "flight" : "package");

  const packageInitialValues = {
    destination: search.destination ?? "",
    tripType: search.tripType ?? "",
    ...parseDates(search.depart, search.return),
    ...parseTravellers(search.travellers ?? ""),
    ...parseCabin(search.cabin),
  };

  const flightInitialValues = {
    departAirport: search.from ?? "",
    destination: search.destination ?? "",
    ...parseDates(search.depart, search.return),
    ...parseTravellers(search.travellers ?? ""),
    ...parseCabin(search.cabin),
  };

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_1.4fr] md:py-16 lg:py-20 lg:gap-12">
      <aside className="order-last lg:order-first">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get a quote</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl">
          Three short steps. One human reply.
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

      <div>
        {/* Package / Flight switcher — same page, no navigation */}
        <div role="tablist" aria-label="Quote type" className="mb-4 inline-flex gap-1 rounded-xl bg-muted/70 p-1">
          <QuoteTab active={type === "package"} onClick={() => setType("package")} icon={Package}>
            Holiday Package
          </QuoteTab>
          <QuoteTab active={type === "flight"} onClick={() => setType("flight")} icon={Plane}>
            Flights Only
          </QuoteTab>
        </div>

        {type === "flight" ? (
          <FlightQuoteForm key="flight" initialValues={flightInitialValues} />
        ) : (
          <PackageQuoteForm key="package" initialValues={packageInitialValues} holidayTypeNames={holidayTypeNames} />
        )}
      </div>
    </div>
  );
}

function QuoteTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
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
