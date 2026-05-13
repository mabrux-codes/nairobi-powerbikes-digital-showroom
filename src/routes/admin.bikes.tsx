import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bike } from "@/lib/types";
import { formatKES } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/admin/bikes")({ component: AdminBikes });

function AdminBikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const load = async () => {
    const { data } = await supabase.from("bikes").select("*").order("created_at", { ascending: false });
    setBikes((data ?? []) as unknown as Bike[]);
  };
  useEffect(() => { load(); }, []);

  const togglePublished = async (b: Bike) => {
    await supabase.from("bikes").update({ published: !b.published }).eq("id", b.id);
    load();
  };

  const remove = async (b: Bike) => {
    if (!confirm(`Delete ${b.name}?`)) return;
    const { error } = await supabase.from("bikes").delete().eq("id", b.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase tracking-tight">Bikes</h1>
        <Link to="/admin/bikes/new" className="bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
          <Plus className="h-3 w-3" /> New Bike
        </Link>
      </div>
      <div className="border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="p-3">Name</th><th className="p-3">Brand</th><th className="p-3">Price</th><th className="p-3">Published</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3"><Link to="/admin/bikes/$id" params={{ id: b.id }} className="hover:text-accent">{b.name}</Link></td>
                <td className="p-3 text-muted-foreground">{b.brand}</td>
                <td className="p-3">{formatKES(b.price)}</td>
                <td className="p-3">
                  <button onClick={() => togglePublished(b)} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${b.published ? "bg-accent text-accent-foreground" : "bg-surface text-muted-foreground"}`}>
                    {b.published ? "Live" : "Draft"}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <Link to="/admin/bikes/$id" params={{ id: b.id }} className="inline-block p-2 hover:text-accent"><Edit className="h-4 w-4" /></Link>
                  <button onClick={() => remove(b)} className="p-2 hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {bikes.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No bikes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
