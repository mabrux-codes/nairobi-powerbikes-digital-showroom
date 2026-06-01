import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/types";

export const Route = createFileRoute("/admin/")({ component: Overview });

type BestSeller = { bike_name: string; units: number; revenue: number };
type LowStock = { id: string; name: string; stock_quantity: number };

function Overview() {
  const [stats, setStats] = useState({
    bikes: 0, published: 0,
    inquiries: 0, newInquiries: 0,
    rides: 0, pendingRides: 0,
    contactMsgs: 0, newContactMsgs: 0,
    sales: 0, salesRevenue: 0,
  });
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [lowStock, setLowStock] = useState<LowStock[]>([]);

  useEffect(() => {
    (async () => {
      const [b, bp, i, iN, r, rP, cm, cmN, sAll, lowS] = await Promise.all([
        supabase.from("bikes").select("id", { count: "exact", head: true }),
        supabase.from("bikes").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("test_rides").select("id", { count: "exact", head: true }),
        supabase.from("test_rides").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("sales").select("sale_price, bike_name"),
        supabase.from("bikes").select("id, name, stock_quantity").lte("stock_quantity", 2).order("stock_quantity", { ascending: true }).limit(6),
      ]);

      const salesRows = (sAll.data ?? []) as { sale_price: number; bike_name: string }[];
      const revenue = salesRows.reduce((acc, s) => acc + Number(s.sale_price || 0), 0);
      const grouped = new Map<string, { units: number; revenue: number }>();
      salesRows.forEach((s) => {
        const cur = grouped.get(s.bike_name) ?? { units: 0, revenue: 0 };
        cur.units += 1; cur.revenue += Number(s.sale_price || 0);
        grouped.set(s.bike_name, cur);
      });
      const best = [...grouped.entries()]
        .map(([bike_name, v]) => ({ bike_name, ...v }))
        .sort((a, b) => b.units - a.units).slice(0, 5);

      setStats({
        bikes: b.count ?? 0, published: bp.count ?? 0,
        inquiries: i.count ?? 0, newInquiries: iN.count ?? 0,
        rides: r.count ?? 0, pendingRides: rP.count ?? 0,
        contactMsgs: cm.count ?? 0, newContactMsgs: cmN.count ?? 0,
        sales: salesRows.length, salesRevenue: revenue,
      });
      setBestSellers(best);
      setLowStock((lowS.data ?? []) as LowStock[]);
    })();
  }, []);

  const cards = [
    { label: "Total Bikes", value: stats.bikes, sub: `${stats.published} published`, to: "/admin/bikes" },
    { label: "Inquiries", value: stats.inquiries, sub: `${stats.newInquiries} new`, to: "/admin/inquiries" },
    { label: "Test Rides", value: stats.rides, sub: `${stats.pendingRides} pending`, to: "/admin/test-rides" },
    { label: "Contact Messages", value: stats.contactMsgs, sub: `${stats.newContactMsgs} new`, to: "/admin/contact-messages" },
    { label: "Sales", value: stats.sales, sub: formatKES(stats.salesRevenue), to: "/admin/sales" },
  ];

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-tight mb-8">Dashboard</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="bg-background p-6 hover:bg-surface transition-colors">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <p className="font-display text-4xl mt-3">{c.value}</p>
              <p className="text-xs text-accent font-mono mt-2 truncate">{c.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="border border-border">
          <header className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg uppercase tracking-tight">Best sellers</h2>
            <Link to="/admin/sales" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-accent">Manage →</Link>
          </header>
          {bestSellers.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">No sales recorded yet. Log a sale in the Sales page.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                <tr><th className="p-3">Bike</th><th className="p-3">Units</th><th className="p-3">Revenue</th></tr>
              </thead>
              <tbody>
                {bestSellers.map((b) => (
                  <tr key={b.bike_name} className="border-t border-border">
                    <td className="p-3">{b.bike_name}</td>
                    <td className="p-3 font-display text-lg">{b.units}</td>
                    <td className="p-3 text-accent">{formatKES(b.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="border border-border">
          <header className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg uppercase tracking-tight">Low stock</h2>
            <Link to="/admin/bikes" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-accent">Manage →</Link>
          </header>
          {lowStock.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">All bikes have healthy stock levels.</p>
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.map((s) => (
                <li key={s.id} className="p-4 flex items-center justify-between">
                  <Link to="/admin/bikes/$id" params={{ id: s.id }} className="hover:text-accent">{s.name}</Link>
                  <span className={`text-xs font-mono uppercase tracking-widest px-2 py-1 ${s.stock_quantity === 0 ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>
                    {s.stock_quantity === 0 ? "Out of stock" : `${s.stock_quantity} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
