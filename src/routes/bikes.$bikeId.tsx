import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { BikeCard } from "@/components/bike-card";
import { bikes, formatKES } from "@/data/bikes";
import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/bikes/$bikeId")({
  loader: ({ params }) => {
    const bike = bikes.find((b) => b.id === params.bikeId);
    if (!bike) throw notFound();
    return { bike };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.bike;
    return {
      meta: [
        { title: b ? `${b.name} — Nairobi Powerbikes` : "Bike — Nairobi Powerbikes" },
        { name: "description", content: b ? `${b.name} available at Nairobi Powerbikes. ${b.engine}cc, ${b.power}, ${b.condition}. ${formatKES(b.price)}.` : "" },
        { property: "og:title", content: b ? `${b.name} — Nairobi Powerbikes` : "" },
        { property: "og:description", content: b?.description ?? "" },
        { property: "og:image", content: b?.image ?? "" },
      ],
    };
  },
  component: BikeDetailPage,
});

function BikeDetailPage() {
  const { bike } = Route.useLoaderData();
  const similar = bikes.filter((b) => b.id !== bike.id && b.type === bike.type).slice(0, 3);

  return (
    <PageShell>
      <section className="border-b border-border">
        <div className="container-x py-12 grid lg:grid-cols-2 gap-12">
          <div className="bg-surface border border-border aspect-[4/5] overflow-hidden">
            <img
              src={bike.image}
              alt={bike.name}
              width={800}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
              // {bike.brand} / {bike.type}
            </p>
            <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-[0.95] mb-6">
              {bike.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">{bike.description}</p>
            <p className="font-display text-5xl text-accent mb-8">{formatKES(bike.price)}</p>

            <dl className="grid grid-cols-2 gap-px bg-border border border-border mb-10">
              {[
                ["Engine", `${bike.engine} cc`],
                ["Power", bike.power],
                ["Year", bike.year.toString()],
                ["Mileage", bike.mileage],
                ["Condition", bike.condition],
                ["Transmission", bike.transmission],
              ].map(([k, v]) => (
                <div key={k} className="bg-background p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                  <dd className="font-display text-lg uppercase tracking-tight mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/book-ride"
                search={{ bike: bike.id }}
                className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
              >
                Book Test Ride
              </Link>
              <a
                href="#inquiry"
                className="border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface transition-colors"
              >
                Send Inquiry
              </a>
              <a
                href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi, I'm interested in the ${bike.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 container-x">
        <h2 className="font-display text-3xl uppercase tracking-tight mb-8">Features</h2>
        <ul className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {bike.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-foreground/90">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="bg-surface border-y border-border py-16">
        <div className="container-x max-w-2xl">
          <h2 className="font-display text-3xl uppercase tracking-tight mb-2">Send an Inquiry</h2>
          <p className="text-muted-foreground text-sm mb-8">We'll get back to you within 24 hours.</p>
          <InquiryForm bikeName={bike.name} />
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="py-20 container-x">
          <h2 className="font-display text-3xl uppercase tracking-tight mb-10">Similar Machines</h2>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {similar.map((b) => <BikeCard key={b.id} bike={b} />)}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function InquiryForm({ bikeName }: { bikeName: string }) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="border border-accent bg-accent/10 p-6 text-sm">
        Thanks — your inquiry has been received. Our team will reach out shortly.
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="grid gap-4"
    >
      <Field label="Name"><input required className="form-input" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone"><input required type="tel" className="form-input" /></Field>
        <Field label="Email"><input required type="email" className="form-input" /></Field>
      </div>
      <Field label="Bike of Interest">
        <input defaultValue={bikeName} className="form-input" />
      </Field>
      <Field label="Message">
        <textarea rows={4} className="form-input resize-none" placeholder="Tell us what you'd like to know..." />
      </Field>
      <button
        type="submit"
        className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors mt-2 justify-self-start"
      >
        Send Inquiry
      </button>
      <style>{`.form-input{width:100%;background:var(--background);border:1px solid var(--border);padding:0.75rem 1rem;font-size:0.875rem;outline:none;font-family:inherit;color:inherit}.form-input:focus{border-color:var(--accent)}`}</style>
    </form>
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
