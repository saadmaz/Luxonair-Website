import { Link } from "@tanstack/react-router";
import { Plane, Facebook, Instagram, Linkedin } from "lucide-react";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Plane className="h-4 w-4" />
            </span>
            <span className="font-display text-xl font-semibold">Luxonair</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            UK-based travel specialists for premium long-haul, family escapes and corporate trips. Tailor-made itineraries, account-managed by a single consultant.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:text-primary"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:text-primary"><Linkedin className="h-4 w-4" /></a>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            [PLACEHOLDER] ABTA / ATOL / IATA membership numbers will appear here once supplied.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/destinations" className="hover:text-foreground">Destinations</Link></li>
            <li><Link to="/holiday-types" className="hover:text-foreground">Holiday types</Link></li>
            <li><Link to="/deals" className="hover:text-foreground">Deals</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/reviews" className="hover:text-foreground">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link to="/quote" className="hover:text-foreground">Get a quote</Link></li>
          </ul>
        </div>

        <div>
          <Newsletter />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>0800 [PLACEHOLDER]</li>
            <li>hello@luxonair.example</li>
            <li>Mon–Fri 09:00–19:00 GMT</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Luxonair Travel Ltd. All prices indicative and subject to availability.</span>
          <span>Registered in England & Wales — [PLACEHOLDER]</span>
        </div>
      </div>
    </footer>
  );
}
