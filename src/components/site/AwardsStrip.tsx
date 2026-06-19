import { Award, ShieldCheck, Plane, Star } from "lucide-react";
import { SITE } from "@/lib/siteConfig";

export function AwardsStrip() {
  const items = [
    { icon: ShieldCheck, label: "ATOL Protected", note: SITE.accreditation.atol ? `Membership № ${SITE.accreditation.atol}` : "Membership № pending" },
    { icon: Award, label: "ABTA Member", note: SITE.accreditation.abta ? `Membership № ${SITE.accreditation.abta}` : "Membership № pending" },
    { icon: Plane, label: "IATA Accredited", note: SITE.accreditation.iata ? `Membership № ${SITE.accreditation.iata}` : "Membership № pending" },
    { icon: Star, label: "British Travel Awards", note: "Nominated 2026" },
  ];
  return (
    <section className="border-b border-border bg-background">
      <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, note }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-gold">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{label}</div>
              <div className="truncate text-xs text-muted-foreground">{note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
