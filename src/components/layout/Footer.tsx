// Site footer: brand column, explore links, company links, contact + newsletter.
// Social icons are only rendered when a URL is configured in SITE.social -
// filtering out empty strings keeps the footer clean during pre-launch.
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Newsletter } from "@/components/shared/Newsletter";
import { SITE } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

export function Footer() {
  const socialLinks = [
    { href: SITE.social.instagram || "#", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { href: SITE.social.facebook  || "#", label: "Facebook",  icon: <Facebook  className="h-4 w-4" /> },
    { href: SITE.social.tiktok    || "#", label: "TikTok",    icon: <TikTokIcon /> },
    { href: SITE.social.linkedin  || "#", label: "LinkedIn",  icon: <Linkedin  className="h-4 w-4" /> },
  ];

  return (
    <footer className="bg-navy text-navy-fg">
      {/* Main footer grid */}
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12 lg:py-16">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center">
            <img
              src="/Logo/white-logo.png"
              alt="Luxeonair"
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-fg/60">
            A UK travel specialist for long-haul flights, family holidays and corporate trips. One dedicated consultant handles your booking from first quote to boarding gate.
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((s) => (
              <SocialLink key={s.label} href={s.href} label={s.label}>
                {s.icon}
              </SocialLink>
            ))}
          </div>

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
            <li><FooterLink to="/holiday">Holiday Types</FooterLink></li>
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
        <div className="sm:col-span-2 lg:col-span-1">
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
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 text-gold/60" />
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

      {/* Bottom bar — pb-16 clears the fixed StickyMobileCTA on mobile */}
      <div className="border-t border-navy-fg/10 pb-16 md:pb-0">
        <div className="container-page py-5 text-xs text-navy-fg/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-navy-fg/40">© 2026 Luxeonair Travel</span>
              <Link to="/terms" className="text-navy-fg/70 underline underline-offset-2 transition-colors hover:text-gold">
                Terms &amp; Conditions
              </Link>
              <Link to="/privacy" className="text-navy-fg/70 underline underline-offset-2 transition-colors hover:text-gold">
                Privacy Policy
              </Link>
            </div>
            <span className="text-navy-fg/40">
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
