import { Clock, Plane, ShieldCheck, Users } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    label: "ATOL-protected",
    note: "Every booking financially protected",
  },
  {
    icon: Plane,
    label: "Premium Airline Partners",
    note: "Access to world-class carriers",
  },
  {
    icon: Clock,
    label: "Rapid response",
    note: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT",
  },
  {
    icon: Users,
    label: "Dedicated Travel Experts",
    note: "Your own expert, start to finish",
  },
];

export function TrustPillars() {
  return (
    <section className="bg-secondary/30 border-b border-border">
      <div className="container-page grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }, i) => (
          <div
            key={label}
            className={[
              "flex items-center gap-4 px-6 py-8",
              i > 0 ? "sm:border-l sm:border-border" : "",
            ].join(" ")}
          >
            {/* Gold ring icon */}
            <span className="relative shrink-0">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-gold/8 text-gold">
                <Icon className="h-5 w-5" />
              </span>
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">
                {label}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
