import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, Building2, CheckCircle2, Globe2, ShieldCheck, Users } from "lucide-react";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Luxonair" },
      {
        name: "description",
        content:
          "Luxonair is a UK-based travel agency for premium long-haul, family escapes and corporate travel. Independent, account-managed, ATOL-protected.",
      },
      { property: "og:title", content: "About - Luxonair" },
      {
        property: "og:description",
        content: "UK travel specialists. Independent, account-managed, ATOL-protected.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            About Luxonair
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-navy-fg sm:text-5xl md:text-6xl text-balance">
            A UK travel agency built for people who value their time.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-fg/60 leading-relaxed">
            Most UK agencies are either pure call-centres or pure online aggregators. We sit
            between: a structured quote tool that captures your brief in minutes, then one
            consultant who builds, books, and stays with you for the whole trip.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container-page grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe2, value: SITE.stats.trips, label: "Trips delivered" },
            { icon: Users, value: SITE.stats.repeatRate, label: "Repeat traveller rate" },
            { icon: Award, value: SITE.stats.years, label: "Years operating" },
            { icon: Briefcase, value: SITE.stats.corporate, label: "Corporate accounts" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div className="font-display text-3xl font-semibold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we are / aren't */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl bg-card border border-border p-8">
            <h2 className="font-display text-2xl font-semibold">What we are</h2>
            <ul className="mt-5 space-y-3">
              <Bullet>UK-registered, independent travel agency.</Bullet>
              <Bullet>Specialists in premium long-haul, family travel and UK corporate accounts.</Bullet>
              <Bullet>Single-consultant ownership: the same person quotes, books, supports.</Bullet>
              <Bullet>Indicative pricing online, confirmed live by a human.</Bullet>
            </ul>
          </div>
          <div className="rounded-2xl bg-secondary/50 border border-border p-8">
            <h2 className="font-display text-2xl font-semibold">What we are not</h2>
            <ul className="mt-5 space-y-3">
              <Bullet>Not a discount aggregator - we don't compete on shouty deal pages.</Bullet>
              <Bullet>Not a call-centre - calls go to a named consultant, not a queue.</Bullet>
              <Bullet>Not a live online booking platform - pricing is confirmed within hours.</Bullet>
              <Bullet>Not selling fake reviews or fabricated accreditation.</Bullet>
            </ul>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Accreditation
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-fg">
            Legitimately protected. Verifiably accredited.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { key: "ABTA", number: SITE.accreditation.abta, desc: "Travel agent bonding" },
              { key: "ATOL", number: SITE.accreditation.atol, desc: "Flight & package protection" },
              { key: "IATA", number: SITE.accreditation.iata, desc: "International airline ticketing" },
            ].map(({ key, number, desc }) => (
              <div
                key={key}
                className="flex items-center gap-4 rounded-2xl border border-navy-fg/15 bg-navy-fg/5 p-6"
              >
                <ShieldCheck className="h-8 w-8 shrink-0 text-gold" />
                <div>
                  <div className="font-semibold text-navy-fg">{key}</div>
                  <div className="text-xs text-navy-fg/50">
                    {number ? `№ ${number}` : desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <Building2 className="h-9 w-9 text-gold" />
            <h3 className="mt-5 font-display text-2xl font-semibold">The Luxonair team</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Specialists across long-haul, MICE and family travel. Our team comes from British Airways, Virgin Atlantic, BCD Travel and leading independent agencies.
            </p>
            <Button asChild className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Talk to a consultant</Link>
            </Button>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Founded by ex-airline and corporate-travel staff, Luxonair operates from{" "}
              {SITE.team.location}, UK. Our consultants average {SITE.team.avgYears} years in the
              industry across British Airways, Virgin Atlantic, BCD Travel and independent agencies.
            </p>
            <p>
              Every trip is account-managed by one named consultant. There's no off-shore call
              centre, no automated rebooking - when something goes wrong on a Friday night, the
              same person who built your trip handles it.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Named consultant from day one",
                "Real bios - no AI-generated profiles",
                "Direct mobile contact en route",
                "Post-trip debrief & next itinerary",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}
