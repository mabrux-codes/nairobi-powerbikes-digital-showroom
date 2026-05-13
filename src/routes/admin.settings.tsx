import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const [s, setS] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (data) setS(data as unknown as SiteSettings);
  };
  useEffect(() => { load(); }, []);

  const uploadLogo = async (file: File) => {
    const path = `logo-${Date.now()}-${file.name}`;
    const up = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (up.error) { toast.error(up.error.message); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(up.data.path);
    setS((prev) => ({ ...prev, logo_url: data.publicUrl }));
    toast.success("Logo uploaded — remember to save");
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      site_name: s.site_name ?? "Nairobi Powerbikes",
      logo_url: s.logo_url ?? null,
      contact_email: s.contact_email ?? null,
      contact_phone: s.contact_phone ?? null,
      whatsapp_number: s.whatsapp_number ?? null,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  };

  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";
  const F = (label: string, child: React.ReactNode) => (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{label}</span>
      {child}
    </label>
  );

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">Settings</h1>
      <div className="grid gap-5">
        {F("Logo", (
          <div className="flex items-center gap-4">
            {s.logo_url
              ? <img src={s.logo_url} alt="logo" className="h-16 w-auto bg-surface border border-border p-2" />
              : <div className="h-16 w-16 bg-surface border border-border" />}
            <label className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 hover:bg-surface">
              <Upload className="h-3 w-3" /> Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </label>
            {s.logo_url && (
              <button onClick={() => setS((p) => ({ ...p, logo_url: null }))} className="text-xs underline text-muted-foreground">Remove</button>
            )}
          </div>
        ))}
        {F("Site Name", <input className={inp} value={s.site_name ?? ""} onChange={(e) => setS({ ...s, site_name: e.target.value })} />)}
        {F("Contact Email", <input type="email" className={inp} value={s.contact_email ?? ""} onChange={(e) => setS({ ...s, contact_email: e.target.value })} />)}
        {F("Contact Phone", <input className={inp} value={s.contact_phone ?? ""} onChange={(e) => setS({ ...s, contact_phone: e.target.value })} />)}
        {F("WhatsApp Number", <input className={inp} value={s.whatsapp_number ?? ""} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} placeholder="254700000000" />)}

        <button disabled={saving} onClick={save} className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest justify-self-start disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
