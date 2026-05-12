import { Link } from "@tanstack/react-router";
import { type Bike, formatKES } from "@/data/bikes";

export function BikeCard({ bike }: { bike: Bike }) {
  return (
    <Link
      to="/bikes/$bikeId"
      params={{ bikeId: bike.id }}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-surface mb-6 overflow-hidden border border-border group-hover:border-accent/50 transition-colors">
        {bike.badge && (
          <div className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 uppercase italic">
            {bike.badge}
          </div>
        )}
        <img
          src={bike.image}
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
  );
}
