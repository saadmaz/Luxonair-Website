import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Our London Travel Team | Luxe on Air" },
      { name: "description", content: "Speak directly with a named UK travel consultant — no queue, no call centre. Call +44 7577 002702, WhatsApp, or email hello@luxeonair.com. We reply within 4 working hours." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact Luxe on Air | Speak to a UK Travel Consultant" },
      { property: "og:description", content: "Phone, WhatsApp or email a named consultant in London. No queues. No call centres. Reply within 4 working hours, Mon–Fri." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.com/contact" },
      { name: "twitter:title", content: "Contact Luxe on Air | UK Travel Consultants" },
      { name: "twitter:description", content: "Call, WhatsApp or email a named London travel consultant. No queues. Reply within 4 working hours." },
    ],
    links: [
      { rel: "canonical", href: "https://www.luxeonair.com/contact" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const formspreeId = SITE.formspree.contact;

    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ _subject: `Contact form - ${data.topic ?? "General"}`, ...data }),
        });
        if (!res.ok) {
          setSubmitError("Submission failed - please email us at hello@luxonair.com or call directly.");
          setSubmitting(false);
          return;
        }
      } catch {
        setSubmitError("Network error - please email us at hello@luxonair.com or call directly.");
        setSubmitting(false);
        return;
      }
    } else {
      console.log("[Luxonair contact - configure SITE.formspree.contact to transmit]", data);
    }

    setSubmitting(false);
    setDone(true);
  };

  return (
    <>
      {/* Dark hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Talk to a real consultant.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            One human owns your enquiry from first message to return flight. No automated
            routing, no offshore call centre.
          </p>

          {/* Quick contact chips */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="inline-flex items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-4 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" /> Call us
            </a>
            <a
              href={`https://wa.me/${SITE.phone.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-4 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-4 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5" /> Email us
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Left: info */}
          <aside className="space-y-8">
            <ul className="space-y-4">
              <Row icon={Phone} title="Call us" body={SITE.phone.display} />
              <Row
                icon={MessageCircle}
                title="WhatsApp"
                body={`+${SITE.phone.whatsapp} - text us anything`}
              />
              <Row icon={Mail} title="Email" body={SITE.email} />
              <Row
                icon={Clock}
                title="Hours"
                body="Mon–Fri 09:00–19:00 GMT · 24/7 while you're travelling"
              />
              <Row icon={MapPin} title="Office" body={SITE.address} />
            </ul>

            {/* Response promise */}
            <div className="rounded-2xl border border-border bg-secondary/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <div className="text-sm font-semibold">4-hour response guarantee</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Mon–Fri during office hours, we'll reply within 4 hours. Weekends we'll pick
                    up the following morning.
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Luxe on Air London office"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1421%2C51.5045%2C-0.1186%2C51.5189&amp;layer=mapnik"
                className="h-72 w-full"
                loading="eager"
              />
            </div>
          </aside>

          {/* Right: form */}
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm md:p-10">
            {done ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-gold" />
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  Got it - we'll be in touch.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  A consultant replies within 4 working hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Send a message</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For full trip enquiries, the{" "}
                    <a className="text-primary underline" href="/quote">
                      structured quote form
                    </a>{" "}
                    is faster.
                  </p>
                </div>

                <Field label="Your name">
                  <input required name="name" className="input-field" />
                </Field>
                <Field label="Email">
                  <input required type="email" name="email" className="input-field" />
                </Field>
                <Field label="Phone (optional)">
                  <input name="phone" className="input-field" />
                </Field>
                <Field label="Topic">
                  <select name="topic" className="input-field">
                    <option>General enquiry</option>
                    <option>Existing booking</option>
                    <option>Corporate account</option>
                    <option>Press / media</option>
                  </select>
                </Field>
                <Field label="Message">
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </Field>

                {submitError && (
                  <p className="rounded-md bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{submitError}</p>
                )}

                <Button type="submit" size="lg" disabled={submitting} className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                  {submitting ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending…</> : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Phone;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/8 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{body}</div>
      </div>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
