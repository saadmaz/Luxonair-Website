import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, FileText } from "lucide-react";

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        <a
          href="tel:+440000000000"
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-foreground"
          aria-label="Call us"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href="https://wa.me/440000000000"
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
