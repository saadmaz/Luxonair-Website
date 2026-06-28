// Three-button bar pinned to the bottom of the screen on mobile (hidden at md+).
// Provides instant access to call, WhatsApp, and quote without scrolling to the header.
import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { SITE } from "@/config/site";

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="grid grid-cols-3">
        <a
          href={`tel:${SITE.phone.tel}`}
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-foreground"
          aria-label="Call us"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={`https://wa.me/${SITE.phone.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-border py-2.5 text-xs font-medium text-foreground"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link
          to="/quote"
          className="flex flex-col items-center gap-1 bg-primary py-2.5 text-xs font-medium text-primary-foreground"
        >
          <FileText className="h-4 w-4" /> Quote
        </Link>
      </div>
    </div>
  );
}
