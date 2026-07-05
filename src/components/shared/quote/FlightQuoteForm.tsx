// Three-step flights-only enquiry wizard: Journey → Preferences → Contact.
// Validation runs per-step using Zod schemas so the user only sees errors for the
// current step's fields. On submit the payload is posted to /api/enquiry-flights.
// No holiday/package fields ever appear here.
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { budgetBands } from "@/data/destinations";
import { SITE } from "@/config/site";
import { DatePicker } from "@/components/shared/DatePicker";
import { AirportPicker } from "@/components/admin/AirportPicker";
import { Field, Pills, Row, Select, Stepper } from "./shared";

const step1 = z.object({
  departAirport: z.string().min(2, "Select your departure airport"),
  destination: z.string().min(2, "Select your arrival airport or city"),
  tripType: z.enum(["One Way", "Return"]),
  dateMode: z.enum(["flexible", "specific"]),
  departWindow: z.string().optional(),
  departDate: z.string().optional(),
  returnDate: z.string().optional(),
  adults: z.coerce.number().min(1, "At least 1 adult").max(20),
  children: z.coerce.number().min(0).max(20),
  infants: z.coerce.number().min(0).max(20),
}).superRefine((data, ctx) => {
  if (data.dateMode === "flexible" && (!data.departWindow || data.departWindow.trim().length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tell us roughly when you'd like to fly", path: ["departWindow"] });
  }
  if (data.dateMode === "specific" && !data.departDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a departure date", path: ["departDate"] });
  }
  if (data.tripType === "Return" && data.dateMode === "specific" && !data.returnDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a return date", path: ["returnDate"] });
  }
  if (data.departAirport && data.destination && data.departAirport === data.destination) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Choose a different arrival airport", path: ["destination"] });
  }
});

const step2 = z.object({
  cabinClass: z.string().min(1, "Pick a cabin class"),
  directOnly: z.string(),
  preferredAirlines: z.string().optional(),
  budget: z.string().min(1, "Pick a budget band"),
  notes: z.string().max(1000).optional(),
});

const step3 = z.object({
  name: z.string().trim().min(2, "Your full name"),
  email: z.string().trim().email("Valid email"),
  phone: z.string().trim().min(7, "Phone or WhatsApp number"),
});

type Form = {
  departAirport: string; destination: string;
  tripType: "One Way" | "Return";
  dateMode: "flexible" | "specific";
  departWindow: string; departDate: string; returnDate: string;
  adults: string; children: string; infants: string;
  cabinClass: string; directOnly: string; preferredAirlines: string; budget: string; notes: string;
  name: string; email: string; phone: string;
};

const initial: Form = {
  departAirport: "", destination: "",
  tripType: "Return",
  dateMode: "flexible",
  departWindow: "", departDate: "", returnDate: "",
  adults: "1", children: "0", infants: "0",
  cabinClass: "Business Class", directOnly: "No preference", preferredAirlines: "", budget: "£££", notes: "",
  name: "", email: "", phone: "",
};

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business Class", "First Class"];
const DIRECT_OPTIONS = ["No preference", "Direct only", "One stop is fine"];
const steps = ["Journey", "Preferences", "Contact"] as const;

export function FlightQuoteForm({ initialValues }: { initialValues?: Partial<Form> }) {
  const [form, setForm] = useState<Form>({ ...initial, ...initialValues });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    // departAirport/destination share a cross-field "must differ" check, so
    // changing either one should clear a stale error on both.
    const keysToClear = k === "departAirport" || k === "destination" ? ["departAirport", "destination"] : [k as string];
    setErrors((e) => {
      if (!keysToClear.some((key) => e[key])) return e;
      const next = { ...e };
      for (const key of keysToClear) delete next[key];
      return next;
    });
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
      const res = await fetch("/api/enquiry-flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          destination: form.destination,
          tripType: form.tripType,
          dateMode: form.dateMode,
          departWindow: form.departWindow || undefined,
          departDate: form.departDate || undefined,
          returnDate: form.tripType === "Return" ? (form.returnDate || undefined) : undefined,
          departAirport: form.departAirport,
          cabinClass: form.cabinClass,
          directOnly: form.directOnly || undefined,
          preferredAirlines: form.preferredAirlines || undefined,
          adults: Number(form.adults),
          children: Number(form.children),
          infants: Number(form.infants),
          budget: form.budget,
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
      : form.departWindow;

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
          Your flight enquiry is with our consultants. <strong className="text-foreground">A specialist will reply with a rapid response</strong> ({SITE.hours.display}) by email and, if requested, WhatsApp.
        </p>
        <div className="mt-6 grid gap-2 text-left text-sm sm:grid-cols-2">
          <Row k="Route" v={`${form.departAirport} → ${form.destination}`} />
          <Row k="When" v={departInfo} />
          <Row k="Cabin" v={`${form.cabinClass} · ${form.tripType}`} />
          <Row k="Travellers" v={`${form.adults} adult${form.adults === "1" ? "" : "s"}${Number(form.children) ? `, ${form.children} child` : ""}${Number(form.infants) ? `, ${form.infants} infant` : ""}`} />
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
        {/* ── Step 0: Journey ── */}
        {step === 0 && (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Departing from" error={errors.departAirport}>
                <AirportPicker label="" value={form.departAirport} onChange={(v) => set("departAirport", v)} />
              </Field>
              <Field label="Flying to" error={errors.destination}>
                <AirportPicker label="" value={form.destination} onChange={(v) => set("destination", v)} />
              </Field>
            </div>
            <Field label="One way or return?">
              <Pills value={form.tripType} onChange={(v) => set("tripType", v as "One Way" | "Return")} options={["Return", "One Way"]} />
            </Field>
            <Field label="How fixed are your dates?">
              <Pills
                value={form.dateMode}
                onChange={(v) => set("dateMode", v as "flexible" | "specific")}
                options={["flexible", "specific"]}
                labels={{ flexible: "I'm flexible", specific: "I have specific dates" }}
              />
            </Field>
            {form.dateMode === "flexible" ? (
              <Field label="Roughly when?" error={errors.departWindow}>
                <Input value={form.departWindow} onChange={(e) => set("departWindow", e.target.value)} placeholder="e.g. October half-term" />
              </Field>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure date" error={errors.departDate}>
                  <DatePicker name="departDate" placeholder="Select departure date" minDate={new Date(today)} value={form.departDate} onChange={(v) => set("departDate", v)} />
                </Field>
                {form.tripType === "Return" && (
                  <Field label="Return date" error={errors.returnDate}>
                    <DatePicker name="returnDate" placeholder="Select return date" minDate={new Date(form.departDate || today)} value={form.returnDate} onChange={(v) => set("returnDate", v)} />
                  </Field>
                )}
              </div>
            )}
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
          </div>
        )}

        {/* ── Step 1: Preferences ── */}
        {step === 1 && (
          <div className="grid gap-4">
            <Field label="Cabin class" error={errors.cabinClass}>
              <Pills value={form.cabinClass} onChange={(v) => set("cabinClass", v)} options={CABIN_CLASSES} />
            </Field>
            <Field label="Routing preference">
              <Pills value={form.directOnly} onChange={(v) => set("directOnly", v)} options={DIRECT_OPTIONS} />
            </Field>
            <Field label="Preferred airlines (optional)">
              <Input value={form.preferredAirlines} onChange={(e) => set("preferredAirlines", e.target.value)} placeholder="e.g. Emirates, British Airways" />
            </Field>
            <Field label="Budget pp" error={errors.budget}>
              <Select value={form.budget} onChange={(v) => set("budget", v)} options={[...budgetBands]} emptyLabel="Pick a budget" />
            </Field>
            <Field label="Special requests (optional)">
              <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Baggage requirements, seating, stopovers, accessibility..." />
            </Field>
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
