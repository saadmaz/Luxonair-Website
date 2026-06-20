import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

// Full-width CTA banner at the bottom of the home page.
// WhatsApp href uses SITE.phone.whatsapp (digits-only wa.me format).
export function FinalCTA() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-navy text-navy-fg shadow-xl">
        <div className="px-8 py-10 sm:px-12 md:px-16 md:py-12">

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
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
      </div>
    </section>
  );
}
