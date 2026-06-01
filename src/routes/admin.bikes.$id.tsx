import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Bike, Brand } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/bikes/$id")({ component: BikeEditor });

const empty: Partial<Bike> = {
  slug: "", name: "", brand: "", brand_id: null, type: "Sport", price: 0, engine: 0, power: "",
  year: new Date().getFullYear(), mileage: "0 km", condition: "Brand New",
  transmission: "", badge: null, image: "", images: [], description: "",
  features: [], available: true, published: true, stock_quantity: 1,
};

function BikeEditor() {
  const { id } = useParams({ from: "/admin/bikes/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const [bike, setBike] = useState<Partial<Bike>>(empty);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("brands").select("*").order("name").then(({ data }) => setBrands((data ?? []) as Brand[]));
    if (isNew) return;
    supabase.from("bikes").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) setBike(data as unknown as Bike);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = (k: keyof Bike, v: unknown) => setBike((b) => ({ ...b, [k]: v }));

  const uploadImage = async (file: File) => {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const up = await supabase.storage.from("bike-images").upload(path, file, { upsert: false });
    if (up.error) { toast.error(up.error.message); return; }
    const { data } = supabase.storage.from("bike-images").getPublicUrl(up.data.path);
    set("image", data.publicUrl);
    toast.success("Image uploaded");
  };

  const save = async () => {
    setSaving(true);
    const selectedBrand = brands.find((b) => b.id === bike.brand_id);
    const payload = {
      slug: bike.slug || (bike.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: bike.name ?? "",
      brand: selectedBrand?.name ?? bike.brand ?? "",
      brand_id: bike.brand_id || null,
      type: bike.type ?? "Sport",
      price: Number(bike.price) || 0, engine: Number(bike.engine) || 0,
      power: bike.power ?? "", year: Number(bike.year) || new Date().getFullYear(),
      mileage: bike.mileage ?? "0 km", condition: bike.condition ?? "Brand New",
      transmission: bike.transmission ?? "", badge: bike.badge || null,
      image: bike.image ?? "", images: bike.images ?? [],
      description: bike.description ?? "",
      features: typeof bike.features === "string" ? (bike.features as string).split("\n").filter(Boolean) : (bike.features ?? []),
      available: bike.available ?? true, published: bike.published ?? true,
      stock_quantity: Number(bike.stock_quantity ?? 1),
    };
    const res = isNew
      ? await supabase.from("bikes").insert(payload).select("id").maybeSingle()
      : await supabase.from("bikes").update(payload).eq("id", id).select("id").maybeSingle();
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    navigate({ to: "/admin/bikes" });
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const F = (label: string, child: React.ReactNode) => (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{label}</span>
      {child}
    </label>
  );
  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/admin/bikes" className="text-xs font-mono uppercase tracking-widest text-muted-foreground inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>
      <h1 className="font-display text-4xl uppercase tracking-tight mb-8">{isNew ? "New Bike" : bike.name}</h1>

      <div className="grid gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {F("Name", <input className={inp} value={bike.name ?? ""} onChange={(e) => set("name", e.target.value)} />)}
          {F("Slug (URL)", <input className={inp} value={bike.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated if empty" />)}
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {F("Brand", (
            <select className={inp} value={bike.brand_id ?? ""} onChange={(e) => set("brand_id", e.target.value || null)}>
              <option value="">— Select brand —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          ))}
          {F("Type", <select className={inp} value={bike.type ?? "Sport"} onChange={(e) => set("type", e.target.value)}>
            {["Sport","Naked","Adventure","Touring","Cruiser"].map((t) => <option key={t}>{t}</option>)}
          </select>)}
          {F("Year", <input type="number" className={inp} value={bike.year ?? ""} onChange={(e) => set("year", Number(e.target.value))} />)}
        </div>
        <div className="grid sm:grid-cols-4 gap-5">
          {F("Price (KES)", <input type="number" className={inp} value={bike.price ?? 0} onChange={(e) => set("price", Number(e.target.value))} />)}
          {F("Engine (cc)", <input type="number" className={inp} value={bike.engine ?? 0} onChange={(e) => set("engine", Number(e.target.value))} />)}
          {F("Power", <input className={inp} value={bike.power ?? ""} onChange={(e) => set("power", e.target.value)} />)}
          {F("Stock qty", <input type="number" min={0} className={inp} value={bike.stock_quantity ?? 1} onChange={(e) => set("stock_quantity", Number(e.target.value))} />)}
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {F("Mileage", <input className={inp} value={bike.mileage ?? ""} onChange={(e) => set("mileage", e.target.value)} />)}
          {F("Condition", <select className={inp} value={bike.condition ?? ""} onChange={(e) => set("condition", e.target.value)}>
            {["Brand New","Certified Pre-Owned","Pre-Owned"].map((t) => <option key={t}>{t}</option>)}
          </select>)}
          {F("Transmission", <input className={inp} value={bike.transmission ?? ""} onChange={(e) => set("transmission", e.target.value)} />)}
        </div>
        {F("Badge (optional)", <input className={inp} value={bike.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="e.g. New Arrival" />)}

        {F("Image", (
          <div className="flex items-center gap-3">
            {bike.image && <img src={bike.image} alt="" className="h-20 w-20 object-cover border border-border" />}
            <label className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 hover:bg-surface">
              <Upload className="h-3 w-3" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            </label>
            <input className={inp} value={bike.image ?? ""} onChange={(e) => set("image", e.target.value)} placeholder="or paste image URL" />
          </div>
        ))}

        {F("Description", <textarea rows={4} className={inp} value={bike.description ?? ""} onChange={(e) => set("description", e.target.value)} />)}
        {F("Features (one per line)", <textarea rows={5} className={inp}
          value={Array.isArray(bike.features) ? (bike.features as string[]).join("\n") : (bike.features ?? "")}
          onChange={(e) => set("features", e.target.value.split("\n"))} />)}

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!bike.published} onChange={(e) => set("published", e.target.checked)} /> Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!bike.available} onChange={(e) => set("available", e.target.checked)} /> Available
          </label>
        </div>

        <button disabled={saving} onClick={save} className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest justify-self-start disabled:opacity-50">
          {saving ? "Saving..." : "Save Bike"}
        </button>
      </div>
    </div>
  );
}
