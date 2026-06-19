import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Luxonair — Phone, WhatsApp & UK office" },
      { name: "description", content: "Speak directly to a UK travel consultant. Phone, WhatsApp, email, or visit our London office. No queue, no call centre." },
      { property: "og:title", content: "Contact Luxonair" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <div className="container-page grid gap-12 py-12 md:py-20 lg:grid-cols-[1fr_1.2fr]">
      <aside>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Talk to a real consultant.
        </h1>
        <p className="mt-3 text-muted-foreground">
          One human owns your enquiry from first message to return flight. No automated routing, no offshore call centre.
        </p>

        <ul className="mt-8 space-y-4 text-sm">
          <Row icon={Phone} title="Call us" body="0800 [PLACEHOLDER]" />
          <Row icon={MessageCircle} title="WhatsApp" body="+44 [PLACEHOLDER] — text us anything" />
          <Row icon={Mail} title="Email" body="hello@luxonair.example" />
          <Row icon={Clock} title="Hours" body="Mon–Fri 09:00–19:00 GMT · 24/7 support while travelling" />
          <Row icon={MapPin} title="Office" body="[PLACEHOLDER] London, United Kingdom" />
        </ul>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Luxonair London office"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1421%2C51.5045%2C-0.1186%2C51.5189&amp;layer=mapnik"
            className="h-72 w-full"
            loading="lazy"
          />
        </div>
      </aside>

      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        {done ? (
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold">Got it — we'll be in touch.</h2>
            <p className="mt-3 text-muted-foreground">A consultant replies within 4 working hours.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="grid gap-4"
          >
            <h2 className="font-display text-2xl font-semibold">Send a message</h2>
            <p className="text-sm text-muted-foreground">For full trip enquiries, the <a className="underline" href="/quote">structured quote form</a> is faster.</p>
            <Field label="Your name"><input required name="name" className="input-field" /></Field>
            <Field label="Email"><input required type="email" name="email" className="input-field" /></Field>
            <Field label="Phone (optional)"><input name="phone" className="input-field" /></Field>
            <Field label="Topic">
              <select name="topic" className="input-field">
                <option>General enquiry</option>
                <option>Existing booking</option>
                <option>Corporate account</option>
                <option>Press / media</option>
              </select>
            </Field>
            <Field label="Message">
              <textarea required name="message" rows={5} className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </Field>
            <Button type="submit" size="lg">Send message</Button>
          </form>
        )}
      </section>
    </div>
  );
}

function Row({ icon: Icon, title, body }: { icon: typeof Phone; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground">{body}</div>
      </div>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
