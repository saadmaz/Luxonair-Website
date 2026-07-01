import { ShieldCheck, Tag, Headphones, Compass } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const items = [
  {
    icon: ShieldCheck,
    title: "ATOL Protected",
    note: "Full financial protection on all flight-inclusive holidays.",
  },
  {
    icon: Tag,
    title: "Best Price",
    note: "Found it cheaper? We'll match it — guaranteed.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    note: "Expert consultants available before, during, and after.",
  },
  {
    icon: Compass,
    title: "Bespoke Trips",
    note: "Every itinerary personalised to your exact preferences.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TrustPillars() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Dashed arc — top right */}
      <svg
        className="pointer-events-none absolute -right-20 -top-20 h-[520px] w-[520px] opacity-[0.11]"
        viewBox="0 0 520 520"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M520 0 A520 520 0 0 0 0 520"
          stroke="#D4A017"
          strokeWidth="2.5"
          strokeDasharray="14 10"
        />
        <path
          d="M400 0 A400 400 0 0 0 0 400"
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeDasharray="10 10"
        />
      </svg>
      {/* Dashed arc — bottom left */}
      <svg
        className="pointer-events-none absolute -bottom-20 -left-20 h-[340px] w-[340px] opacity-[0.09]"
        viewBox="0 0 340 340"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 340 A340 340 0 0 1 340 0"
          stroke="#D4A017"
          strokeWidth="2"
          strokeDasharray="12 10"
        />
      </svg>

      <div className="container-page relative">
        {/* Heading */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-7 bg-gold/50" />
            Why Luxonair
            <span className="h-px w-7 bg-gold/50" />
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] text-balance">
            Where Every Journey{" "}
            <span className="text-gold">Begins</span>{" "}
            <span className="text-teal">With You</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            We don't just book trips — we craft journeys tailored to your dreams. With ATOL &amp;
            IATA accreditation and a team that genuinely cares, your adventure is in the best hands.
          </p>
        </motion.div>

        {/* Premium pillar panel */}
        <motion.div
          className="relative mt-14 overflow-hidden rounded-4xl border border-navy/10 bg-linear-to-b from-card to-muted/30 shadow-[0_30px_80px_-30px_rgba(4,32,69,0.22)]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {items.map(({ icon: Icon, title, note }, i) => (
              <motion.div
                key={title}
                variants={item}
                className="group relative px-7 py-10 transition-colors duration-300 hover:bg-gold/3"
              >
                <span className="pointer-events-none absolute right-6 top-6 font-display text-4xl font-bold text-foreground/4 transition-colors duration-300 group-hover:text-gold/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-teal/15 to-aqua/10 ring-1 ring-teal/20 transition-all duration-300 group-hover:from-gold/15 group-hover:to-gold/5 group-hover:ring-gold/40">
                  <Icon className="h-6 w-6 text-teal transition-colors duration-300 group-hover:text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                <span className="mt-2 block h-0.5 w-8 rounded-full bg-gold/50 transition-all duration-300 group-hover:w-14 group-hover:bg-gold" />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
