// Site footer: brand column, explore links, company links, contact + newsletter.
// Social icons are only rendered when a URL is configured in SITE.social -
// filtering out empty strings keeps the footer clean during pre-launch.
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Newsletter } from "@/components/shared/Newsletter";
import { SITE } from "@/config/site";

export function Footer() {
  // Empty-string social URLs are filtered out so icons are hidden until configured
  const socialLinks = [
    { href: SITE.social.facebook, label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { href: SITE.social.instagram, label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { href: SITE.social.linkedin, label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { href: SITE.social.youtube, label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy text-navy-fg">
      {/* Main footer grid */}
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center">
            <img
              src="/Logo/White%20Logo.png"
              alt="Luxeonair"
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-fg/60">
            UK-based travel specialists for premium long-haul, family escapes and corporate trips. Tailor-made itineraries, account-managed by a single consultant.
          </p>

          {/* Social icons - only rendered when URLs are configured */}
          {socialLinks.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => (
                <SocialLink key={s.label} href={s.href} label={s.label}>
                  {s.icon}
                </SocialLink>
              ))}
            </div>
          )}

          {/* Accreditation badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="https://www.caa.co.uk/atol-protection/" target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-white px-3 py-2 transition-opacity hover:opacity-80">
              <img
                src="/Logo/atol-logo.png"
                alt="ATOL Protected"
                className="h-8 w-auto"
              />
            </a>
            <a href="https://www.iata.org" target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-white px-3 py-2 transition-opacity hover:opacity-80">
              <img
                src="/Logo/iata-logo.png"
                alt="IATA"
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Explore column */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm text-navy-fg/60">
            <li><FooterLink to="/destinations">Destinations</FooterLink></li>
            <li><FooterLink to="/holiday-types">Holiday Types</FooterLink></li>
            <li><FooterLink to="/deals">Deals & Offers</FooterLink></li>
            <li><FooterLink to="/blog">Travel Blog</FooterLink></li>
            <li><FooterLink to="/reviews">Reviews</FooterLink></li>
          </ul>
        </div>

        {/* Company column */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-navy-fg/60">
            <li><FooterLink to="/about">About Us</FooterLink></li>
            <li><FooterLink to="/contact">Contact</FooterLink></li>
            <li><FooterLink to="/faq">FAQ</FooterLink></li>
            <li><FooterLink to="/quote">Get a Quote</FooterLink></li>
            <li><FooterLink to="/terms">Terms &amp; Conditions</FooterLink></li>
            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
          </ul>
        </div>

        {/* Contact + Newsletter column */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`tel:${SITE.phone.tel}`}
                className="flex items-center gap-2 text-navy-fg/60 transition-colors hover:text-gold"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-gold/60" />
                {SITE.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.phone.whatsapp}`}
                className="flex items-center gap-2 text-navy-fg/60 transition-colors hover:text-gold"
              >
                <span className="h-3.5 w-3.5 shrink-0 text-gold/60 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 text-navy-fg/60 transition-colors hover:text-gold"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-gold/60" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-navy-fg/60">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60" />
              <span>{SITE.address}</span>
            </li>
          </ul>

          <div className="mt-6">
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-navy-fg/10">
        <div className="container-page py-6 text-xs leading-relaxed text-navy-fg/35 space-y-2 text-center">
          <p>
            All flights and packages purchased from Luxeonair in and departing from the UK are protected under our{" "}
            <a href="https://www.caa.co.uk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-navy-fg/60 transition-colors">ATOL</a>{" "}
            scheme except for scheduled flights when e-tickets are sent to you on the day of payment. Please see our booking conditions for further information or for more information about financial protection and the ATOL Certificate.
          </p>
          <p>
            Luxeonair LTD is registered in England and Wales, Registration number: 17264512.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-fg/10">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-navy-fg/40 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 Luxeonair Travel</span>
            <Link to="/terms" className="transition-colors hover:text-navy-fg/70">Terms &amp; Conditions</Link>
            <Link to="/privacy" className="transition-colors hover:text-navy-fg/70">Privacy Policy</Link>
          </div>
          <span>
            Designed and developed by{" "}
            <a
              href="https://lasarmedia.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-fg/60 underline underline-offset-2 transition-colors hover:text-gold"
            >
              LASAR MEDIA
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="transition-colors hover:text-gold">
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full border border-navy-fg/20 text-navy-fg/50 transition-all hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
