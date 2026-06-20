import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

// Full-width CTA banner at the bottom of the home page.
// WhatsApp href uses SITE.phone.whatsapp (digits-only wa.me format).
export function FinalCTA() {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-navy-fg shadow-2xl md:px-14">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-32 w-32 rounded-full bg-gold/8" />

        <div className="relative grid gap-8 md:grid-cols-[1.4fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Tell us where, when, and roughly how much. We'll do the rest.
            </h2>
            <p className="mt-3 max-w-xl text-navy-fg/70">
              Four short steps. No phone-tag, no auto-mailers. A consultant replies within 4
              working hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-fg/30 bg-transparent text-navy-fg hover:bg-navy-fg/10"
            >
              <a
                href={`https://wa.me/${SITE.phone.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
