// Popup enquiry form opened from a flight offer card's "Book Now" button.
// Two-tab layout (Trip Details / Contact Details) matching the flight-offers
// booking flow. Submits to /api/flight-offer-bookings, which is public but
// rate-limited, and surfaces the booking in the admin "Flight Bookings" inbox.
import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { X, Check, Loader2, PlaneTakeoff } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/shared/Flag";
import { findAirport } from "@/data/airports";
import type { FlightOffer } from "@/types/flightOffer";

type Props = {
  offer: FlightOffer | null;
  onOpenChange: (open: boolean) => void;
};

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"];

type FormState = {
  tripType: "One Way" | "Return";
  departDate: string;
  returnDate: string;
  adults: string;
  children: string;
  infants: string;
  cabinClass: string;
  budget: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
};

function buildInitialForm(offer: FlightOffer): FormState {
  return {
    tripType: "One Way",
    departDate: "",
    returnDate: "",
    adults: "1",
    children: "0",
    infants: "0",
    cabinClass: offer.cabinClass,
    budget: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
  };
}

const inputCls =
  "w-full rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-teal focus:bg-background focus:ring-2 focus:ring-teal/15";
const labelCls = "mb-1.5 block text-xs font-semibold text-foreground";

export function FlightOfferBookingModal({ offer, onOpenChange }: Props) {
  const [tab, setTab] = useState<"trip" | "contact">("trip");
  const [form, setForm] = useState<FormState>(() => buildInitialForm(offer ?? ({} as FlightOffer)));
  const [error, setError] = useState("");

  const fromA = offer ? findAirport(offer.fromCode) : undefined;
  const toA = offer ? findAirport(offer.toCode) : undefined;
  const fromLabel = fromA?.cityName ?? offer?.fromCode ?? "";
  const toLabel = toA?.cityName ?? offer?.toCode ?? "";

  useEffect(() => {
    if (offer) {
      setForm(buildInitialForm(offer));
      setTab("trip");
      setError("");
    }
  }, [offer]);

  const mutation = useMutation({
    mutationFn: () => {
      if (!offer) throw new Error("No offer selected");
      return api.post("/api/flight-offer-bookings", {
        offerId: offer.id,
        routeLabel: `${fromLabel} → ${toLabel}`,
        cabinClass: form.cabinClass,
        price: offer.price,
        tripType: form.tripType,
        departDate: form.departDate || undefined,
        returnDate: form.tripType === "Return" ? form.returnDate || undefined : undefined,
        adults: Number(form.adults) || 1,
        children: Number(form.children) || 0,
        infants: Number(form.infants) || 0,
        budget: form.budget || undefined,
        notes: form.notes || undefined,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
    },
    onError: (e) => setError((e as Error).message),
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validateAndSubmit = () => {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setTab("contact");
      setError("Please fill in your name, email and phone number.");
      return;
    }
    if (!Number(form.adults) || Number(form.adults) < 1) {
      setTab("trip");
      setError("Please enter at least 1 adult.");
      return;
    }
    mutation.mutate();
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onOpenChange(false);
      setTimeout(() => mutation.reset(), 250);
    }
  };

  return (
    <DialogPrimitive.Root open={!!offer} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {offer && (
            <>
              {/* Header */}
              <div className="relative border-b border-border bg-navy px-6 py-5 text-navy-fg">
                <DialogPrimitive.Close className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/95">
                    {offer.airlineLogo ? (
                      <img
                        src={offer.airlineLogo}
                        alt={offer.airlineName}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <PlaneTakeoff className="h-4 w-4 text-navy" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <DialogPrimitive.Title className="font-display text-base font-bold leading-tight">
                      Send your flight enquiry
                    </DialogPrimitive.Title>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-fg/70">
                      {fromA && <Flag code={fromA.countryCode} size={11} />}
                      {fromLabel} → {toLabel}
                      {toA && <Flag code={toA.countryCode} size={11} />}
                      <span>· {offer.cabinClass}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs font-semibold text-gold">
                  Starting from £{offer.price.toLocaleString()} per person
                </p>
              </div>

              {mutation.isSuccess ? (
                <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">Enquiry sent</h3>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Thanks {form.name.split(" ")[0] || "there"} — a consultant will confirm live
                    availability and pricing within 4 working hours.
                  </p>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="mt-2 rounded-lg bg-navy px-5 py-2 text-sm font-semibold text-navy-fg hover:bg-navy/90"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  {/* Tabs */}
                  <div className="mb-5 flex gap-2 rounded-xl bg-muted/60 p-1">
                    <button
                      onClick={() => setTab("trip")}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-xs font-bold transition-colors",
                        tab === "trip"
                          ? "bg-gold text-gold-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Trip Details
                    </button>
                    <button
                      onClick={() => setTab("contact")}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-xs font-bold transition-colors",
                        tab === "contact"
                          ? "bg-gold text-gold-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Contact Details
                    </button>
                  </div>

                  {tab === "trip" ? (
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Trip Type*</label>
                        <div className="flex gap-2">
                          {(["One Way", "Return"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => set("tripType", t)}
                              className={cn(
                                "flex-1 rounded-lg py-2 text-xs font-bold transition-colors",
                                form.tripType === t
                                  ? "bg-teal text-white"
                                  : "border border-border bg-background text-muted-foreground hover:border-teal/40",
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Departure Date</label>
                          <input
                            type="date"
                            className={inputCls}
                            value={form.departDate}
                            onChange={(e) => set("departDate", e.target.value)}
                          />
                        </div>
                        {form.tripType === "Return" ? (
                          <div>
                            <label className={labelCls}>Return Date</label>
                            <input
                              type="date"
                              className={inputCls}
                              value={form.returnDate}
                              onChange={(e) => set("returnDate", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div>
                            <label className={labelCls}>Adults*</label>
                            <input
                              type="number"
                              min={1}
                              className={inputCls}
                              value={form.adults}
                              onChange={(e) => set("adults", e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      {form.tripType === "Return" && (
                        <div>
                          <label className={labelCls}>Adults*</label>
                          <input
                            type="number"
                            min={1}
                            className={cn(inputCls, "max-w-[calc(50%-0.375rem)]")}
                            value={form.adults}
                            onChange={(e) => set("adults", e.target.value)}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Children (Age 2 to 12)</label>
                          <input
                            type="number"
                            min={0}
                            className={inputCls}
                            value={form.children}
                            onChange={(e) => set("children", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Infants (Age 0 to 2)</label>
                          <input
                            type="number"
                            min={0}
                            className={inputCls}
                            value={form.infants}
                            onChange={(e) => set("infants", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Cabin class</label>
                          <select
                            className={inputCls}
                            value={form.cabinClass}
                            onChange={(e) => set("cabinClass", e.target.value)}
                          >
                            {CABIN_CLASSES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Approx. budget (£)</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="Optional"
                            className={inputCls}
                            value={form.budget}
                            onChange={(e) => set("budget", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Additional Notes</label>
                        <textarea
                          rows={3}
                          placeholder="Any flexibility, special requests, preferred airlines, etc."
                          className={inputCls}
                          value={form.notes}
                          onChange={(e) => set("notes", e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Full name*</label>
                        <input
                          className={inputCls}
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Email*</label>
                        <input
                          type="email"
                          className={inputCls}
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Phone / WhatsApp*</label>
                        <input
                          type="tel"
                          className={inputCls}
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {error && <p className="mt-4 text-xs font-medium text-red-600">{error}</p>}

                  <button
                    onClick={validateAndSubmit}
                    disabled={mutation.isPending}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-bold text-gold-foreground shadow-sm transition-all hover:bg-gold/90 disabled:opacity-60"
                  >
                    {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit For Enquiry
                  </button>
                </div>
              )}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
