import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TestRide } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/test-rides")({ component: TestRidesAdmin });

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no-show"];

function TestRidesAdmin() {
  const [items, setItems] = useState<TestRide[]>([]);
  const load = async () => {
    const { data } = await supabase.from("test_rides").select("*").order("preferred_date", { ascending: true });
    setItems((data ?? []) as unknown as TestRide[]);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<TestRide>) => {
    const { error } = await supabase.from("test_rides").update(patch).eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  const licenseUrl = async (path: string) => {
    const { data } = await supabase.storage.from("test-ride-licenses").createSignedUrl(path, 60 * 10);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">Test Rides</h1>
      <div className="grid gap-4">
        {items.map((r) => (
          <div key={r.id} className="border border-border p-5 bg-surface">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display text-lg uppercase">{r.name}</p>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                  {r.bike_name ?? "Any bike"} · {r.preferred_date} {r.preferred_time}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{r.email} · {r.phone}</p>
              </div>
              <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value })}
                className="bg-background border border-border px-3 py-1.5 text-xs uppercase tracking-widest">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {r.notes && <p className="mt-3 text-sm">{r.notes}</p>}
            {r.license_url && (
              <button onClick={() => licenseUrl(r.license_url!)} className="text-xs text-accent underline mt-2">
                View license
              </button>
            )}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Follow-up</span>
                <input type="datetime-local" defaultValue={r.follow_up_at ? r.follow_up_at.slice(0, 16) : ""}
                  onBlur={(e) => update(r.id, { follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full bg-background border border-border px-2 py-1.5 mt-1 text-sm" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Notes</span>
                <input defaultValue={r.admin_notes ?? ""} onBlur={(e) => update(r.id, { admin_notes: e.target.value })}
                  className="w-full bg-background border border-border px-2 py-1.5 mt-1 text-sm" />
              </label>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground py-12 text-center">No test rides yet.</p>}
      </div>
    </div>
  );
}
