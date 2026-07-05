import { createFileRoute } from "@tanstack/react-router";
import { EnquiryManager } from "@/components/admin/EnquiryManager";

export const Route = createFileRoute("/admin/enquiry-flights")({
  component: () => <EnquiryManager kind="flight" />,
});
