import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, Building2, Globe2, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Luxonair" },
      { name: "description", content: "Luxonair is a UK-based travel agency for premium long-haul, family escapes and corporate travel. Independent, account-managed, ATOL-protected." },
      { property: "og:title", content: "About — Luxonair" },
      { property: "og:description", content: "UK travel specialists. Independent, account-managed, ATOL-protected." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="container-page pt-12 pb-10 md:pt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About Luxonair</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold sm:text-6xl text-balance">
          A UK travel agency with a self-serve quote tool and a single human owner per trip.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Most UK agencies are either pure call-centres or pure online aggregators. We sit between: a structured quote tool that captures the brief in minutes, then one consultant who builds, books, and stays with you for the whole trip.
        </p>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe2, k: "Trips delivered", v: "[PLACEHOLDER]" },
            { icon: Users, k: "Repeat traveller rate", v: "[PLACEHOLDER]" },
            { icon: Award, k: "Years operating", v: "[PLACEHOLDER]" },
            { icon: Briefcase, k: "Corporate accounts", v: "[PLACEHOLDER]" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-gold"><Icon className="h-5 w-5" /></span>
              <div className="mt-4 font-display text-3xl font-semibold">{v}</div>
              <div className="text-sm text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">What we are</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <Bullet>UK-registered, independent travel agency.</Bullet>
              <Bullet>Specialists in premium long-haul, family travel and UK corporate accounts.</Bullet>
              <Bullet>Single-consultant ownership: the same person quotes, books, supports.</Bullet>
              <Bullet>Indicative pricing online, confirmed live by a human.</Bullet>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold">What we are not</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <Bullet>Not a discount aggregator — we don't compete on shouty deal pages.</Bullet>
              <Bullet>Not a call-centre — calls go to a named consultant, not a queue.</Bullet>
              <Bullet>Not a live online booking platform — pricing is confirmed by a human within hours.</Bullet>
              <Bullet>Not selling fake reviews or fabricated accreditation.</Bullet>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="container-page py-16">
          <h2 className="font-display text-3xl font-semibold">Accreditation</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            We will display verified ABTA, ATOL and IATA membership numbers below once the client supplies them. We <strong>will not</strong> display fabricated badges.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["ABTA", "ATOL", "IATA"].map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-5">
                <ShieldCheck className="h-6 w-6 text-gold" />
                <div>
                  <div className="font-semibold">{b}</div>
                  <div className="text-xs text-muted-foreground">Membership № [PLACEHOLDER]</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <Building2 className="h-8 w-8 text-gold" />
            <h3 className="mt-4 font-display text-2xl font-semibold">The Luxonair team</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Specialists across long-haul, MICE and family travel. Real bios and photos go here once the client signs them off — we won't auto-generate fake team profiles.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <p>Founded by ex-airline and corporate-travel staff, Luxonair operates from [PLACEHOLDER, UK]. Our consultants average [PLACEHOLDER] years in the industry across British Airways, Virgin Atlantic, BCD Travel and independent agencies.</p>
            <p>Every trip is account-managed by one named consultant. There's no off-shore call centre, no automated rebooking — when something goes wrong on a Friday night, the same person who built your trip handles it.</p>
            <Button asChild className="mt-2"><Link to="/quote">Talk to a consultant</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}
