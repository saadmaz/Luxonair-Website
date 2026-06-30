import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function FeaturedDestinations() {
  return (
    <section className="container-page py-10 md:py-20">
      <SectionHeader
        eyebrow="Popular destinations"
        title="Itineraries our consultants build most often"
        cta={{ label: "All destinations", to: "/destinations" }}
      />
      <motion.div
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {destinations.slice(0, 4).map((d) => (
          <motion.div key={d.slug} variants={item}>
            <DestinationCard d={d} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
