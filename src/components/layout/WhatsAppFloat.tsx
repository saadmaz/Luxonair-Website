// Floating WhatsApp button - desktop only (hidden on mobile where StickyMobileCTA
// already provides a WhatsApp action). The ping animation draws attention without
// requiring any user interaction.
import { SITE } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${SITE.phone.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-8 right-6 z-50 hidden md:block"
    >
      <span className="relative flex h-14 w-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-[#128C7E]">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </span>
    </a>
  );
}
