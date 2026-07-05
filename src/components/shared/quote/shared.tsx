// Shared UI primitives for the quote wizards (PackageQuoteForm / FlightQuoteForm).
// Kept framework-free (no form-library dependency) so both wizards can drive them
// from their own local step state and Zod schemas.
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Progress">
      {steps.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium ${
              i <= current ? "bg-primary text-primary-foreground" : "border border-border bg-transparent text-muted-foreground"
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

export function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-1.5${className ? ` ${className}` : ""}`}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-medium">{v || "-"}</div>
    </div>
  );
}

export function Select({ value, onChange, options, emptyLabel = "Any" }: {
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

export function Pills({ value, onChange, options, labels }: {
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

export function calcNights(depart: string, ret: string): number | null {
  if (!depart || !ret) return null;
  const diff = Math.round((new Date(ret).getTime() - new Date(depart).getTime()) / 86_400_000);
  return diff > 0 ? diff : null;
}
