import { useState } from "react";
import { Loader2, Mail, SendHorizonal } from "lucide-react";
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

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

    setSubmitting(false);
    setDone(true);
  };

  if (variant === "section") {
    return (
      <section className="container-page py-10 md:py-16">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Plane-over-clouds background */}
          <img
            src="/clouds-background.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Dark overlay — works for both light + dark mode */}
          <div className="absolute inset-0 bg-navy/65" />

          {/* Content */}
          <div className="relative px-6 py-14 text-center md:px-16 md:py-20">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Newsletter</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl text-balance">
              Curated inspiration. <span className="text-gold">Exclusive offers.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 md:text-base">
              Be the first to discover luxury escapes, seasonal recommendations, and member-only travel deals, delivered thoughtfully, just twice a month.
            </p>

            {/* Email form */}
            <div className="mx-auto mt-8 max-w-lg">
              {done ? (
                <p className="rounded-2xl bg-white/10 px-6 py-4 text-white">
                  ✓ Thanks — we'll send a confirmation to <strong>{email}</strong>.
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center rounded-2xl bg-white px-4 py-2 shadow-lg">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Type Your Email Address"
                      className="flex-1 bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-colors hover:bg-gold/90 disabled:opacity-60"
                    >
                      {submitting
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <SendHorizonal className="h-4 w-4" />}
                    </button>
                  </div>
                  {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
                </form>
              )}
            </div>
          </div>
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
