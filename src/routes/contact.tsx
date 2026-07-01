import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Our London Travel Team | Luxeonair" },
      { name: "description", content: "Speak directly with a named UK travel consultant — no queue, no call centre. Call +44 7448 009739, WhatsApp, or email info@luxeonair.co.uk. We reply within 4 working hours." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact Luxeonair | Speak to a UK Travel Consultant" },
      { property: "og:description", content: "Phone, WhatsApp or email a named consultant in London. No queues. No call centres. Rapid response, Mon–Fri." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/contact" },
      { name: "twitter:title", content: "Contact Luxeonair | UK Travel Consultants" },
      { name: "twitter:description", content: "Call, WhatsApp or email a named London travel consultant. No queues. Rapid response." },
    ],
    links: [
      { rel: "canonical", href: "https://www.luxeonair.co.uk/contact" },
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

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          topic: data.topic || undefined,
          message: data.message,
        }),
      });
      if (!res.ok) {
        setSubmitError("Submission failed - please email us at info@luxeonair.co.uk or call directly.");
        setSubmitting(false);
        return;
      }
    } catch {
      setSubmitError("Network error - please email us at info@luxeonair.co.uk or call directly.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setDone(true);
  };

  return (
    <>
      {/* Dark hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-10 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Travel advice, tailored to you.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Every enquiry is handled by a dedicated travel specialist who takes the time to
            understand your needs, coordinate every detail, and remain your trusted point of
            contact from start to finish.
          </p>

          {/* Quick contact chips */}
          <div className="mt-6 flex gap-2.5 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-x-visible sm:pb-0 sm:gap-3">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-3.5 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold sm:px-4"
            >
              <Phone className="h-3.5 w-3.5" /> Call us
            </a>
            <a
              href={`https://wa.me/${SITE.phone.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-3.5 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold sm:px-4"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-fg/20 bg-navy-fg/5 px-3.5 py-2 text-sm text-navy-fg/80 transition-colors hover:border-gold hover:text-gold sm:px-4"
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
                icon={WhatsAppIcon}
                title="WhatsApp"
                body={`+${SITE.phone.whatsapp} - text us anything`}
              />
              <Row icon={Mail} title="Email" body={SITE.email} />
              <Row
                icon={Clock}
                title="Hours"
                body="Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT"
              />
              <Row icon={MapPin} title="Office" body={SITE.address} />
            </ul>

            {/* Response promise */}
            <div className="rounded-2xl border border-border bg-secondary/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <div className="text-sm font-semibold">Rapid response guarantee</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    We reply promptly during opening hours: Mon–Fri 09:00–18:00 and Sat–Sun 09:00–16:00 GMT. Outside of these hours, we'll be in touch first thing the next morning.
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm min-h-72">
                <iframe
                  title="Luxonair London office"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1421%2C51.5045%2C-0.1186%2C51.5189&amp;layer=mapnik"
                  className="h-72 w-full"
                  loading="lazy"
                />
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=51.5117&mlon=-0.1304#map=15/51.5117/-0.1304"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                View on OpenStreetMap <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </aside>

          {/* Right: form */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 md:p-10">
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
  icon: React.ComponentType<{ className?: string }>;
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
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
