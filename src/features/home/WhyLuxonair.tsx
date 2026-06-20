import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Briefcase, Phone, ShieldCheck, Users } from "lucide-react";

// Dark-navy "Why Luxonair" section: prose left, four feature cards right.
export function WhyLuxonair() {
  const features = [
    {
      icon: Briefcase,
      title: "Corporate & Business",
      body: "Premium-cabin returns, DIFC hotels, single monthly invoice.",
    },
    {
      icon: Users,
      title: "Families & Couples",
      body: "Direct flights, family suites, kids clubs and honeymoon retreats.",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      body: "A named consultant reachable throughout your trip.",
    },
    {
      icon: ShieldCheck,
      title: "Fully Protected",
      body: "ATOL, ABTA and IATA memberships - all legitimately held.",
    },
  ];

  return (
    <section className="bg-navy text-navy-fg">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Why Luxonair
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-navy-fg sm:text-4xl text-balance">
              Single-invoice simplicity. Human expertise. Total protection.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-fg/75 font-normal">
              We're not a call-centre and we're not an aggregator. One consultant builds your
              brief, books every component, and stays reachable throughout - from quote to
              return gate.
            </p>
            <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/about">Learn about us</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-navy-fg/10 bg-navy-fg/5 p-5">
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 text-sm font-semibold text-navy-fg">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-fg/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
