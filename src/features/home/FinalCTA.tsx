import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

// Full-width CTA banner at the bottom of the home page.
// WhatsApp href uses SITE.phone.whatsapp (digits-only wa.me format).
export function FinalCTA() {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground shadow-2xl md:px-14">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
        <div className="pointer-events-none absolute -bottom-12 right-32 h-40 w-40 rounded-full bg-gold/10" />

        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Tell us where, when, and roughly how much. We'll do the rest.
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/70">
              Four short steps. No phone-tag, no auto-mailers. A consultant replies within 4
              working hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
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
