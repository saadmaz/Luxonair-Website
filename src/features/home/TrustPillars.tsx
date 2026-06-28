import { Clock, Plane, ShieldCheck, Users } from "lucide-react";

// Four-column icon + label grid that surfaces the core trust signals
// (ATOL, airline partners, response time, single-consultant model).
export function TrustPillars() {
  const items = [
    { icon: ShieldCheck, label: "ATOL-protected",       note: "Every booking financially protected" },
    { icon: Plane,       label: "Premium Airline Partners", note: "Access to world-class carriers" },
    { icon: Clock,       label: "Rapid response",           note: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT" },
    { icon: Users,       label: "Dedicated Travel Experts", note: "Your own expert, start to finish" },
  ];

  return (
    <section className="border-b border-border">
      <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs text-muted-foreground">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
