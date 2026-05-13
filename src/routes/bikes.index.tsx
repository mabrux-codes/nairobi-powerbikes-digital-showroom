import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { BikeCard } from "@/components/bike-card";
import { fetchPublishedBikes } from "@/lib/queries";
import type { Bike } from "@/lib/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/bikes/")({
  head: () => ({
    meta: [
      { title: "Inventory — Nairobi Powerbikes" },
      { name: "description", content: "Browse our full inventory of premium sports bikes, naked bikes and adventure motorcycles in Kenya." },
      { property: "og:title", content: "Inventory — Nairobi Powerbikes" },
      { property: "og:description", content: "Browse premium superbikes available at Nairobi Powerbikes." },
    ],
  }),
  component: BikesPage,
});

const brandsList = ["All", "Ducati", "BMW", "Yamaha", "Kawasaki", "KTM", "Honda", "Suzuki", "Aprilia"] as const;
const types = ["All", "Sport", "Naked", "Adventure", "Touring"] as const;
const conditions = ["All", "Brand New", "Certified Pre-Owned", "Pre-Owned"] as const;

function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<(typeof brandsList)[number]>("All");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [condition, setCondition] = useState<(typeof conditions)[number]>("All");

  useEffect(() => { fetchPublishedBikes().then(setBikes).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    return bikes.filter((b) => {
      if (brand !== "All" && !b.brand.toLowerCase().includes(brand.toLowerCase())) return false;
      if (type !== "All" && b.type !== type) return false;
      if (condition !== "All" && b.condition !== condition) return false;
      if (q && !`${b.name} ${b.brand}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [bikes, q, brand, type, condition]);

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Inventory</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-4xl leading-[0.95]">
            The full <span className="text-accent">paddock.</span>
          </h1>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-6 sticky top-20 z-30 backdrop-blur-md">
        <div className="container-x flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-background border border-border px-4 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bikes..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <Select value={brand} onChange={setBrand} options={brandsList} label="Brand" />
          <Select value={type} onChange={setType} options={types} label="Type" />
          <Select value={condition} onChange={setCondition} options={conditions} label="Condition" />
        </div>
      </section>

      <section className="py-16 container-x">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-10">
          {filtered.length} {filtered.length === 1 ? "machine" : "machines"} available
        </p>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center">No bikes match your filters. Try widening your search.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((b) => <BikeCard key={b.id} bike={b} />)}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Select<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: readonly T[]; label: string; }) {
  return (
    <label className="flex items-center gap-2 bg-background border border-border px-3 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="bg-transparent outline-none text-sm font-semibold">
        {options.map((o) => <option key={o} value={o} className="bg-background">{o}</option>)}
      </select>
    </label>
  );
}
