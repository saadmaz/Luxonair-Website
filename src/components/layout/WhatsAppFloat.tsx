// Floating WhatsApp button - desktop only (hidden on mobile where StickyMobileCTA
// already provides a WhatsApp action). The ping animation draws attention without
// requiring any user interaction.
import { SITE } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { motion } from "framer-motion";

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
        <motion.span
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl"
          whileHover={{ scale: 1.12, backgroundColor: "#128C7E" }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </motion.span>
      </span>
    </a>
  );
}
