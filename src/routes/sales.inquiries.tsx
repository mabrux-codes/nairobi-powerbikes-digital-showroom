import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Inquiry } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/sales/inquiries")({ component: MyInquiries });

const STATUSES = ["new", "contacted", "negotiating", "closed", "lost"];

function MyInquiries() {
  const { user } = useAuth();
  const [items, setItems] = useState<Inquiry[]>([]);
  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("inquiries").select("*").eq("assigned_to", user.id).order("created_at", { ascending: false });
    setItems((data ?? []) as unknown as Inquiry[]);
  };
  useEffect(() => { load(); }, [user]);

  const update = async (id: string, patch: Partial<Inquiry>) => {
    const { error } = await supabase.from("inquiries").update(patch).eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">My Inquiries</h1>
      <div className="grid gap-4">
        {items.map((q) => (
          <div key={q.id} className="border border-border p-5 bg-surface">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-lg uppercase">{q.name} <span className="text-muted-foreground text-sm font-mono normal-case">— {q.email}{q.phone ? ` · ${q.phone}` : ""}</span></p>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">{q.bike_name ?? "General"} · {new Date(q.created_at).toLocaleString()}</p>
              </div>
              <select value={q.status} onChange={(e) => update(q.id, { status: e.target.value })}
                className="bg-background border border-border px-3 py-1.5 text-xs uppercase tracking-widest">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {q.message && <p className="mt-3 text-sm">{q.message}</p>}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Follow-up</span>
                <input type="datetime-local" defaultValue={q.follow_up_at ? q.follow_up_at.slice(0, 16) : ""}
                  onBlur={(e) => update(q.id, { follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full bg-background border border-border px-2 py-1.5 mt-1 text-sm" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Notes</span>
                <input defaultValue={q.admin_notes ?? ""} onBlur={(e) => update(q.id, { admin_notes: e.target.value })}
                  className="w-full bg-background border border-border px-2 py-1.5 mt-1 text-sm" />
              </label>
            </div>
            <div className="flex gap-4 mt-4">
              <a href={`mailto:${q.email}`} className="text-xs text-accent underline">Email</a>
              {q.phone && <a href={`https://wa.me/${q.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline">WhatsApp</a>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground py-12 text-center">No leads assigned to you yet.</p>}
      </div>
    </div>
  );
}
