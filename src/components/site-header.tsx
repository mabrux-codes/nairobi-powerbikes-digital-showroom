import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Heart, GitCompare, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist, useCompare } from "@/hooks/use-local-list";
import { fetchSiteSettings } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";

const links = [
  { to: "/bikes", label: "Inventory" },
  { to: "/brands", label: "Brands" },
  { to: "/about", label: "About" },
  { to: "/book-ride", label: "Test Ride" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { isAdmin } = useAuth();
  const wishlist = useWishlist();
  const compare = useCompare();

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-x h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 leading-none">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto object-contain" />
            ) : (
              <span className="font-display text-2xl tracking-tighter uppercase italic">
                Nairobi<span className="text-accent">Power</span>
              </span>
            )}
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
        <div className="flex items-center gap-2">
          <Link to="/wishlist" aria-label="Wishlist" className="relative p-2 hover:text-accent transition-colors">
            <Heart className="h-4 w-4" />
            {wishlist.items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlist.items.length}
              </span>
            )}
          </Link>
          <Link to="/compare" aria-label="Compare" className="relative p-2 hover:text-accent transition-colors">
            <GitCompare className="h-4 w-4" />
            {compare.items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {compare.items.length}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link to="/admin" aria-label="Admin" className="p-2 hover:text-accent transition-colors">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          )}
          <Link
            to="/book-ride"
            className="hidden md:inline-block ml-2 bg-accent text-accent-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
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
