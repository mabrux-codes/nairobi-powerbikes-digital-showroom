import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { BikeCard } from "@/components/bike-card";
import { useWishlist } from "@/hooks/use-local-list";
import { fetchBikesByIds } from "@/lib/queries";
import type { Bike } from "@/lib/types";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Nairobi Powerbikes" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, clear } = useWishlist();
  const [bikes, setBikes] = useState<Bike[]>([]);
  useEffect(() => { fetchBikesByIds(items).then(setBikes); }, [items]);

  return (
    <PageShell>
      <section className="border-b border-border py-20">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// Saved</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Your <span className="text-accent">wishlist.</span></h1>
        </div>
      </section>
      <section className="py-16 container-x">
        {bikes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">No bikes saved yet.</p>
            <Link to="/bikes" className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest">Browse Inventory</Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{bikes.length} saved</p>
              <button onClick={clear} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">Clear all</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {bikes.map((b) => <BikeCard key={b.id} bike={b} />)}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
