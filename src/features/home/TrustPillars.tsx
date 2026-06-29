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
    <section className="border-b border-border bg-background">
      <div className="container-page grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }) => (
          <div
            key={label}
            className="group relative flex items-start gap-4 px-6 py-8 transition-colors hover:bg-secondary/40"
          >
            {/* Gold left-border accent on hover */}
            <span className="absolute left-0 top-6 bottom-6 w-0.75 rounded-full bg-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Icon container — navy square, gold icon */}
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy shadow-sm">
              <Icon className="h-5 w-5 text-gold" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-foreground">
                {label}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
