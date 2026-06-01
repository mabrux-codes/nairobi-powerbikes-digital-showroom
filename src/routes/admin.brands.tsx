import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/brands")({ component: BrandsAdmin });

const emptyBrand: Partial<Brand> = { name: "", slug: "", description: "", country: "", sort_order: 0, published: true, logo_url: null };

function BrandsAdmin() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("brands").select("*").order("sort_order").order("name");
    setBrands((data ?? []) as Brand[]);
  };
  useEffect(() => { load(); }, []);

  const uploadLogo = async (file: File, onUrl: (url: string) => void) => {
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabase.storage.from("brand-logos").upload(path, file, { upsert: false });
    if (up.error) { toast.error(up.error.message); return; }
    const { data } = supabase.storage.from("brand-logos").getPublicUrl(up.data.path);
    onUrl(data.publicUrl);
    toast.success("Logo uploaded");
  };

  const save = async () => {
    if (!editing) return;
    const slug = editing.slug?.trim() || (editing.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = {
      name: editing.name ?? "",
      slug,
      logo_url: editing.logo_url ?? null,
      description: editing.description ?? null,
      country: editing.country ?? null,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const res = editing.id
      ? await supabase.from("brands").update(payload).eq("id", editing.id)
      : await supabase.from("brands").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (b: Brand) => {
    if (!confirm(`Delete ${b.name}?`)) return;
    const { error } = await supabase.from("brands").delete().eq("id", b.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase tracking-tight">Brands</h1>
        <button onClick={() => setEditing({ ...emptyBrand })} className="bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
          <Plus className="h-3 w-3" /> New Brand
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div key={b.id} className="border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {b.logo_url
                  ? <img src={b.logo_url} alt={b.name} className="h-12 w-12 object-contain bg-background border border-border p-1" />
                  : <div className="h-12 w-12 bg-background border border-border grid place-items-center text-[10px] text-muted-foreground">No logo</div>}
                <div>
                  <p className="font-display text-lg uppercase">{b.name}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{b.country || "—"}</p>
                </div>
              </div>
              <button onClick={() => remove(b)} className="text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4" /></button>
            </div>
            {b.description && <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{b.description}</p>}
            <button onClick={() => setEditing(b)} className="mt-4 text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">Edit →</button>
          </div>
        ))}
        {brands.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No brands yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 grid place-items-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-surface border border-border max-w-xl w-full p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl uppercase mb-6">{editing.id ? "Edit brand" : "New brand"}</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Logo</span>
                <div className="flex items-center gap-3">
                  {editing.logo_url && <img src={editing.logo_url} alt="" className="h-16 w-16 object-contain bg-background border border-border p-1" />}
                  <label className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 hover:bg-background">
                    <Upload className="h-3 w-3" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0], (url) => setEditing((p) => ({ ...p!, logo_url: url })))} />
                  </label>
                  {editing.logo_url && <button onClick={() => setEditing((p) => ({ ...p!, logo_url: null }))} className="text-xs underline text-muted-foreground">Remove</button>}
                </div>
              </label>
              <Lbl label="Name"><input className={inp} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Lbl>
              <Lbl label="Slug (auto)"><input className={inp} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto from name" /></Lbl>
              <Lbl label="Country"><input className={inp} value={editing.country ?? ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></Lbl>
              <Lbl label="Description"><textarea rows={3} className={inp} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Lbl>
              <div className="grid grid-cols-2 gap-4">
                <Lbl label="Sort order"><input type="number" className={inp} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Lbl>
                <label className="flex items-end gap-2 text-sm pb-2">
                  <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published
                </label>
              </div>
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
