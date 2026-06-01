import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bike, Sale } from "@/lib/types";
import { formatKES } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/sales")({ component: SalesAdmin });

const empty: Partial<Sale> = {
  bike_id: null, bike_name: "", sale_price: 0, customer_name: "", customer_email: "",
  customer_phone: "", salesperson_name: "", sold_at: new Date().toISOString().slice(0, 10), notes: "",
};

function SalesAdmin() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [editing, setEditing] = useState<Partial<Sale> | null>(null);

  const load = async () => {
    const [s, b] = await Promise.all([
      supabase.from("sales").select("*").order("sold_at", { ascending: false }),
      supabase.from("bikes").select("*").order("name"),
    ]);
    setSales((s.data ?? []) as Sale[]);
    setBikes((b.data ?? []) as unknown as Bike[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const bike = bikes.find((b) => b.id === editing.bike_id);
    const payload = {
      bike_id: editing.bike_id || null,
      bike_name: editing.bike_name || bike?.name || "",
      sale_price: Number(editing.sale_price) || 0,
      customer_name: editing.customer_name ?? "",
      customer_email: editing.customer_email || null,
      customer_phone: editing.customer_phone || null,
      salesperson_name: editing.salesperson_name || null,
      sold_at: editing.sold_at ?? new Date().toISOString().slice(0, 10),
      notes: editing.notes || null,
    };
    const res = editing.id
      ? await supabase.from("sales").update(payload).eq("id", editing.id)
      : await supabase.from("sales").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    // Decrement stock when a new sale is recorded against a bike
    if (!editing.id && bike) {
      const newStock = Math.max(0, (bike.stock_quantity ?? 1) - 1);
      await supabase.from("bikes").update({ stock_quantity: newStock }).eq("id", bike.id);
    }
    toast.success("Sale logged"); setEditing(null); load();
  };

  const remove = async (s: Sale) => {
    if (!confirm("Delete this sale?")) return;
    const { error } = await supabase.from("sales").delete().eq("id", s.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";
  const total = sales.reduce((a, s) => a + Number(s.sale_price || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight">Sales</h1>
          <p className="font-mono text-xs text-muted-foreground mt-2">{sales.length} sales · {formatKES(total)} revenue</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
          <Plus className="h-3 w-3" /> Log Sale
        </button>
      </div>

      <div className="border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Date</th><th className="p-3">Bike</th><th className="p-3">Customer</th><th className="p-3">Salesperson</th><th className="p-3">Price</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{s.sold_at}</td>
                <td className="p-3">{s.bike_name}</td>
                <td className="p-3">{s.customer_name}<br /><span className="text-xs text-muted-foreground">{s.customer_email}</span></td>
                <td className="p-3 text-muted-foreground">{s.salesperson_name ?? "—"}</td>
                <td className="p-3 text-accent">{formatKES(s.sale_price)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(s)} className="text-xs underline mr-3">Edit</button>
                  <button onClick={() => remove(s)} className="text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No sales recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 grid place-items-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-surface border border-border max-w-xl w-full p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl uppercase mb-6">{editing.id ? "Edit sale" : "Log sale"}</h2>
            <div className="grid gap-4">
              <Lbl label="Bike">
                <select className={inp} value={editing.bike_id ?? ""} onChange={(e) => {
                  const b = bikes.find((x) => x.id === e.target.value);
                  setEditing({ ...editing, bike_id: e.target.value || null, bike_name: b?.name ?? editing.bike_name, sale_price: editing.sale_price || b?.price || 0 });
                }}>
                  <option value="">— Select —</option>
                  {bikes.map((b) => <option key={b.id} value={b.id}>{b.name} ({formatKES(b.price)})</option>)}
                </select>
              </Lbl>
              <div className="grid grid-cols-2 gap-4">
                <Lbl label="Sale price (KES)"><input type="number" className={inp} value={editing.sale_price ?? 0} onChange={(e) => setEditing({ ...editing, sale_price: Number(e.target.value) })} /></Lbl>
                <Lbl label="Sold date"><input type="date" className={inp} value={editing.sold_at ?? ""} onChange={(e) => setEditing({ ...editing, sold_at: e.target.value })} /></Lbl>
              </div>
              <Lbl label="Customer name"><input className={inp} value={editing.customer_name ?? ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} /></Lbl>
              <div className="grid grid-cols-2 gap-4">
                <Lbl label="Customer email"><input className={inp} value={editing.customer_email ?? ""} onChange={(e) => setEditing({ ...editing, customer_email: e.target.value })} /></Lbl>
                <Lbl label="Customer phone"><input className={inp} value={editing.customer_phone ?? ""} onChange={(e) => setEditing({ ...editing, customer_phone: e.target.value })} /></Lbl>
              </div>
              <Lbl label="Salesperson"><input className={inp} value={editing.salesperson_name ?? ""} onChange={(e) => setEditing({ ...editing, salesperson_name: e.target.value })} /></Lbl>
              <Lbl label="Notes"><textarea rows={2} className={inp} value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Lbl>
              <div className="flex gap-3 mt-2">
                <button onClick={save} className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest">Save</button>
                <button onClick={() => setEditing(null)} className="border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Lbl({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{label}</span>{children}</label>;
}
