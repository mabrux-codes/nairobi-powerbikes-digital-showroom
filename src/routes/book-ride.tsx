import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { bikes } from "@/data/bikes";

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
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Test Ride</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-3xl leading-[0.95]">
            Schedule a <span className="text-accent">private session.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mt-6">
            Bring your license. We'll handle the rest. Confirmation by email and SMS within minutes.
          </p>
        </div>
      </section>

      <section className="py-16 container-x max-w-3xl">
        {submitted ? (
          <div className="border border-accent bg-accent/10 p-8">
            <h2 className="font-display text-2xl uppercase tracking-tight mb-3">Booking confirmed</h2>
            <p className="text-muted-foreground">
              We've received your request. A team member will call you within the next hour to finalize details.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="grid gap-5"
          >
            <Field label="Select Bike">
              <select required defaultValue={preselected ?? ""} className="form-input">
                <option value="" disabled>Choose a bike...</option>
                {bikes.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preferred Date"><input required type="date" className="form-input" /></Field>
              <Field label="Preferred Time"><input required type="time" className="form-input" /></Field>
            </div>
            <Field label="Full Name"><input required className="form-input" /></Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone"><input required type="tel" className="form-input" /></Field>
              <Field label="Email"><input required type="email" className="form-input" /></Field>
            </div>
            <Field label="Driver's License (Upload)">
              <input type="file" accept="image/*,.pdf" className="form-input file:bg-surface file:border-0 file:text-foreground file:px-3 file:py-1 file:mr-3 file:font-mono file:text-[10px] file:uppercase file:tracking-widest" />
            </Field>
            <Field label="Additional Notes">
              <textarea rows={3} className="form-input resize-none" placeholder="Anything we should know?" />
            </Field>
            <button
              type="submit"
              className="bg-accent text-accent-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors mt-4 justify-self-start"
            >
              Confirm Booking
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
