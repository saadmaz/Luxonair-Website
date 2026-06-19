import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, Menu, Plane, X } from "lucide-react";
import { useState } from "react";
import { destinations, regions } from "@/lib/destinations";
import { holidayTypes } from "@/lib/holidayTypes";

export function Header() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "destinations" | "holiday">(null);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Luxonair</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <NavTrigger label="Destinations" active={openMenu === "destinations"} onEnter={() => setOpenMenu("destinations")} />
          <NavTrigger label="Holiday Types" active={openMenu === "holiday"} onEnter={() => setOpenMenu("holiday")} />
          <NavLink to="/deals">Deals</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {openMenu === "destinations" && (
            <MegaPanel onClose={() => setOpenMenu(null)}>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-3">
                {regions.map((r) => {
                  const list = destinations.filter((d) => d.region === r);
                  return (
                    <div key={r}>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r}</div>
                      <ul className="mt-3 space-y-2 text-sm">
                        {list.map((d) => (
                          <li key={d.slug}>
                            <Link to="/destinations/$slug" params={{ slug: d.slug }} className="hover:text-primary" onClick={() => setOpenMenu(null)}>
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
                <Link to="/destinations" className="text-sm font-medium text-primary" onClick={() => setOpenMenu(null)}>
                  Browse all destinations →
                </Link>
              </div>
            </MegaPanel>
          )}

          {openMenu === "holiday" && (
            <MegaPanel onClose={() => setOpenMenu(null)}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {holidayTypes.map((h) => (
                  <Link
                    key={h.slug}
                    to="/holiday-types/$slug"
                    params={{ slug: h.slug }}
                    onClick={() => setOpenMenu(null)}
                    className="rounded-lg border border-border bg-card p-4 hover:border-gold"
                  >
                    <div className="font-display text-base font-semibold">{h.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{h.tagline}</div>
                  </Link>
                ))}
              </div>
            </MegaPanel>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
            <Link to="/quote">Start a quote</Link>
          </Button>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
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
              { to: "/quote", label: "Get a quote" },
            ].map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-muted">
                {n.label}
              </Link>
            ))}
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
      className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-medium"
    >
      {children}
    </Link>
  );
}

function NavTrigger({ label, active, onEnter }: { label: string; active: boolean; onEnter: () => void }) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
      aria-expanded={active}
      className={`inline-flex items-center gap-1 text-sm transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${active ? "rotate-180" : ""}`} />
    </button>
  );
}

function MegaPanel({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="absolute left-0 right-0 top-16 border-y border-border bg-background shadow-xl"
      onMouseLeave={onClose}
    >
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
