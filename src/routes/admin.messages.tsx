import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

const messages = [
  { id: 1, name: "Priya Nair", email: "priya.n@email.com", subject: "Group booking for 12 people", body: "Hi, we are planning a family reunion in the Maldives for 12 adults and 4 children next Easter. Could you help with group pricing and villa arrangements?", received: "20 Jun 2025", read: false },
  { id: 2, name: "Tom Bradley", email: "t.bradley@firm.co.uk", subject: "Corporate account enquiry", body: "We are a 50-person professional services firm based in London. We travel frequently to Dubai and New York. Interested in setting up a corporate account with single invoice billing.", received: "19 Jun 2025", read: false },
  { id: 3, name: "Laura Santos", email: "l.santos@gmail.com", subject: "Honeymoon planning — Bora Bora", body: "Looking to plan our honeymoon to Bora Bora in February 2026. Budget is flexible for the right experience. Can you send options with business class flights from Heathrow?", received: "18 Jun 2025", read: false },
  { id: 4, name: "David Kim", email: "d.kim@outlook.com", subject: "Japan trip assistance", body: "We are a couple who would love help planning a Japan trip for cherry blossom season (late March / early April 2026). 10–14 nights. Business class preferred.", received: "17 Jun 2025", read: true },
  { id: 5, name: "Fatima Al-Hassan", email: "f.alhassan@email.com", subject: "Safari and beach combination", body: "Looking for a two-week trip combining a Kenya safari with a beach stay in Zanzibar. Two adults. Interested in luxury lodges.", received: "15 Jun 2025", read: true },
  { id: 6, name: "George Whitfield", email: "g.whitfield@corp.com", subject: "Feedback — excellent service", body: "Just returned from our Dubai trip arranged by Luxonair. The chauffeur was on time, the hotel was perfect, and the consultant's assistance during our flight delay was invaluable. Thank you.", received: "12 Jun 2025", read: true },
];

function AdminMessagesPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set(messages.filter((m) => m.read).map((m) => m.id)));

  const selectedMsg = messages.find((m) => m.id === selected);
  const unread = messages.filter((m) => !readIds.has(m.id)).length;

  const open = (id: number) => {
    setSelected(id);
    setReadIds((s) => new Set([...s, id]));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Contact form submissions.{" "}
          {unread > 0 && <span className="font-semibold text-amber-600">{unread} unread</span>}
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] min-h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Message list */}
        <div className={cn("flex w-full flex-col divide-y divide-gray-100 overflow-y-auto md:w-80 md:border-r md:border-gray-100", selected && "hidden md:flex")}>
          {messages.map((m) => {
            const isRead = readIds.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => open(m.id)}
                className={cn(
                  "flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors hover:bg-gray-50",
                  selected === m.id && "bg-blue-50/60",
                  !isRead && "bg-amber-50/30"
                )}
              >
                <div className="flex w-full items-center gap-2">
                  {isRead ? <MailOpen className="h-3.5 w-3.5 shrink-0 text-gray-300" /> : <Mail className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                  <p className={cn("flex-1 truncate text-sm", !isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700")}>{m.name}</p>
                  <p className="text-[11px] text-gray-400">{m.received.split(" ").slice(0, 2).join(" ")}</p>
                </div>
                <p className="pl-5 text-xs font-medium text-gray-600 truncate w-full">{m.subject}</p>
                <p className="pl-5 line-clamp-1 text-xs text-gray-400">{m.body}</p>
              </button>
            );
          })}
        </div>

        {/* Message detail */}
        <div className={cn("flex flex-1 flex-col", !selected && "hidden md:flex md:items-center md:justify-center")}>
          {selectedMsg ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedMsg.name}</p>
                  <p className="text-xs text-gray-400">{selectedMsg.email} · {selectedMsg.received}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 md:hidden">Back</button>
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`} className="rounded-lg bg-[#042045] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#042045]/90">Reply</a>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <h2 className="mb-4 text-base font-semibold text-gray-900">{selectedMsg.subject}</h2>
                <p className="text-sm leading-relaxed text-gray-700">{selectedMsg.body}</p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <MailOpen className="mx-auto h-10 w-10 text-gray-200" />
              <p className="mt-3 text-sm font-medium text-gray-400">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
