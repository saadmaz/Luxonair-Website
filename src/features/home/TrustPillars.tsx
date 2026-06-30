import { Clock, Plane, ShieldCheck, Users } from "lucide-react";
import { useInView } from "@/hooks/useInView";

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
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section ref={ref} className="border-b border-border bg-card">
      <div className="container-page grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }, i) => (
          <div
            key={label}
            className={[
              "flex items-center gap-3 px-5 py-6 transition-all duration-500",
              i < 2 ? "border-b border-border lg:border-b-0" : "",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
            ].join(" ")}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy transition-transform duration-300 hover:scale-110">
              <Icon className="h-4 w-4 text-gold" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
