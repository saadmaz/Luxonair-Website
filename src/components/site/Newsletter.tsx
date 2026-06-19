import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter({ variant = "footer" }: { variant?: "footer" | "section" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (variant === "section") {
    return (
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1.4fr_1fr] md:items-center md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Newsletter</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Quiet emails. Sharp deals. <span className="text-gold">No spam.</span>
            </h2>
            <p className="mt-3 max-w-lg text-primary-foreground/80">
              Two emails a month: one with a curated trip idea, one with limited-availability deals. Unsubscribe in one click.
            </p>
          </div>
          <NewsletterForm email={email} setEmail={setEmail} done={done} setDone={setDone} dark />
        </div>
      </section>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold">Newsletter</h4>
      <p className="mt-3 text-sm text-muted-foreground">Two emails a month. Trip ideas and deals. Unsubscribe any time.</p>
      <NewsletterForm email={email} setEmail={setEmail} done={done} setDone={setDone} />
    </div>
  );
}

function NewsletterForm({
  email, setEmail, done, setDone, dark,
}: { email: string; setEmail: (v: string) => void; done: boolean; setDone: (v: boolean) => void; dark?: boolean }) {
  if (done) {
    return (
      <p className={`mt-4 text-sm ${dark ? "text-primary-foreground/90" : "text-foreground"}`}>
        ✓ Thanks — we'll send a confirmation to <strong>{email}</strong>.
      </p>
    );
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (/.+@.+\..+/.test(email)) setDone(true); }}
      className="mt-4 flex flex-col gap-2 sm:flex-row"
    >
      <label className="relative flex-1">
        <Mail className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`h-11 w-full rounded-md pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
            dark
              ? "border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
              : "border border-input bg-background"
          }`}
        />
      </label>
      <button
        type="submit"
        className={`h-11 rounded-md px-4 text-sm font-medium transition-colors ${
          dark ? "bg-gold text-gold-foreground hover:bg-gold/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        Subscribe
      </button>
    </form>
  );
}
