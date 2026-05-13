import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const [stats, setStats] = useState({ bikes: 0, published: 0, inquiries: 0, newInquiries: 0, rides: 0, pendingRides: 0 });
  useEffect(() => {
    (async () => {
      const [b, bp, i, iN, r, rP] = await Promise.all([
        supabase.from("bikes").select("id", { count: "exact", head: true }),
        supabase.from("bikes").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("test_rides").select("id", { count: "exact", head: true }),
        supabase.from("test_rides").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        bikes: b.count ?? 0, published: bp.count ?? 0,
        inquiries: i.count ?? 0, newInquiries: iN.count ?? 0,
        rides: r.count ?? 0, pendingRides: rP.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Total Bikes", value: stats.bikes, sub: `${stats.published} published` },
    { label: "Inquiries", value: stats.inquiries, sub: `${stats.newInquiries} new` },
    { label: "Test Rides", value: stats.rides, sub: `${stats.pendingRides} pending` },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-px bg-border border border-border">
        {cards.map((c) => (
          <div key={c.label} className="bg-background p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="font-display text-5xl mt-3">{c.value}</p>
            <p className="text-xs text-accent font-mono mt-2">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
