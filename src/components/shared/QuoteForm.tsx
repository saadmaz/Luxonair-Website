// Four-step quote enquiry wizard.
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
import { regions, tripTypes, budgetBands } from "@/data/destinations";
import { SITE } from "@/config/site";

// ─── Per-step Zod schemas ─────────────────────────────────────────────────────
// Each schema only validates the fields visible on that step, so "Continue"
// is safe to call without touching untouched steps.

const step1 = z.object({
  destination: z.string().min(2, "Tell us where you'd like to go"),
  region: z.string().optional(),
  tripType: z.string().min(1, "Pick one"),
});
const step2 = z.object({
  departWindow: z.string().min(2, "Roughly when?"),
  flexibility: z.string().min(1),
  nights: z.coerce.number().min(1, "At least 1 night").max(60),
});
const step3 = z.object({
  adults: z.coerce.number().min(1, "At least 1 adult").max(20),
  children: z.coerce.number().min(0).max(20),
  budget: z.string().min(1, "Pick a budget band"),
});
const step4 = z.object({
  name: z.string().trim().min(2, "Your full name"),
  email: z.string().trim().email("Valid email"),
  phone: z.string().trim().min(7, "Phone or WhatsApp number"),
  notes: z.string().max(1000).optional(),
});

// ─── Form state type ──────────────────────────────────────────────────────────
// All fields are strings because HTML inputs always yield strings; Zod coerces
// numeric fields (nights, adults, children) to numbers before validation.

type Form = {
  destination: string; region: string; tripType: string;
  departWindow: string; flexibility: string; nights: string;
  adults: string; children: string; budget: string;
  name: string; email: string; phone: string; notes: string;
};

const initial: Form = {
  destination: "", region: "", tripType: "Luxury",
  departWindow: "", flexibility: "Flexible ±1 week", nights: "7",
  adults: "2", children: "0", budget: "£££",
  name: "", email: "", phone: "", notes: "",
};

const steps = ["Where", "When", "Who", "Contact"] as const;

export function QuoteForm({ initialValues }: { initialValues?: Partial<Form> }) {
  const [form, setForm] = useState<Form>({ ...initial, ...initialValues });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const schema = [step1, step2, step3, step4][step];
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

    const formspreeId = SITE.formspree.quote;
    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `Quote enquiry - ${form.destination}`,
            destination: form.destination,
            region: form.region,
            tripType: form.tripType,
            departWindow: form.departWindow,
            flexibility: form.flexibility,
            nights: form.nights,
            adults: form.adults,
            children: form.children,
            budget: form.budget,
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
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
    } else {
      console.log("[Luxonair lead - configure SITE.formspree.quote to transmit]", form);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Thank you, {form.name.split(" ")[0] || "traveller"}.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your enquiry is with our consultants. <strong className="text-foreground">A specialist will reply within 4 working hours</strong> ({SITE.hours.display}) by email and, if requested, WhatsApp.
        </p>
        <div className="mt-6 grid gap-2 text-left text-sm sm:grid-cols-2">
          <Row k="Destination" v={form.destination} />
          <Row k="When" v={form.departWindow} />
          <Row k="Travellers" v={`${form.adults} adult${form.adults === "1" ? "" : "s"}${Number(form.children) ? `, ${form.children} child` : ""}`} />
          <Row k="Budget" v={`${form.budget} (${form.nights} nights)`} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <Stepper current={step} />
      <div className="mt-6">
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
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Depart window" error={errors.departWindow}>
              <Input value={form.departWindow} onChange={(e) => set("departWindow", e.target.value)} placeholder="e.g. October half-term" />
            </Field>
            <Field label="Date flexibility">
              <Select value={form.flexibility} onChange={(v) => set("flexibility", v)} options={["Fixed dates", "Flexible ±3 days", "Flexible ±1 week", "Flexible ±1 month"]} />
            </Field>
            <Field label="Nights" error={errors.nights}>
              <Input type="number" min={1} value={form.nights} onChange={(e) => set("nights", e.target.value)} />
            </Field>
          </div>
        )}
        {step === 2 && (
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
        {step === 3 && (
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
      </div>

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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
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

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o || "Any region"}</option>
      ))}
    </select>
  );
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
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
          {o}
        </button>
      ))}
    </div>
  );
}
