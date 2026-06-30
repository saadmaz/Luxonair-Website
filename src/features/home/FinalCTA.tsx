import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SITE } from "@/config/site";
import { useInView } from "@/hooks/useInView";

export function FinalCTA() {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`container-page py-8 md:py-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-navy text-navy-fg shadow-xl">
        <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-16 md:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-4xl text-balance">
                Your journey starts with a simple conversation.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-navy-fg/70 sm:text-base">
                Tell us where you want to go, when you want to travel, and what matters most to you.
                A dedicated travel consultant will be in touch the same day.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:justify-end">
              <Button asChild size="lg" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto">
                <Link to="/quote">Start a quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-navy-fg/30 bg-transparent text-navy-fg hover:bg-navy-fg/10 sm:w-auto"
              >
                <a href={`https://wa.me/${SITE.phone.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-1.5 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
