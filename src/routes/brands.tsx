import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { brands, bikes } from "@/data/bikes";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Our Brands — Nairobi Powerbikes" },
      { name: "description", content: "Yamaha, Honda, Kawasaki, Ducati, BMW Motorrad, KTM, Suzuki, Aprilia — the world's premier motorcycle manufacturers, available in Nairobi." },
      { property: "og:title", content: "Our Brands — Nairobi Powerbikes" },
      { property: "og:description", content: "Premium motorcycle manufacturers available at Nairobi Powerbikes." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <PageShell>
      <section className="border-b border-border py-24">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Manufacturers</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-4xl leading-[0.95]">
            Eight legendary <span className="text-accent">brands.</span> One showroom.
          </h1>
        </div>
      </section>

      <section className="py-20 container-x">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {brands.map((b) => {
            const count = bikes.filter((bike) => bike.brand.toLowerCase().includes(b.name.toLowerCase().split(" ")[0])).length;
            return (
              <div key={b.name} className="bg-background p-8 group hover:bg-surface transition-colors">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                  {count > 0 ? `${count} model${count > 1 ? "s" : ""} available` : "Available on order"}
                </p>
                <h2 className="font-display text-3xl uppercase tracking-tight italic group-hover:text-accent transition-colors">
                  {b.name}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-8">{b.description}</p>
                <Link
                  to="/bikes"
                  className="text-xs font-bold uppercase tracking-widest border-b border-accent pb-1 inline-flex items-center gap-2"
                >
                  View Models <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
