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
        <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-16 md:py-12">

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
              Your journey starts with a simple conversation.
            </h2>
            <p className="mt-3 max-w-xl text-navy-fg/70">
              Tell us where you want to go, when you want to travel, and what matters most to you.
              A dedicated travel consultant will be in touch the same day to start building your trip.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:justify-end">
            <Button asChild size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-navy-fg/30 bg-transparent text-navy-fg hover:bg-navy-fg/10 sm:w-auto"
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
