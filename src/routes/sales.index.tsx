import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/sales/")({ component: SalesOverview });

function SalesOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ inq: 0, inqNew: 0, rides: 0, ridesPending: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [i, iN, r, rP] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("assigned_to", user.id),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("assigned_to", user.id).eq("status", "new"),
        supabase.from("test_rides").select("id", { count: "exact", head: true }).eq("assigned_to", user.id),
        supabase.from("test_rides").select("id", { count: "exact", head: true }).eq("assigned_to", user.id).eq("status", "pending"),
      ]);
      setStats({ inq: i.count ?? 0, inqNew: iN.count ?? 0, rides: r.count ?? 0, ridesPending: rP.count ?? 0 });
    })();
  }, [user]);

  const cards = [
    { label: "My Inquiries", value: stats.inq, sub: `${stats.inqNew} new`, to: "/sales/inquiries" },
    { label: "My Test Rides", value: stats.rides, sub: `${stats.ridesPending} pending`, to: "/sales/test-rides" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">My Leads</h1>
      <div className="grid sm:grid-cols-2 gap-px bg-border border border-border max-w-2xl">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-background p-6 hover:bg-surface transition-colors">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="font-display text-5xl mt-3">{c.value}</p>
            <p className="text-xs text-accent font-mono mt-2">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
