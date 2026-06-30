import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Phone, ShieldCheck, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyLuxonair() {
  const features = [
    { icon: Users,      title: "Families & Couples",  body: "Family rooms, direct routes, kids clubs and everything else that makes a holiday actually work for you." },
    { icon: Phone,      title: "24/7 Support",         body: "Not a call centre. A real person who picks up before, during and after your trip." },
    { icon: ShieldCheck,title: "Fully Protected",      body: "ATOL and IATA accredited, so your money and your trip are both covered." },
  ];

  return (
    <section className="bg-navy text-navy-fg">
      <div className="container-page py-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Why Luxeonair</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-navy-fg sm:text-4xl text-balance">
              Travel the way it should be.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-fg/75 font-normal">
              At Luxeonair, booking travel should feel simple, personal and genuinely exciting.
              Whether you're heading away on business, planning the family holiday, or treating yourself
              to a premium cabin, we're here to make the whole process as enjoyable as the trip itself.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-fg/75 font-normal">
              We take the time to understand your plans and come back with options that actually fit,
              matched to your budget, schedule and preferences, with honest advice along the way.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-fg/60 font-normal italic">
              You're not just booking a trip. You're choosing someone who'll care about it as much as you do, from the first message to the moment you're home.
            </p>
            <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/about">Learn about us</Link>
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {features.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={cardItem}
                className={`rounded-2xl border border-navy-fg/10 bg-navy-fg/5 p-4 sm:p-5 transition-colors hover:border-navy-fg/25 hover:bg-navy-fg/10${i === features.length - 1 && features.length % 2 !== 0 ? " col-span-2" : ""}`}
              >
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 text-sm font-semibold text-navy-fg">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-fg/55">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
