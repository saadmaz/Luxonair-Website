// Newsletter sign-up with two layout variants:
//   "footer"  — compact, used inside the site Footer
//   "section" — full-bleed dark panel, used inline on the home page
//
// Submits to Formspree if SITE.formspree.newsletter is set; logs to console in demo mode.
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { SITE } from "@/config/site";

export function Newsletter({ variant = "footer" }: { variant?: "footer" | "section" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    setSubmitting(true);
    setError("");

    const formspreeId = SITE.formspree.newsletter;
    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, _subject: "Newsletter sign-up" }),
        });
        if (!res.ok) {
          setError("Couldn't subscribe — please try again or email us.");
          setSubmitting(false);
          return;
        }
      } catch {
        setError("Network error — please try again.");
        setSubmitting(false);
        return;
      }
    } else {
      console.log("[Luxonair newsletter — configure SITE.formspree.newsletter to transmit]", email);
    }

    setSubmitting(false);
    setDone(true);
  };

  if (variant === "section") {
    return (
      <section className="border-y border-border bg-navy text-navy-fg">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1.4fr_1fr] md:items-center md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-navy-fg/60">Newsletter</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Quiet emails. Sharp deals. <span className="text-gold">No spam.</span>
            </h2>
            <p className="mt-3 max-w-lg text-navy-fg/80">
              Two emails a month: one with a curated trip idea, one with limited-availability deals. Unsubscribe in one click.
            </p>
          </div>
          <NewsletterForm email={email} setEmail={setEmail} done={done} submitting={submitting} error={error} onSubmit={handleSubmit} dark />
        </div>
      </section>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold">Newsletter</h4>
      <p className="mt-3 text-sm text-muted-foreground">Two emails a month. Trip ideas and deals. Unsubscribe any time.</p>
      <NewsletterForm email={email} setEmail={setEmail} done={done} submitting={submitting} error={error} onSubmit={handleSubmit} />
    </div>
  );
}

function NewsletterForm({
  email, setEmail, done, submitting, error, onSubmit, dark,
}: {
  email: string;
  setEmail: (v: string) => void;
  done: boolean;
  submitting: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  dark?: boolean;
}) {
  if (done) {
    return (
      <p className={`mt-4 text-sm ${dark ? "text-navy-fg/90" : "text-foreground"}`}>
        ✓ Thanks — we'll send a confirmation to <strong>{email}</strong>.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
      <label className="relative flex-1">
        <Mail className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-navy-fg/60" : "text-muted-foreground"}`} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`h-11 w-full rounded-md pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
            dark
              ? "border border-navy-fg/30 bg-navy-fg/10 text-navy-fg placeholder:text-navy-fg/50"
              : "border border-input bg-background"
          }`}
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className={`h-11 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-60 ${
          dark ? "bg-gold text-gold-foreground hover:bg-gold/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </button>
      {error && <p className={`text-xs ${dark ? "text-navy-fg/70" : "text-destructive"}`}>{error}</p>}
    </form>
  );
}
