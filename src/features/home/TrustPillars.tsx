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

        {/* Cards */}
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {items.map(({ icon: Icon, title, note }) => (
            <motion.div
              key={title}
              variants={item}
              className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 transition-colors group-hover:bg-teal/20">
                <Icon className="h-5 w-5 text-teal" />
              </div>
              <h3 className="font-display text-base font-bold text-gold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
