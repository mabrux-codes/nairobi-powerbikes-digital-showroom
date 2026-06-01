import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ContactMessage } from "@/lib/types";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/contact-messages")({ component: ContactMessagesAdmin });

const STATUSES = ["new", "replied", "archived"];

function ContactMessagesAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as ContactMessage[]);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<ContactMessage>) => {
    const { error } = await supabase.from("contact_messages").update(patch).eq("id", id);
    if (error) toast.error(error.message); else load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">Contact Messages</h1>
      <div className="grid gap-4">
        {items.map((m) => (
          <div key={m.id} className="border border-border p-5 bg-surface">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-lg uppercase">{m.name} <span className="text-muted-foreground text-sm font-mono normal-case">— {m.email}{m.phone ? ` · ${m.phone}` : ""}</span></p>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                  {m.subject ?? "No subject"} · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select value={m.status} onChange={(e) => update(m.id, { status: e.target.value })}
                  className="bg-background border border-border px-3 py-1.5 text-xs uppercase tracking-widest">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(m.id)} className="p-2 text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
            <div className="mt-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Internal notes</span>
                <input defaultValue={m.admin_notes ?? ""} onBlur={(e) => update(m.id, { admin_notes: e.target.value })}
                  className="w-full bg-background border border-border px-2 py-1.5 mt-1 text-sm" />
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <a href={`mailto:${m.email}`} className="text-xs text-accent underline">Reply by email</a>
              {m.phone && <a href={`https://wa.me/${m.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline">WhatsApp</a>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground py-12 text-center">No messages yet.</p>}
      </div>
    </div>
  );
}
