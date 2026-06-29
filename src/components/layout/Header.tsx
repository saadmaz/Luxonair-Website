// Sticky site header: announcement bar → main nav bar → mega-panel dropdowns → mobile drawer.
// Mega panels are shown on hover/focus (desktop) and dismissed on mouse-leave of the nav.
// The mobile drawer is a full-width overlay toggled by the hamburger button.
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, Clock, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { holidayTypes } from "@/data/holidayTypes";
import { SITE } from "@/config/site";

const dealCategories = [
  { label: "Beach Deals",       region: "beach" },
  { label: "Family Deals",      region: "family" },
  { label: "City Break Deals",  region: "city-break" },
  { label: "All Inclusive",     region: "all-inclusive" },
  { label: "Corporate Deals",   region: "corporate" },
  { label: "Tailor-Made Deals", region: "tailor-made" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  // null = no panel open; key names correspond to the two mega-menu panels
  const [openMenu, setOpenMenu] = useState<null | "holiday" | "deals">(null);

  return (
    <header className="sticky top-0 z-40">
      {/* Top announcement bar */}
      <div className="bg-navy text-navy-fg">
        <div className="container-page flex items-center justify-between gap-x-4 py-1.5 text-xs">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="flex items-center gap-1.5 text-navy-fg/80 transition-colors hover:text-gold"
            >
              <Phone className="h-3 w-3 shrink-0" /> {SITE.phone.display}
            </a>
            <span className="hidden text-navy-fg/30 sm:block">|</span>
            <a
              href={`mailto:${SITE.email}`}
              className="hidden items-center gap-1.5 text-navy-fg/80 transition-colors hover:text-gold sm:flex"
            >
              <Mail className="h-3 w-3" /> {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-navy-fg/60">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">{SITE.hours.display}</span>
            <span className="sm:hidden">Mon–Fri 9–6 · Sat–Sun 9–4 GMT</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/Logo/Main%20Logo.png"
              alt="Luxeonair"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/about">About us</NavLink>

            {/* Holidays dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("holiday")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div className="inline-flex items-center gap-0.5">
                <Link
                  to="/holidays"
                  className={`text-sm transition-colors ${openMenu === "holiday" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Holidays
                </Link>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform text-muted-foreground ${openMenu === "holiday" ? "rotate-180 text-foreground" : ""}`}
                />
              </div>
              {openMenu === "holiday" && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <div className="min-w-45 rounded-xl border border-border bg-background py-2 shadow-xl">
                    <ul>
                      {holidayTypes.map((h) => (
                        <li key={h.slug}>
                          <Link
                            to="/holiday-types/$slug"
                            params={{ slug: h.slug }}
                            onClick={() => setOpenMenu(null)}
                            className="block px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            {h.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Deals dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("deals")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div className="inline-flex items-center gap-0.5">
                <Link
                  to="/deals"
                  className={`text-sm transition-colors ${openMenu === "deals" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Deals
                </Link>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform text-muted-foreground ${openMenu === "deals" ? "rotate-180 text-foreground" : ""}`}
                />
              </div>
              {openMenu === "deals" && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <div className="min-w-45 rounded-xl border border-border bg-background py-2 shadow-xl">
                    <ul>
                      {dealCategories.map((c) => (
                        <li key={c.region}>
                          <Link
                            to="/deals"
                            onClick={() => setOpenMenu(null)}
                            className="block px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contact">Contact us</NavLink>
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
            <Link to="/about" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">About us</Link>

            {/* Holidays section */}
            <Link to="/holidays" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted">Holidays</Link>
            {holidayTypes.map((h) => (
              <Link
                key={h.slug}
                to="/holiday-types/$slug"
                params={{ slug: h.slug }}
                onClick={() => setOpen(false)}
                className="rounded-md pl-6 pr-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {h.name}
              </Link>
            ))}

            {/* Deals section */}
            <Link to="/deals" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted">Deals</Link>
            {dealCategories.map((c) => (
              <Link
                key={c.region}
                to="/deals"
                onClick={() => setOpen(false)}
                className="rounded-md pl-6 pr-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {c.label}
              </Link>
            ))}

            <Link to="/blog" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">Blog</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">Contact us</Link>

            <div className="mt-2 border-t border-border pt-2">
              <Button asChild className="w-full">
                <Link to="/quote" onClick={() => setOpen(false)}>Get a quote</Link>
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


