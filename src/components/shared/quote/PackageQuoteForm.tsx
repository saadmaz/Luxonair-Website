// Three-step holiday package enquiry wizard: Trip → Stay & extras → Contact.
// Validation runs per-step using Zod schemas so the user only sees errors for the
// current step's fields. On submit the payload is posted to /api/enquiries as a
// { quoteType: "package", ... } enquiry.
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { regions, budgetBands } from "@/data/destinations";
import { SITE } from "@/config/site";
import { DatePicker } from "@/components/shared/DatePicker";
import { AirportPicker } from "@/components/admin/AirportPicker";
import { Field, Pills, Row, Select, Stepper, calcNights } from "./shared";

const step1 = z.object({
  destination: z.string().min(2, "Tell us where you'd like to go"),
  region: z.string().optional(),
  tripType: z.string().min(1, "Pick one"),
  tripTypeOther: z.string().optional(),
  dateMode: z.enum(["flexible", "specific"]),
  departWindow: z.string().optional(),
  departDate: z.string().optional(),
  returnDate: z.string().optional(),
  flexibility: z.string().optional(),
  nights: z.coerce.number().min(1, "At least 1 night").max(60),
  budget: z.string().min(1, "Pick a budget band"),
}).superRefine((data, ctx) => {
  if (data.tripType === "Other" && (!data.tripTypeOther || data.tripTypeOther.trim().length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tell us the holiday type", path: ["tripTypeOther"] });
  }
  if (data.dateMode === "flexible" && (!data.departWindow || data.departWindow.trim().length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Roughly when?", path: ["departWindow"] });
  }
  if (data.dateMode === "specific" && !data.departDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a departure date", path: ["departDate"] });
  }
});

const step2 = z.object({
  hotelRating: z.string(),
  boardBasis: z.string(),
  flightsIncluded: z.boolean(),
  departAirport: z.string(),
  cabinClass: z.string(),
  adults: z.coerce.number().min(1, "At least 1 adult").max(20),
  children: z.coerce.number().min(0).max(20),
  infants: z.coerce.number().min(0).max(20),
}).superRefine((data, ctx) => {
  if (data.flightsIncluded && !data.departAirport) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select your departure airport", path: ["departAirport"] });
  }
});

const step3 = z.object({
  name: z.string().trim().min(2, "Your full name"),
  email: z.string().trim().email("Valid email"),
  phone: z.string().trim().min(7, "Phone or WhatsApp number"),
  notes: z.string().max(1000).optional(),
});

type Form = {
  destination: string; region: string; tripType: string; tripTypeOther: string;
  dateMode: "flexible" | "specific";
  departWindow: string; flexibility: string; nights: string;
  departDate: string; returnDate: string;
  budget: string;
  hotelRating: string; boardBasis: string; flightsIncluded: boolean;
  departAirport: string; cabinClass: string;
  adults: string; children: string; infants: string;
  name: string; email: string; phone: string; notes: string;
};

const initial: Form = {
  destination: "", region: "", tripType: "", tripTypeOther: "",
  dateMode: "flexible",
  departWindow: "", flexibility: "Flexible ±1 week", nights: "7",
  departDate: "", returnDate: "",
  budget: "£££",
  hotelRating: "No preference", boardBasis: "All Inclusive", flightsIncluded: true,
  departAirport: "", cabinClass: "Business Class",
  adults: "1", children: "0", infants: "0",
  name: "", email: "", phone: "", notes: "",
};

const HOTEL_RATINGS = ["No preference", "3-star", "4-star", "5-star"];
const BOARD_OPTIONS = ["All Inclusive", "Half Board", "Bed & Breakfast", "Room Only"];
const CABIN_CLASSES = ["Economy", "Premium Economy", "Business Class", "First Class"];
const steps = ["Trip", "Stay & extras", "Contact"] as const;

export function PackageQuoteForm({ initialValues, holidayTypeNames = [] }: { initialValues?: Partial<Form>; holidayTypeNames?: string[] }) {
  const tripTypeOptions = [...holidayTypeNames, "Other"];
  const [form, setForm] = useState<Form>({ ...initial, ...initialValues });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleDepartDate = (date: string) => {
    const nights = calcNights(date, form.returnDate);
    setForm((f) => ({ ...f, departDate: date, ...(nights ? { nights: String(nights) } : {}) }));
  };
  const handleReturnDate = (date: string) => {
    const nights = calcNights(form.departDate, date);
    setForm((f) => ({ ...f, returnDate: date, ...(nights ? { nights: String(nights) } : {}) }));
  };

  const validate = () => {
    const schema = [step1, step2, step3][step];
    const res = schema.safeParse(form);
    if (!res.success) {
      const e: Record<string, string> = {};
      for (const issue of res.error.issues) e[issue.path[0] as string] = issue.message;
      setErrors(e);
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteType: "package",
          name: form.name,
          email: form.email,
          phone: form.phone,
          destination: form.destination,
          region: form.region || undefined,
          tripType: form.tripType === "Other" ? form.tripTypeOther : form.tripType,
          dateMode: form.dateMode,
          departWindow: form.departWindow || undefined,
          flexibility: form.flexibility || undefined,
          departDate: form.departDate || undefined,
          returnDate: form.returnDate || undefined,
          nights: Number(form.nights),
          budget: form.budget,
          hotelRating: form.hotelRating || undefined,
          boardBasis: form.boardBasis || undefined,
          flightsIncluded: form.flightsIncluded,
          departAirport: form.flightsIncluded ? form.departAirport : undefined,
          cabinClass: form.flightsIncluded ? form.cabinClass : undefined,
          adults: Number(form.adults),
          children: Number(form.children),
          infants: Number(form.infants),
          notes: form.notes || undefined,
        }),
      });
      if (!res.ok) {
        setSubmitError("Submission failed - please try WhatsApp or email us directly.");
        setSubmitting(false);
        return;
      }
    } catch {
      setSubmitError("Network error - please try WhatsApp or email us directly.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    const departInfo = form.dateMode === "specific"
      ? `${form.departDate}${form.returnDate ? ` → ${form.returnDate}` : ""}`
      : `${form.departWindow} (${form.flexibility})`;

    return (
      <motion.div
        className="rounded-2xl border border-border bg-card p-8 text-center"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 }}
        >
          <Check className="h-6 w-6" />
        </motion.div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Thank you, {form.name.split(" ")[0] || "traveller"}.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your enquiry is with our consultants. <strong className="text-foreground">A specialist will reply with a rapid response</strong> ({SITE.hours.display}) by email and, if requested, WhatsApp.
        </p>
        <div className="mt-6 grid gap-2 text-left text-sm sm:grid-cols-2">
          <Row k="Destination" v={form.destination} />
          <Row k="When" v={departInfo} />
          <Row k="Stay" v={`${form.nights} nights · ${form.boardBasis}${form.hotelRating !== "No preference" ? ` · ${form.hotelRating}` : ""}`} />
          <Row k="Flights" v={form.flightsIncluded ? `${form.departAirport} · ${form.cabinClass}` : "Not required"} />
          <Row k="Travellers" v={`${form.adults} adult${form.adults === "1" ? "" : "s"}${Number(form.children) ? `, ${form.children} child` : ""}${Number(form.infants) ? `, ${form.infants} infant` : ""}`} />
          <Row k="Budget" v={form.budget} />
        </div>
      </motion.div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <Stepper steps={steps} current={step} />
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-6"
      >
        {/* ── Step 0: Trip ── */}
        {step === 0 && (
          <div className="grid gap-4">
            <Field label="Destination or region" error={errors.destination}>
              <Input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Maldives, Tokyo, anywhere warm" />
            </Field>
            <Field label="Region (optional)">
              <Select value={form.region} onChange={(v) => set("region", v)} options={["", ...regions]} emptyLabel="Any region" />
            </Field>
            <Field label="Trip style" error={errors.tripType}>
              <Pills value={form.tripType} onChange={(v) => set("tripType", v)} options={tripTypeOptions} />
            </Field>
            {form.tripType === "Other" && (
              <Field label="Tell us the holiday type" error={errors.tripTypeOther}>
                <Input value={form.tripTypeOther} onChange={(e) => set("tripTypeOther", e.target.value)} placeholder="e.g. Cruise, Ski, Safari" />
              </Field>
            )}
            <Field label="How fixed are your dates?">
              <Pills
                value={form.dateMode}
                onChange={(v) => set("dateMode", v as "flexible" | "specific")}
                options={["flexible", "specific"]}
                labels={{ flexible: "I'm flexible", specific: "I have specific dates" }}
              />
            </Field>
            {form.dateMode === "flexible" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Depart window" error={errors.departWindow}>
                  <Input value={form.departWindow} onChange={(e) => set("departWindow", e.target.value)} placeholder="e.g. October half-term" />
                </Field>
                <Field label="Date flexibility">
                  <Select value={form.flexibility} onChange={(v) => set("flexibility", v)} options={["Flexible ±3 days", "Flexible ±1 week", "Flexible ±1 month"]} />
                </Field>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure date" error={errors.departDate}>
                  <DatePicker name="departDate" placeholder="Select departure date" minDate={new Date(today)} value={form.departDate} onChange={handleDepartDate} />
                </Field>
                <Field label="Return date">
                  <DatePicker name="returnDate" placeholder="Select return date" minDate={new Date(form.departDate || today)} value={form.returnDate} onChange={handleReturnDate} />
                </Field>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nights" error={errors.nights}>
                <Input type="number" min={1} value={form.nights} onChange={(e) => set("nights", e.target.value)} />
                {form.dateMode === "specific" && form.departDate && form.returnDate && (
                  <p className="mt-1 text-xs text-muted-foreground">Auto-calculated from your dates</p>
                )}
              </Field>
              <Field label="Budget pp" error={errors.budget}>
                <Select value={form.budget} onChange={(v) => set("budget", v)} options={[...budgetBands]} emptyLabel="Pick a budget" />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 1: Stay & extras ── */}
        {step === 1 && (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hotel rating">
                <Select value={form.hotelRating} onChange={(v) => set("hotelRating", v)} options={HOTEL_RATINGS} />
              </Field>
              <Field label="Board basis">
                <Select value={form.boardBasis} onChange={(v) => set("boardBasis", v)} options={BOARD_OPTIONS} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Adults" error={errors.adults}>
                <Input type="number" min={1} value={form.adults} onChange={(e) => set("adults", e.target.value)} />
              </Field>
              <Field label="Children" error={errors.children}>
                <Input type="number" min={0} value={form.children} onChange={(e) => set("children", e.target.value)} />
              </Field>
              <Field label="Infants" error={errors.infants}>
                <Input type="number" min={0} value={form.infants} onChange={(e) => set("infants", e.target.value)} />
              </Field>
            </div>
            <Field label="Do you need flights included?">
              <Pills
                value={form.flightsIncluded ? "Yes" : "No"}
                onChange={(v) => set("flightsIncluded", v === "Yes")}
                options={["Yes", "No"]}
              />
            </Field>
            {form.flightsIncluded && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departing from" error={errors.departAirport}>
                  <AirportPicker label="" value={form.departAirport} onChange={(v) => set("departAirport", v)} />
                </Field>
                <Field label="Cabin class">
                  <Pills value={form.cabinClass} onChange={(v) => set("cabinClass", v)} options={CABIN_CLASSES} />
                </Field>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Contact ── */}
        {step === 2 && (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
            </div>
            <Field label="Phone / WhatsApp" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
            </Field>
            <Field label="Anything else? (optional)">
              <Textarea rows={4} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Preferred activities, special occasions, accessibility, visa or insurance questions..." />
            </Field>
          </div>
        )}
      </motion.div>
      </AnimatePresence>

      {submitError && (
        <p className="mt-4 rounded-md bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{submitError}</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0 || submitting}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next} disabled={submitting}>
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={submitting} className="bg-gold text-gold-foreground hover:bg-gold/90">
            {submitting ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending…</> : "Send enquiry"}
          </Button>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        We respond rapidly, {SITE.hours.display}. No spam, no auto-mailers - just a consultant.
      </p>
    </div>
  );
}
