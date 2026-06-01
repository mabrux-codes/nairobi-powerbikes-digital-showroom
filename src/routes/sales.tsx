import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, MessageSquare, CalendarCheck, LogOut, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/sales")({ component: SalesLayout });

function SalesLayout() {
  const { user, isAdmin, isSalesperson, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  if (!isSalesperson && !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl uppercase mb-4">Access denied</h1>
          <p className="text-muted-foreground mb-6">Your account doesn't have salesperson access.</p>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-display text-xl uppercase italic tracking-tighter">Nairobi<span className="text-accent">Power</span></Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Sales Dashboard</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 text-sm">
          <NavLink to="/sales" icon={LayoutDashboard} label="My Leads" exact />
          <NavLink to="/sales/inquiries" icon={MessageSquare} label="Inquiries" />
          <NavLink to="/sales/test-rides" icon={CalendarCheck} label="Test Rides" />
        </nav>
        <div className="p-3 border-t border-border flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}

function NavLink({ to, icon: Icon, label, exact }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; exact?: boolean }) {
  return (
    <Link to={to} activeOptions={{ exact: !!exact }} className="flex items-center gap-3 px-3 py-2 hover:bg-background transition-colors"
      activeProps={{ className: "bg-background text-accent" }}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
