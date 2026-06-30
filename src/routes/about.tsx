import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, Building2, Globe2, Users } from "lucide-react";
import { SITE } from "@/config/site";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | London's Premium Travel Consultants | Luxeonair" },
      { name: "description", content: "500+ trips. 78% repeat clients. 8 years based in London. Ex-airline consultants — ATOL & IATA accredited. One named consultant manages your trip from first quote to return gate." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "About Luxeonair | London's Premium Travel Consultants" },
      { property: "og:description", content: "500+ bespoke trips. 78% repeat clients. Ex-airline team, ATOL protected, based in London. One consultant. End-to-end." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/about" },
      { name: "twitter:title", content: "About Luxeonair | London's Premium Travel Consultants" },
      { name: "twitter:description", content: "500+ trips. 78% repeat clients. Ex-airline consultants, ATOL protected, based in London." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/about" }],
  }),
  component: AboutPage,
});

const statVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function AboutPage() {
  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-10 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            About Luxeonair
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-navy-fg sm:text-5xl md:text-6xl text-balance">
            Travel designed around you.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-fg/60 leading-relaxed">
            We're not a platform. We're a team of travel specialists who take the time to
            actually listen, then build your trip around what you need, not what's easiest to
            sell. One person handles your booking from the first message to the day you land back.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <motion.div
          className="container-page grid grid-cols-2 gap-3 py-8 sm:gap-5 sm:py-10 lg:grid-cols-4"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {[
            { icon: Globe2,    value: SITE.stats.trips,       label: "Trips delivered" },
            { icon: Users,     value: SITE.stats.repeatRate,  label: "Repeat traveller rate" },
            { icon: Award,     value: SITE.stats.years,       label: "Years operating" },
            { icon: Briefcase, value: SITE.stats.corporate,   label: "Corporate accounts" },
          ].map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={statVariants}
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-4 sm:p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/8 text-gold sm:h-11 sm:w-11">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="font-display text-2xl font-semibold sm:text-3xl">{value}</div>
              <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* What we are / aren't */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <motion.div
            className="rounded-2xl bg-card border border-border p-8"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl font-semibold">What we are</h2>
            <ul className="mt-5 space-y-3">
              <Bullet>UK-registered, independent travel agency.</Bullet>
              <Bullet>Specialists in premium long-haul, family travel and UK corporate accounts.</Bullet>
              <Bullet>Single-consultant ownership: the same person quotes, books, supports.</Bullet>
              <Bullet>Indicative pricing online, confirmed live by a human.</Bullet>
            </ul>
          </motion.div>
          <motion.div
            className="rounded-2xl bg-secondary/50 border border-border p-8"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="font-display text-2xl font-semibold">What we are not</h2>
            <ul className="mt-5 space-y-3">
              <Bullet>Not a discount aggregator - we don't compete on shouty deal pages.</Bullet>
              <Bullet>Not a call-centre - calls go to a named consultant, not a queue.</Bullet>
              <Bullet>Not a live online booking platform - pricing is confirmed within hours.</Bullet>
              <Bullet>Not selling fake reviews or fabricated accreditation.</Bullet>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Accreditation
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-fg">
            Accredited. Trusted. Protected.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Our recognised industry credentials reflect our commitment to providing secure, reliable, and exceptional travel experiences.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="https://www.caa.co.uk/atol-protection/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 rounded-2xl border border-navy-fg/15 bg-navy-fg/5 p-6 transition-colors hover:border-gold/40"
            >
              <div className="shrink-0 rounded-xl bg-white px-3 py-2">
                <img src="/Logo/atol-logo.png" alt="ATOL Protected" className="h-10 w-auto" />
              </div>
              <div>
                <div className="font-semibold text-navy-fg">ATOL Protected</div>
                <div className="text-xs text-navy-fg/50">
                  {SITE.accreditation.atol ? `№ ${SITE.accreditation.atol}` : "Flight & package protection"}
                </div>
              </div>
            </a>
            <a
              href="https://www.iata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 rounded-2xl border border-navy-fg/15 bg-navy-fg/5 p-6 transition-colors hover:border-gold/40"
            >
              <div className="shrink-0 rounded-xl bg-white px-3 py-2">
                <img src="/Logo/iata-logo.png" alt="IATA" className="h-10 w-auto" />
              </div>
              <div>
                <div className="font-semibold text-navy-fg">IATA Accredited</div>
                <div className="text-xs text-navy-fg/50">
                  {SITE.accreditation.iata ? `№ ${SITE.accreditation.iata}` : "International airline ticketing"}
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <Building2 className="h-9 w-9 text-gold" />
            <h3 className="mt-5 font-display text-2xl font-semibold">The Luxeonair team</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We're a small team, and that's the point. Every booking is handled by someone who
              actually knows your trip — your preferences, your budget, your must-haves — and is
              reachable when it matters.
            </p>
            <Button asChild className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Talk to a consultant</Link>
            </Button>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Whether you need a last-minute business flight, a family holiday that actually works
              for everyone, or a long-haul trip in Business Class, we'll sort it properly. Not with
              a script, but with a proper conversation.
            </p>
            <p>
              We give you honest advice, we get back to you quickly, and we don't disappear once
              the booking's made. From the first enquiry to the moment you're home, there's always
              someone you can reach.
            </p>
            <p>
              Most of our clients come back. We think that says more than any award or badge could.
              Repeat clients, genuine relationships, and travel that feels easy from start to finish.
            </p>
            <p>
              Economy, Premium Economy, Business or First Class, whatever you're after, we'll find
              you the right option at the right price and be there if anything changes along the way.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span>{children}</span>
    </li>
  );
}
