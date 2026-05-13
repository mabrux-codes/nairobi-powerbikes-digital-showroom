import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useCompare } from "@/hooks/use-local-list";
import { fetchBikesByIds } from "@/lib/queries";
import { formatKES, type Bike } from "@/lib/types";
import { resolveBikeImage } from "@/lib/bike-image";
import { X } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare Bikes — Nairobi Powerbikes" }] }),
  component: ComparePage,
});

const SPECS: { label: string; get: (b: Bike) => string | number }[] = [
  { label: "Brand", get: (b) => b.brand },
  { label: "Type", get: (b) => b.type },
  { label: "Price", get: (b) => formatKES(b.price) },
  { label: "Engine", get: (b) => `${b.engine} cc` },
  { label: "Power", get: (b) => b.power },
  { label: "Year", get: (b) => b.year },
  { label: "Mileage", get: (b) => b.mileage },
  { label: "Condition", get: (b) => b.condition },
  { label: "Transmission", get: (b) => b.transmission },
];

function ComparePage() {
  const { items, remove, clear } = useCompare();
  const [bikes, setBikes] = useState<Bike[]>([]);
  useEffect(() => { fetchBikesByIds(items).then(setBikes); }, [items]);

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Compare</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Side <span className="text-accent">by side.</span></h1>
        </div>
      </section>
      <section className="py-12 container-x">
        {bikes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">Add bikes to compare from any bike card.</p>
            <Link to="/bikes" className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest">Browse Inventory</Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={clear} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">Clear all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr>
                    <th className="bg-surface p-4 text-left w-40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Spec</th>
                    {bikes.map((b) => (
                      <th key={b.id} className="bg-surface p-4 text-left min-w-[200px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <img src={resolveBikeImage(b.slug, b.image)} alt={b.name} className="h-32 w-full object-cover mb-2" />
                            <Link to="/bikes/$bikeId" params={{ bikeId: b.slug }} className="font-display text-base uppercase hover:text-accent">{b.name}</Link>
                          </div>
                          <button onClick={() => remove(b.id)} className="p-1"><X className="h-4 w-4" /></button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPECS.map((s) => (
                    <tr key={s.label} className="border-t border-border">
                      <td className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/40">{s.label}</td>
                      {bikes.map((b) => <td key={b.id} className="p-4">{s.get(b)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
