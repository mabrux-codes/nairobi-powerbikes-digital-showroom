import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteSettings } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nairobi Powerbikes" },
      { name: "description", content: "Visit our Nairobi showroom or reach our team by phone, email, or WhatsApp." },
      { property: "og:title", content: "Contact Nairobi Powerbikes" },
      { property: "og:description", content: "Get in touch with Kenya's premier superbike dealership." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [s, setS] = useState<SiteSettings | null>(null);
  useEffect(() => { fetchSiteSettings().then(setS).catch(() => {}); }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? "") || null,
      subject: String(fd.get("subject") ?? "") || null,
      message: String(fd.get("message") ?? ""),
    });
    setSubmitting(false);
    if (error) { toast.error("Couldn't send. Try again."); return; }
    setSent(true);
  };

  const phone = s?.contact_phone ?? "+254 700 000 000";
  const email = s?.contact_email ?? "sales@nairobipower.co.ke";
  const wa = s?.whatsapp_number ?? "254700000000";

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Contact</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-3xl leading-[0.95]">
            Stop by, ring, or <span className="text-accent">message us.</span>
          </h1>
        </div>
      </section>

      <section className="py-16 container-x grid lg:grid-cols-2 gap-12">
        <div>
          <div className="space-y-6 mb-10">
            <ContactRow icon={MapPin} label="Showroom">Enterprise Road, Industrial Area<br />Nairobi, Kenya</ContactRow>
            <ContactRow icon={Phone} label="Phone"><a href={`tel:${phone}`} className="hover:text-accent">{phone}</a></ContactRow>
            <ContactRow icon={Mail} label="Email"><a href={`mailto:${email}`} className="hover:text-accent">{email}</a></ContactRow>
            <ContactRow icon={MessageCircle} label="WhatsApp">
              <a href={`https://wa.me/${wa.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{wa}</a>
            </ContactRow>
          </div>
          <div className="aspect-video border border-border overflow-hidden">
            <iframe title="Nairobi Powerbikes location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.83%2C-1.32%2C36.87%2C-1.28&layer=mapnik"
              className="w-full h-full" loading="lazy" />
          </div>
        </div>

        <div className="bg-surface border border-border p-8">
          {sent ? (
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight mb-3">Message sent</h2>
              <p className="text-muted-foreground">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5">
              <h2 className="font-display text-2xl uppercase tracking-tight mb-2">Send Message</h2>
              <Field label="Name"><input name="name" required className="form-input" /></Field>
              <Field label="Email"><input name="email" required type="email" className="form-input" /></Field>
              <Field label="Phone"><input name="phone" type="tel" className="form-input" /></Field>
              <Field label="Subject"><input name="subject" className="form-input" /></Field>
              <Field label="Message"><textarea name="message" rows={5} required className="form-input resize-none" /></Field>
              <button type="submit" disabled={submitting}
                className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors mt-2 justify-self-start disabled:opacity-50">
                {submitting ? "Sending..." : "Send Message"}
              </button>
              <style>{`.form-input{width:100%;background:var(--background);border:1px solid var(--border);padding:0.75rem 1rem;font-size:0.875rem;outline:none;font-family:inherit;color:inherit}.form-input:focus{border-color:var(--accent)}`}</style>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 grid place-items-center bg-surface border border-border flex-shrink-0">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <div className="text-foreground/90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
