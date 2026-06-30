// Five-step quote enquiry wizard.
// Validation runs per-step using Zod schemas so the user only sees errors
// for the current step's fields. On final submit the payload is sent to
// Formspree if SITE.formspree.quote is configured; otherwise it logs to the
// console (demo mode) so the form is always testable without live credentials.
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { regions, tripTypes, budgetBands } from "@/data/destinations";
import { SITE } from "@/config/site";

// ─── Per-step Zod schemas ─────────────────────────────────────────────────────

const step1 = z.object({
  destination: z.string().min(2, "Tell us where you'd like to go"),
  region: z.string().optional(),
  tripType: z.string().min(1, "Pick one"),
});

const step2 = z.object({
  dateMode: z.enum(["flexible", "specific"]),
  departWindow: z.string().optional(),
  departDate: z.string().optional(),
  returnDate: z.string().optional(),
  flexibility: z.string().optional(),
  nights: z.coerce.number().min(1, "At least 1 night").max(60),
}).superRefine((data, ctx) => {
  if (data.dateMode === "flexible" && (!data.departWindow || data.departWindow.trim().length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Roughly when?", path: ["departWindow"] });
  }
  if (data.dateMode === "specific" && !data.departDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a departure date", path: ["departDate"] });
  }
});

const step3 = z.object({
  departAirport: z.string().min(2, "Select your departure airport"),
  cabinClass: z.string().min(1, "Pick a cabin class"),
  directOnly: z.string(),
  preferredAirlines: z.string().optional(),
});

const step4 = z.object({
  adults: z.coerce.number().min(1, "At least 1 adult").max(20),
  children: z.coerce.number().min(0).max(20),
  budget: z.string().min(1, "Pick a budget band"),
});

const step5 = z.object({
  name: z.string().trim().min(2, "Your full name"),
  email: z.string().trim().email("Valid email"),
  phone: z.string().trim().min(7, "Phone or WhatsApp number"),
  notes: z.string().max(1000).optional(),
});

// ─── Form state type ──────────────────────────────────────────────────────────

type Form = {
  destination: string; region: string; tripType: string;
  dateMode: "flexible" | "specific";
  departWindow: string; flexibility: string; nights: string;
  departDate: string; returnDate: string;
  departAirport: string; cabinClass: string; directOnly: string; preferredAirlines: string;
  adults: string; children: string; budget: string;
  name: string; email: string; phone: string; notes: string;
};

const initial: Form = {
  destination: "", region: "", tripType: "Luxury",
  dateMode: "flexible",
  departWindow: "", flexibility: "Flexible ±1 week", nights: "7",
  departDate: "", returnDate: "",
  departAirport: "", cabinClass: "Business Class", directOnly: "No preference", preferredAirlines: "",
  adults: "2", children: "0", budget: "£££",
  name: "", email: "", phone: "", notes: "",
};

const UK_AIRPORTS = [
  "London Heathrow (LHR)",
  "London Gatwick (LGW)",
  "London Stansted (STN)",
  "London Luton (LTN)",
  "Manchester (MAN)",
  "Birmingham (BHX)",
  "Edinburgh (EDI)",
  "Glasgow (GLA)",
  "Bristol (BRS)",
  "Leeds Bradford (LBA)",
  "Newcastle (NCL)",
  "Other",
];

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business Class", "First Class"];
const DIRECT_OPTIONS = ["No preference", "Direct only"];

const steps = ["Where", "When", "Flights", "Who", "Contact"] as const;

export function QuoteForm({ initialValues }: { initialValues?: Partial<Form> }) {
  const [form, setForm] = useState<Form>({ ...initial, ...initialValues });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const calcNights = (depart: string, ret: string) => {
    if (!depart || !ret) return null;
    const diff = Math.round((new Date(ret).getTime() - new Date(depart).getTime()) / 86_400_000);
    return diff > 0 ? diff : null;
  };

  const handleDepartDate = (date: string) => {
    const nights = calcNights(date, form.returnDate);
    setForm((f) => ({ ...f, departDate: date, ...(nights ? { nights: String(nights) } : {}) }));
  };

  const handleReturnDate = (date: string) => {
    const nights = calcNights(form.departDate, date);
    setForm((f) => ({ ...f, returnDate: date, ...(nights ? { nights: String(nights) } : {}) }));
  };

  const validate = () => {
    const schema = [step1, step2, step3, step4, step5][step];
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

    const departInfo = form.dateMode === "specific"
      ? `${form.departDate}${form.returnDate ? ` → ${form.returnDate}` : ""}`
      : `${form.departWindow} (${form.flexibility})`;

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          destination: form.destination,
          region: form.region || undefined,
          tripType: form.tripType,
          dateMode: form.dateMode,
          departWindow: form.departWindow || undefined,
          flexibility: form.flexibility || undefined,
          departDate: form.departDate || undefined,
          returnDate: form.returnDate || undefined,
          nights: Number(form.nights),
          departAirport: form.departAirport,
          cabinClass: form.cabinClass,
          directOnly: form.directOnly || undefined,
          preferredAirlines: form.preferredAirlines || undefined,
          adults: Number(form.adults),
          children: Number(form.children),
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
          Your enquiry is with our consultants. <strong className="text-foreground">A specialist will reply within 4 working hours</strong> ({SITE.hours.display}) by email and, if requested, WhatsApp.
        </p>
        <div className="mt-6 grid gap-2 text-left text-sm sm:grid-cols-2">
          <Row k="Destination" v={form.destination} />
          <Row k="When" v={departInfo} />
          <Row k="Flights" v={`${form.departAirport} · ${form.cabinClass}`} />
          <Row k="Travellers" v={`${form.adults} adult${form.adults === "1" ? "" : "s"}${Number(form.children) ? `, ${form.children} child` : ""}`} />
          <Row k="Budget" v={`${form.budget} (${form.nights} nights)`} />
        </div>
      </motion.div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <Stepper current={step} />
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-6"
      >

        {/* ── Step 0: Where ── */}
        {step === 0 && (
          <div className="grid gap-4">
            <Field label="Destination or region" error={errors.destination}>
              <Input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Maldives, Tokyo, anywhere warm" />
            </Field>
            <Field label="Region (optional)">
              <Select value={form.region} onChange={(v) => set("region", v)} options={["", ...regions]} />
            </Field>
            <Field label="Trip type" error={errors.tripType}>
              <Pills value={form.tripType} onChange={(v) => set("tripType", v)} options={[...tripTypes]} />
            </Field>
          </div>
        )}

        {/* ── Step 1: When ── */}
        {step === 1 && (
          <div className="grid gap-4">
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
                  <Input
                    value={form.departWindow}
                    onChange={(e) => set("departWindow", e.target.value)}
                    placeholder="e.g. October half-term"
                  />
                </Field>
                <Field label="Date flexibility">
                  <Select
                    value={form.flexibility}
                    onChange={(v) => set("flexibility", v)}
                    options={["Flexible ±3 days", "Flexible ±1 week", "Flexible ±1 month"]}
                  />
                </Field>
                <Field label="Return date (optional)" className="sm:col-span-2">
                  <Input
                    type="date"
                    min={today}
                    value={form.returnDate}
                    onChange={(e) => set("returnDate", e.target.value)}
                  />
                </Field>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure date" error={errors.departDate}>
                  <Input
                    type="date"
                    min={today}
                    value={form.departDate}
                    onChange={(e) => handleDepartDate(e.target.value)}
                  />
                </Field>
                <Field label="Return date (optional)">
                  <Input
                    type="date"
                    min={form.departDate || today}
                    value={form.returnDate}
                    onChange={(e) => handleReturnDate(e.target.value)}
                  />
                </Field>
              </div>
            )}

            <Field label="Nights" error={errors.nights}>
              <Input
                type="number"
                min={1}
                value={form.nights}
                onChange={(e) => set("nights", e.target.value)}
              />
              {form.dateMode === "specific" && form.departDate && form.returnDate && (
                <p className="mt-1 text-xs text-muted-foreground">Auto-calculated from your dates</p>
              )}
            </Field>
          </div>
        )}

        {/* ── Step 2: Flights ── */}
        {step === 2 && (
          <div className="grid gap-4">
            <Field label="Departing from" error={errors.departAirport}>
              <Select
                value={form.departAirport}
                onChange={(v) => set("departAirport", v)}
                options={["", ...UK_AIRPORTS]}
                emptyLabel="Select departure airport"
              />
            </Field>
            <Field label="Cabin class" error={errors.cabinClass}>
              <Pills value={form.cabinClass} onChange={(v) => set("cabinClass", v)} options={CABIN_CLASSES} />
            </Field>
            <Field label="Routing preference">
              <Pills value={form.directOnly} onChange={(v) => set("directOnly", v)} options={DIRECT_OPTIONS} />
            </Field>
            <Field label="Preferred airlines (optional)">
              <Input
                value={form.preferredAirlines}
                onChange={(e) => set("preferredAirlines", e.target.value)}
                placeholder="e.g. Emirates, British Airways"
              />
            </Field>
          </div>
        )}

        {/* ── Step 3: Who ── */}
        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Adults" error={errors.adults}>
              <Input type="number" min={1} value={form.adults} onChange={(e) => set("adults", e.target.value)} />
            </Field>
            <Field label="Children" error={errors.children}>
              <Input type="number" min={0} value={form.children} onChange={(e) => set("children", e.target.value)} />
            </Field>
            <Field label="Budget pp" error={errors.budget}>
              <Pills value={form.budget} onChange={(v) => set("budget", v)} options={[...budgetBands]} />
              <p className="mt-1.5 text-xs text-muted-foreground">
                ££ up to £1,500 · £££ £1,500–3,500 · ££££ £3,500+
              </p>
            </Field>
          </div>
        )}

        {/* ── Step 4: Contact ── */}
        {step === 4 && (
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
              <Textarea rows={4} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Special occasions, accessibility, dietary..." />
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
        We respond within 4 working hours, {SITE.hours.display}. No spam, no auto-mailers - just a consultant.
      </p>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Progress">
      {steps.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium ${
              i <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span className={`hidden text-sm sm:inline ${i === current ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
          {i < steps.length - 1 && <span className="ml-1 hidden h-px flex-1 bg-border sm:block" />}
        </li>
      ))}
    </ol>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-1.5${className ? ` ${className}` : ""}`}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-medium">{v || "-"}</div>
    </div>
  );
}

function Select({ value, onChange, options, emptyLabel = "Any region" }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  emptyLabel?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o || emptyLabel}</option>
      ))}
    </select>
  );
}

function Pills({ value, onChange, options, labels }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}
