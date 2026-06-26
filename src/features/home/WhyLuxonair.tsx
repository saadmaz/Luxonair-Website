import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Phone, ShieldCheck, Users } from "lucide-react";

export function WhyLuxonair() {
  const features = [
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
      body: "ATOL and IATA memberships — all legitimately held.",
    },
  ];

  return (
    <section className="bg-navy text-navy-fg">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Why Luxe on Air
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-navy-fg sm:text-4xl text-balance">
              Why Book with Luxe on Air?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-fg/75 font-normal">
              At Luxe on Air, we believe booking travel should be simple, personal, and stress-free.
              Whether you're travelling for business, planning a family holiday, or treating yourself
              to a premium cabin experience, we're here to make every journey as smooth as possible.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-fg/75 font-normal">
              We take the time to understand your travel plans and recommend options that match your
              budget, schedule, and preferences — tailored recommendations backed by genuine customer care.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-fg/60 font-normal italic">
              You're not just booking a trip — you're choosing a travel partner dedicated to making
              every journey exceptional.
            </p>
            <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/about">Learn about us</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className={`rounded-2xl border border-navy-fg/10 bg-navy-fg/5 p-5${i === features.length - 1 && features.length % 2 !== 0 ? " sm:col-span-2" : ""}`}>
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
