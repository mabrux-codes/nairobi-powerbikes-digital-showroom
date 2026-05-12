import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-bike.jpg";
import { PageShell } from "@/components/page-shell";
import { BikeCard } from "@/components/bike-card";
import { bikes, brands } from "@/data/bikes";
import { ShieldCheck, Truck, CreditCard, Wrench, Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nairobi Powerbikes — Ride Your Dream Machine" },
      { name: "description", content: "Premium sports bikes, naked bikes and adventure motorcycles in Kenya. Ducati, BMW, Yamaha, Kawasaki, KTM, Honda — verified imports with financing and nationwide delivery." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = bikes.slice(0, 3);
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[640px] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Superbike on a wet Nairobi road at dusk"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container-x">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-block px-3 py-1 bg-accent mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-foreground italic">
                High Performance Elite
              </span>
            </div>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter mb-8">
              Ride Your <br />
              <span className="text-stroke">Dream Machine</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-base md:text-lg mb-10 leading-relaxed">
              Nairobi's premier destination for high-performance superbikes and adventure motorcycles. Engineered for the bold.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/bikes"
                className="px-8 py-4 bg-foreground text-background font-bold uppercase text-sm tracking-widest hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Bikes
              </Link>
              <Link
                to="/book-ride"
                className="px-8 py-4 border border-border font-bold uppercase text-sm tracking-widest hover:bg-surface transition-colors"
              >
                Book a Test Ride
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-surface border-b border-border py-12">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "450+", l: "Bikes Delivered" },
            { v: "12", l: "Global Brands" },
            { v: "98%", l: "Happy Customers" },
            { v: "8", l: "Years In Business" },
          ].map((s, i) => (
            <div key={s.l} className="flex flex-col">
              <span className={`font-display text-4xl md:text-5xl ${i === 0 ? "text-accent" : ""}`}>
                {s.v}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BIKES */}
      <section className="py-24 container-x">
        <div className="flex flex-wrap gap-6 justify-between items-end mb-16">
          <div>
            <h2 className="font-display text-4xl md:text-5xl uppercase italic tracking-tighter">
              Current <span className="text-accent">Lineup</span>
            </h2>
            <p className="font-mono text-xs text-muted-foreground uppercase mt-2 tracking-widest">
              // Fresh in the paddock
            </p>
          </div>
          <Link
            to="/bikes"
            className="text-xs font-bold uppercase tracking-widest border-b border-accent pb-1 inline-flex items-center gap-2"
          >
            Explore Full Fleet <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featured.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface border-y border-border py-24">
        <div className="container-x">
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter mb-16 max-w-2xl">
            Why Riders <span className="text-accent">Choose Us</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              { icon: ShieldCheck, title: "Verified Imports", body: "Every bike comes with documented provenance and full ownership papers." },
              { icon: CreditCard, title: "Flexible Financing", body: "Tailored payment plans through our partner banks across Kenya." },
              { icon: Truck, title: "Nationwide Delivery", body: "Enclosed-trailer transport from Mombasa to Kisumu and beyond." },
              { icon: Wrench, title: "Pro Service", body: "Manufacturer-trained technicians and a full master service program." },
            ].map((f) => (
              <div key={f.title} className="bg-background p-8">
                <f.icon className="h-7 w-7 text-accent mb-6" />
                <h3 className="font-display text-xl uppercase tracking-tight mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-20 border-b border-border">
        <div className="container-x">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-10 text-center">
            // Manufacturers we represent
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {brands.map((b) => (
              <span key={b.name} className="font-display text-xl md:text-2xl tracking-widest italic uppercase">
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 container-x">
        <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter mb-16 max-w-2xl">
          What Riders <span className="text-accent">Say</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "James K.", bike: "Ducati Panigale V4", quote: "Smoothest import experience I've had. The bike arrived in immaculate condition and they handled every paper for me." },
            { name: "Aisha M.", bike: "BMW R 1250 GS", quote: "These guys understand bikes. The pre-purchase inspection was thorough and honest. I've sent three friends to them since." },
            { name: "Daniel O.", bike: "Kawasaki Z900", quote: "Financing was sorted in 48 hours. Test ride felt like a private clinic. Easy ten out of ten." },
          ].map((t) => (
            <div key={t.name} className="bg-surface border border-border p-8">
              <div className="flex gap-1 mb-6 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-8">"{t.quote}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-display text-lg uppercase tracking-tight">{t.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{t.bike}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-accent py-24 text-center overflow-hidden relative">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 font-display text-[20vw] whitespace-nowrap leading-none select-none translate-y-12 pointer-events-none"
        >
          ADRENALINE ADRENALINE
        </div>
        <div className="relative z-10 container-x">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-8 text-accent-foreground">
            Ready to <span className="text-background">Ascend?</span>
          </h2>
          <p className="text-accent-foreground/80 max-w-xl mx-auto mb-10">
            Schedule a private viewing or test ride at our Nairobi showroom today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/book-ride"
              className="bg-background text-foreground px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="border-2 border-background text-background px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-background hover:text-accent transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
