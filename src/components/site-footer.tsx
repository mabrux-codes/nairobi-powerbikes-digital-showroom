import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="container-x grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-3xl tracking-tighter uppercase italic block mb-6">
            Nairobi<span className="text-accent">Power</span>
          </Link>
          <p className="text-muted-foreground max-w-sm mb-6">
            The ultimate hub for premium motorcycles in East Africa. From the track to the trail, we deliver the machines that define your legacy.
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="WhatsApp" className="hover:text-accent"><MessageCircle className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-accent"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6">Directory</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/bikes" className="hover:text-accent">Inventory</Link></li>
            <li><Link to="/brands" className="hover:text-accent">Brands</Link></li>
            <li><Link to="/book-ride" className="hover:text-accent">Test Ride</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6">Showroom</h4>
          <p className="text-sm text-muted-foreground italic mb-2">Enterprise Road, Industrial Area</p>
          <p className="text-sm text-muted-foreground mb-4">Nairobi, Kenya</p>
          <p className="font-display text-xl">+254 700 000 000</p>
          <p className="text-xs text-muted-foreground mt-2">sales@nairobipower.co.ke</p>
        </div>
      </div>
      <div className="container-x pt-10 border-t border-border flex flex-col md:flex-row justify-between gap-4">
        <p className="font-mono text-[10px] text-muted-foreground uppercase">
          © {new Date().getFullYear()} Nairobi Powerbikes. Precision engineered.
        </p>
        <div className="flex gap-6 font-mono text-[10px] text-muted-foreground uppercase">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Warranty</a>
        </div>
      </div>
    </footer>
  );
}
