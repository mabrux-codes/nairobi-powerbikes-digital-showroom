import { Link } from "@tanstack/react-router";
import { Heart, GitCompare } from "lucide-react";
import { type Bike, formatKES } from "@/lib/types";
import { resolveBikeImage } from "@/lib/bike-image";
import { useWishlist, useCompare } from "@/hooks/use-local-list";
import { toast } from "sonner";

export function BikeCard({ bike }: { bike: Bike }) {
  const wishlist = useWishlist();
  const compare = useCompare();
  const inWishlist = wishlist.has(bike.id);
  const inCompare = compare.has(bike.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    wishlist.toggle(bike.id);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };
  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCompare && compare.items.length >= 4) {
      toast.error("You can compare up to 4 bikes");
      return;
    }
    compare.toggle(bike.id);
    toast(inCompare ? "Removed from compare" : "Added to compare");
  };

  return (
    <div className="group block">
      <Link to="/bikes/$bikeId" params={{ bikeId: bike.slug }}>
        <div className="relative aspect-[4/5] bg-surface mb-6 overflow-hidden border border-border group-hover:border-accent/50 transition-colors">
          {bike.badge && (
            <div className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 uppercase italic">
              {bike.badge}
            </div>
          )}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              onClick={toggleWishlist}
              aria-label="Toggle wishlist"
              className={`p-2 backdrop-blur-md border transition-colors ${inWishlist ? "bg-accent border-accent text-accent-foreground" : "bg-background/60 border-border hover:border-accent"}`}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={toggleCompare}
              aria-label="Toggle compare"
              className={`p-2 backdrop-blur-md border transition-colors ${inCompare ? "bg-accent border-accent text-accent-foreground" : "bg-background/60 border-border hover:border-accent"}`}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>
          <img
            src={resolveBikeImage(bike.slug, bike.image)}
            alt={bike.name}
            loading="lazy"
            width={800}
            height={1024}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between items-end">
            <div className="font-mono text-[10px] text-white/70 leading-relaxed">
              <p>{bike.engine} CC</p>
              <p>{bike.power}</p>
            </div>
            <p className="font-display text-2xl text-white">{formatKES(bike.price)}</p>
          </div>
        </div>
        <h3 className="font-display text-2xl uppercase tracking-tight">{bike.name}</h3>
        <p className="text-muted-foreground text-sm font-mono mt-1 uppercase">
          {bike.condition} / {bike.year}
        </p>
      </Link>
    </div>
  );
}
