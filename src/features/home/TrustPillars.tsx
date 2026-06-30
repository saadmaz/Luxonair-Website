import { Clock, Plane, ShieldCheck, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const items = [
  { icon: ShieldCheck, label: "ATOL-protected",           note: "Every booking financially protected" },
  { icon: Plane,       label: "Premium Airline Partners", note: "Access to world-class carriers" },
  { icon: Clock,       label: "Rapid response",           note: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT" },
  { icon: Users,       label: "Dedicated Travel Experts", note: "Your own expert, start to finish" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TrustPillars() {
  return (
    <section className="border-b border-border/60 bg-background">
      <motion.div
        className="container-page grid grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {items.map(({ icon: Icon, label, note }, i) => (
          <motion.div
            key={label}
            variants={item}
            className={[
              "flex flex-col gap-3 px-6 py-8",
              i < 2 ? "border-b border-border/60 lg:border-b-0" : "",
              i % 2 === 0 ? "border-r border-border/60 lg:border-r-0" : "",
              "lg:[&:not(:last-child)]:border-r lg:border-border/60",
            ].join(" ")}
          >
            <Icon className="h-[18px] w-[18px] text-gold" />
            <div>
              <p className="text-[13px] font-semibold leading-snug text-foreground">{label}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/80">{note}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
