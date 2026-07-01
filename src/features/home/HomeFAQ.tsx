import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

type FaqGroup = {
  id: number;
  title: string;
  items: { id: number; question: string; answer: string }[];
};

export function HomeFAQ({ faqGroups }: { faqGroups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<number | null>(null);

  // Flatten all FAQ items
  const allItems = faqGroups.flatMap((g) => g.items);

  if (allItems.length === 0) return null;

  const toggle = (key: number) =>
    setOpenKey((prev) => (prev === key ? null : key));

  return (
    <section className="py-12 md:py-20">
      <div className="container-page max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">FAQs</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything you need to know before you book.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {allItems.map(({ id, question, answer }) => (
            <div
              key={id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              >
                <span>{question}</span>
                <ChevronDown
                  className={[
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    openKey === id ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              <AnimatePresence initial={false}>
                {openKey === id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* See all link */}
        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="text-sm font-semibold text-gold transition-colors hover:text-gold/80"
          >
            See all FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}
