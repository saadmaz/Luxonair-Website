import { Clock, Plane, ShieldCheck, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const items = [
  { icon: ShieldCheck, label: "ATOL-protected",          note: "Every booking financially protected" },
  { icon: Plane,       label: "Premium Airline Partners", note: "Access to world-class carriers" },
  { icon: Clock,       label: "Rapid response",           note: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT" },
  { icon: Users,       label: "Dedicated Travel Experts", note: "Your own expert, start to finish" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TrustPillars() {
  return (
    <section className="border-b border-border bg-card">
      <motion.div
        className="container-page grid grid-cols-2 divide-x divide-border lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {items.map(({ icon: Icon, label, note }, i) => (
          <motion.div
            key={label}
            variants={item}
            className={`flex items-center gap-3 px-5 py-6${i < 2 ? " border-b border-border lg:border-b-0" : ""}`}
          >
            <motion.span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="h-4 w-4 text-gold" />
            </motion.span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{note}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
