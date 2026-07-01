import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Clock, Phone, ShieldCheck, Users, Star, CheckCircle2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const features = [
  {
    icon: Users,
    title: "Family & Couple Experts",
    body: "Family suites, kids clubs, couple retreats — built around what actually matters on your trip.",
    accent: "bg-gold/15 text-gold",
  },
  {
    icon: Phone,
    title: "Real 24/7 Support",
    body: "Not a chatbot. A real consultant available before, during, and after every trip.",
    accent: "bg-teal/15 text-teal",
  },
  {
    icon: ShieldCheck,
    title: "Fully ATOL Protected",
    body: "ATOL and IATA accredited — your money and your trip are always covered.",
    accent: "bg-gold/15 text-gold",
  },
  {
    icon: Clock,
    title: "Rapid Response",
    body: "Same-day quotes. Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT.",
    accent: "bg-teal/15 text-teal",
  },
];

const bullets = [
  "One consultant, start to finish — no handoffs, no call centres",
  "Bespoke itineraries matched to your budget and schedule",
  "Honest advice and zero hidden booking fees, ever",
];

export function WhyLuxonair() {
  return (
    <section className="bg-navy text-navy-fg">
      <div className="container-page py-14 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Left — text column */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              Why Luxeonair
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-fg sm:text-4xl lg:text-[2.5rem] text-balance">
              More Than Travel —{" "}
              <span className="text-gold">An Experience</span>{" "}
              Crafted For You.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-navy-fg/70">
              We take the time to understand your trip — your budget, your pace, what excites you
              and what you'd rather avoid. Then we come back with options that actually fit. Simple
              as that.
            </p>

            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-navy-fg/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="bg-gold text-gold-foreground shadow-lg shadow-gold/25 hover:bg-gold/90"
              >
                <Link to="/contact">Get in touch</Link>
              </Button>
              <Link
                to="/quote"
                className="flex items-center gap-1 text-sm text-navy-fg/60 transition-colors hover:text-navy-fg"
              >
                Start a quote →
              </Link>
            </div>

            {/* Star rating strip */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-navy-fg/10 bg-navy-fg/5 px-4 py-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-navy-fg/70">
                <span className="font-bold text-navy-fg">4.9 / 5</span> from 500+ happy travellers
              </p>
            </div>
          </motion.div>

          {/* Right — feature cards */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {features.map(({ icon: Icon, title, body, accent }) => (
              <motion.div
                key={title}
                variants={cardItem}
                className="rounded-2xl border border-navy-fg/10 bg-navy-fg/5 p-5 transition-all duration-300 hover:border-navy-fg/20 hover:bg-navy-fg/10"
              >
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-navy-fg">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-navy-fg/55">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
