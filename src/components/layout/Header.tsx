import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, Clock, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { holidayTypes } from "@/data/holidayTypes";
import { SITE } from "@/config/site";
import { AnimatePresence, motion } from "framer-motion";

const dealCategories = [
  { label: "Cheap Flights", slug: "cheap-flights" },
  { label: "Last Minute Holidays", slug: "last-minute" },
  { label: "Seasonal Offers", slug: "seasonal" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
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
      <div className="border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src="/Logo/main-logo.png" alt="Luxeonair" className="h-16 w-auto" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/">Home</NavLink>

            {/* Holidays dropdown */}
            <div className="group relative">
              <div className="flex items-center gap-0.5 cursor-pointer">
                <Link
                  to="/holidays"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground group-hover:text-foreground"
                >
                  Holidays
                </Link>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:rotate-180 group-hover:text-foreground" />
              </div>
              {/* Dropdown panel — shown on group hover via CSS */}
              <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="w-48 rounded-xl border border-border bg-background py-2 shadow-xl">
                  {holidayTypes.map((h) => (
                    <Link
                      key={h.slug}
                      to="/holiday/$slug"
                      params={{ slug: h.slug }}
                      className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      {h.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Deals dropdown */}
            <div className="group relative">
              <div className="flex items-center gap-0.5 cursor-pointer">
                <Link
                  to="/deals"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground group-hover:text-foreground"
                >
                  Deals
                </Link>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:rotate-180 group-hover:text-foreground" />
              </div>
              <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="w-48 rounded-xl border border-border bg-background py-2 shadow-xl">
                  {dealCategories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/deals"
                      className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink to="/flight-offers">Flight Offers</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contact">Contact us</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="default"
              size="sm"
              className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex"
            >
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
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Home
              </Link>

              <Link
                to="/holidays"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Holidays
              </Link>
              {holidayTypes.map((h) => (
                <Link
                  key={h.slug}
                  to="/holiday/$slug"
                  params={{ slug: h.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-md pl-6 pr-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {h.name}
                </Link>
              ))}

              <Link
                to="/deals"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Deals
              </Link>
              {dealCategories.map((c) => (
                <Link
                  key={c.slug}
                  to="/deals"
                  onClick={() => setOpen(false)}
                  className="rounded-md pl-6 pr-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {c.label}
                </Link>
              ))}

              <Link
                to="/flight-offers"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Flight Offers
              </Link>
              <Link
                to="/blog"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Contact us
              </Link>

              <div className="mt-2 border-t border-border pt-2">
                <Button asChild className="w-full">
                  <Link to="/quote" onClick={() => setOpen(false)}>
                    Get a quote
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 [&.active]:after:scale-x-100"
    >
      {children}
    </Link>
  );
}
