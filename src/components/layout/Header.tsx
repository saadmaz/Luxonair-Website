// Sticky site header: announcement bar → main nav bar → mega-panel dropdowns → mobile drawer.
// Mega panels are shown on hover/focus (desktop) and dismissed on mouse-leave of the nav.
// The mobile drawer is a full-width overlay toggled by the hamburger button.
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, Clock, Mail, Menu, Phone, Plane, X } from "lucide-react";
import { useState } from "react";
import { destinations, regions } from "@/data/destinations";
import { holidayTypes } from "@/data/holidayTypes";
import { SITE } from "@/config/site";

export function Header() {
  const [open, setOpen] = useState(false);
  // null = no panel open; key names correspond to the two mega-menu panels
  const [openMenu, setOpenMenu] = useState<null | "destinations" | "holiday">(null);

  return (
    <header className="sticky top-0 z-40">
      {/* Top announcement bar */}
      <div className="bg-navy text-navy-fg">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="flex items-center gap-1.5 text-navy-fg/80 transition-colors hover:text-gold"
            >
              <Phone className="h-3 w-3" /> {SITE.phone.display}
            </a>
            <span className="hidden text-navy-fg/30 sm:block">|</span>
            <a
              href="mailto:hello@luxonair.com"
              className="hidden items-center gap-1.5 text-navy-fg/80 transition-colors hover:text-gold sm:flex"
            >
              <Mail className="h-3 w-3" /> hello@luxonair.com
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-navy-fg/60">
            <Clock className="h-3 w-3" />
            <span>Mon–Fri 09:00–19:00 GMT</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Plane className="h-4 w-4" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Luxonair</span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-5 md:flex"
            onMouseLeave={() => setOpenMenu(null)}
          >
            <NavTrigger
              label="Destinations"
              active={openMenu === "destinations"}
              onEnter={() => setOpenMenu("destinations")}
              panelId="mega-destinations"
            />
            <NavTrigger
              label="Holiday Types"
              active={openMenu === "holiday"}
              onEnter={() => setOpenMenu("holiday")}
              panelId="mega-holiday"
            />
            <NavLink to="/deals">Deals</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {openMenu === "destinations" && (
              <MegaPanel id="mega-destinations" onClose={() => setOpenMenu(null)}>
                <div className="grid grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-3">
                  {regions.map((r) => {
                    const list = destinations.filter((d) => d.region === r);
                    return (
                      <div key={r}>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                          {r}
                        </div>
                        <ul className="mt-3 space-y-2 text-sm">
                          {list.map((d) => (
                            <li key={d.slug}>
                              <Link
                                to="/destinations/$slug"
                                params={{ slug: d.slug }}
                                className="text-muted-foreground transition-colors hover:text-primary"
                                onClick={() => setOpenMenu(null)}
                              >
                                {d.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <Link
                    to="/destinations"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    onClick={() => setOpenMenu(null)}
                  >
                    Browse all destinations →
                  </Link>
                </div>
              </MegaPanel>
            )}

            {openMenu === "holiday" && (
              <MegaPanel id="mega-holiday" onClose={() => setOpenMenu(null)}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {holidayTypes.map((h) => (
                    <Link
                      key={h.slug}
                      to="/holiday-types/$slug"
                      params={{ slug: h.slug }}
                      onClick={() => setOpenMenu(null)}
                      className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-gold hover:shadow-md"
                    >
                      <div className="font-display text-base font-semibold transition-colors group-hover:text-gold">
                        {h.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{h.tagline}</div>
                    </Link>
                  ))}
                </div>
              </MegaPanel>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="default" size="sm" className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex">
              <Link to="/quote">Start a quote</Link>
            </Button>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {[
              { to: "/", label: "Home" },
              { to: "/destinations", label: "Destinations" },
              { to: "/holiday-types", label: "Holiday Types" },
              { to: "/deals", label: "Deals" },
              { to: "/blog", label: "Blog" },
              { to: "/reviews", label: "Reviews" },
              { to: "/faq", label: "FAQ" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <Button asChild className="w-full">
                <Link to="/quote" onClick={() => setOpen(false)}>
                  Get a quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground"
    >
      {children}
    </Link>
  );
}

function NavTrigger({
  label,
  active,
  onEnter,
  panelId,
}: {
  label: string;
  active: boolean;
  onEnter: () => void;
  panelId: string;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
      aria-expanded={active}
      aria-controls={active ? panelId : undefined}
      className={`inline-flex items-center gap-1 whitespace-nowrap text-sm transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}{" "}
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform ${active ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function MegaPanel({
  id,
  children,
  onClose,
}: {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      id={id}
      className="absolute left-0 right-0 top-full border-b border-border bg-background shadow-2xl"
      onMouseLeave={onClose}
    >
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
