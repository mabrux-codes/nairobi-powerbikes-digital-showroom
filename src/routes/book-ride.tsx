import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { fetchPublishedBikes } from "@/lib/queries";
import type { Bike } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/book-ride")({
  validateSearch: (s: Record<string, unknown>) => ({
    bike: typeof s.bike === "string" ? s.bike : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Test Ride — Nairobi Powerbikes" },
      { name: "description", content: "Schedule a private test ride at our Nairobi showroom. Pick your bike, date, and time." },
      { property: "og:title", content: "Book a Test Ride — Nairobi Powerbikes" },
      { property: "og:description", content: "Schedule a private test ride in Nairobi." },
    ],
  }),
  component: BookRidePage,
});

function BookRidePage() {
  const { bike: preselected } = Route.useSearch();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchPublishedBikes().then(setBikes).catch(() => {}); }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const bikeId = String(fd.get("bike_id") ?? "");
    const bike = bikes.find((b) => b.id === bikeId);

    const file = fd.get("license") as File | null;
    if (file && file.size > 0) {
      const MAX = 10 * 1024 * 1024;
      const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (file.size > MAX) {
        toast.error("License file must be 10MB or smaller.");
        return;
      }
      if (!ALLOWED.includes(file.type)) {
        toast.error("License must be a JPG, PNG, WEBP, or PDF.");
        return;
      }
    }

    setSubmitting(true);

    let licenseUrl: string | null = null;
    if (file && file.size > 0) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      const path = `public/${crypto.randomUUID()}-${safeName}`;
      const up = await supabase.storage.from("test-ride-licenses").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (!up.error) {
        licenseUrl = up.data.path;
      }
    }

    const { error } = await supabase.from("test_rides").insert({
      bike_id: bike?.id ?? null,
      bike_name: bike?.name ?? null,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      preferred_date: String(fd.get("preferred_date") ?? ""),
      preferred_time: String(fd.get("preferred_time") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      license_url: licenseUrl,
    }).select("id").maybeSingle();

    if (error) {
      toast.error("Couldn't save your booking. Try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Test Ride</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-3xl leading-[0.95]">
            Schedule a <span className="text-accent">private session.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mt-6">
            Bring your license. We'll handle the rest. Confirmation sent to your inbox within minutes.
          </p>
        </div>
      </section>

      <section className="py-16 container-x max-w-3xl">
        {submitted ? (
          <div className="border border-accent bg-accent/10 p-8">
            <h2 className="font-display text-2xl uppercase tracking-tight mb-3">Booking confirmed</h2>
            <p className="text-muted-foreground">
              We've received your request and emailed you a confirmation. A team member will call to finalize details.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-5">
            <Field label="Select Bike">
              <select name="bike_id" required defaultValue={preselected ?? ""} className="form-input">
                <option value="" disabled>Choose a bike...</option>
                {bikes.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preferred Date"><input name="preferred_date" required type="date" className="form-input" /></Field>
              <Field label="Preferred Time"><input name="preferred_time" required type="time" className="form-input" /></Field>
            </div>
            <Field label="Full Name"><input name="name" required className="form-input" /></Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone"><input name="phone" required type="tel" className="form-input" /></Field>
              <Field label="Email"><input name="email" required type="email" className="form-input" /></Field>
            </div>
            <Field label="Driver's License (Upload)">
              <input name="license" type="file" accept="image/*,.pdf" className="form-input file:bg-surface file:border-0 file:text-foreground file:px-3 file:py-1 file:mr-3 file:font-mono file:text-[10px] file:uppercase file:tracking-widest" />
            </Field>
            <Field label="Additional Notes">
              <textarea name="notes" rows={3} className="form-input resize-none" placeholder="Anything we should know?" />
            </Field>
            <button type="submit" disabled={submitting} className="bg-accent text-accent-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors mt-4 justify-self-start disabled:opacity-50">
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
            <style>{`.form-input{width:100%;background:var(--background);border:1px solid var(--border);padding:0.75rem 1rem;font-size:0.875rem;outline:none;font-family:inherit;color:inherit}.form-input:focus{border-color:var(--accent)}`}</style>
          </form>
        )}
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
