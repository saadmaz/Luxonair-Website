// Newsletter sign-up with two layout variants:
//   "footer"  - compact, used inside the site Footer
//   "section" - full-bleed dark panel, used inline on the home page
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
          setError("Couldn't subscribe - please try again or email us.");
          setSubmitting(false);
          return;
        }
      } catch {
        setError("Network error - please try again.");
        setSubmitting(false);
        return;
      }
    } else {
      console.log("[Luxonair newsletter - configure SITE.formspree.newsletter to transmit]", email);
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
              Curated inspiration. <span className="text-gold">Exclusive offers.</span>
            </h2>
            <p className="mt-3 max-w-lg text-navy-fg/80">
              Be the first to discover luxury escapes, seasonal recommendations, and member-only travel deals, delivered thoughtfully, just twice a month.
            </p>
          </div>
          <NewsletterForm email={email} setEmail={setEmail} done={done} submitting={submitting} error={error} onSubmit={handleSubmit} dark />
        </div>
      </section>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-fg">Newsletter</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-navy-fg/50">Two emails a month. Trip ideas and deals. Unsubscribe any time.</p>
      <NewsletterForm email={email} setEmail={setEmail} done={done} submitting={submitting} error={error} onSubmit={handleSubmit} dark />
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
        ✓ Thanks - we'll send a confirmation to <strong>{email}</strong>.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-2${dark ? " mt-3" : " mt-4"}`}>
      <label className="relative">
        <Mail className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-gold/70" : "text-muted-foreground"}`} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className={`h-11 w-full rounded-md pl-10 pr-4 text-sm transition-colors focus:outline-none focus:ring-2 ${
            dark
              ? "border border-white/10 bg-white/5 text-navy-fg placeholder:text-navy-fg/35 focus:border-gold/50 focus:ring-gold/20 hover:border-white/20"
              : "border border-input bg-background focus:ring-ring"
          }`}
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className={`h-11 w-full rounded-md text-sm font-semibold tracking-wide transition-colors disabled:opacity-60 ${
          dark ? "bg-gold text-[#0a0a0a] hover:bg-gold/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Subscribe"}
      </button>
      {error && <p className={`text-xs ${dark ? "text-navy-fg/70" : "text-destructive"}`}>{error}</p>}
    </form>
  );
}
