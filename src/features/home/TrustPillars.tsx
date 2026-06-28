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
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-5 py-8 sm:gap-6 lg:grid-cols-4 lg:py-10">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="flex items-start gap-2.5 sm:gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/8 text-gold sm:h-11 sm:w-11">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div>
              <div className="text-xs font-semibold leading-tight sm:text-sm">{label}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
