import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/bikes", label: "Inventory" },
  { to: "/brands", label: "Brands" },
  { to: "/about", label: "About" },
  { to: "/book-ride", label: "Test Ride" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-x h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-display text-2xl tracking-tighter uppercase italic leading-none">
            Nairobi<span className="text-accent">Power</span>
          </Link>
          <div className="hidden md:flex gap-7 text-xs font-semibold uppercase tracking-widest">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-accent transition-colors"
                activeProps={{ className: "text-accent" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/book-ride"
            className="hidden md:inline-block bg-accent text-accent-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
          >
            Book Test Ride
          </Link>
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold uppercase tracking-widest hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book-ride"
              onClick={() => setOpen(false)}
              className="bg-accent text-accent-foreground text-center px-6 py-3 text-xs font-bold uppercase tracking-widest mt-2"
            >
              Book Test Ride
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
