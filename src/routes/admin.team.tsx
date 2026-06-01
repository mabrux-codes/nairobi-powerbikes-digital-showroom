import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/team")({ component: TeamAdmin });

const empty: Partial<TeamMember> = { name: "", role: "", bio: "", email: "", phone: "", sort_order: 0, published: true, photo_url: null };

function TeamAdmin() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order").order("name");
    setTeam((data ?? []) as TeamMember[]);
  };
  useEffect(() => { load(); }, []);

  const uploadPhoto = async (file: File, onUrl: (url: string) => void) => {
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabase.storage.from("team-photos").upload(path, file);
    if (up.error) { toast.error(up.error.message); return; }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(up.data.path);
    onUrl(data.publicUrl); toast.success("Photo uploaded");
  };

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name ?? "", role: editing.role ?? "",
      bio: editing.bio ?? null, photo_url: editing.photo_url ?? null,
      email: editing.email ?? null, phone: editing.phone ?? null,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published ?? true,
    };
    const res = editing.id
      ? await supabase.from("team_members").update(payload).eq("id", editing.id)
      : await supabase.from("team_members").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (m: TeamMember) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", m.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase tracking-tight">Team</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
          <Plus className="h-3 w-3" /> New Member
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => (
          <div key={m.id} className="border border-border bg-surface p-5">
            <div className="flex items-start gap-4">
              {m.photo_url
                ? <img src={m.photo_url} alt={m.name} className="h-16 w-16 object-cover border border-border" />
                : <div className="h-16 w-16 bg-background border border-border grid place-items-center font-display text-lg text-muted-foreground">{m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>}
              <div className="flex-1">
                <p className="font-display text-lg uppercase">{m.name}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{m.role}</p>
              </div>
              <button onClick={() => remove(m)} className="text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4" /></button>
            </div>
            {m.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{m.bio}</p>}
            <button onClick={() => setEditing(m)} className="mt-4 text-[10px] font-mono uppercase tracking-widest text-accent hover:underline">Edit →</button>
          </div>
        ))}
        {team.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No team members yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 grid place-items-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-surface border border-border max-w-xl w-full p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl uppercase mb-6">{editing.id ? "Edit member" : "New member"}</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Photo</span>
                <div className="flex items-center gap-3">
                  {editing.photo_url && <img src={editing.photo_url} alt="" className="h-16 w-16 object-cover border border-border" />}
                  <label className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 hover:bg-background">
                    <Upload className="h-3 w-3" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], (url) => setEditing((p) => ({ ...p!, photo_url: url })))} />
                  </label>
                </div>
              </label>
              <Lbl label="Name"><input className={inp} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Lbl>
              <Lbl label="Role"><input className={inp} value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="e.g. Head of Sales" /></Lbl>
              <Lbl label="Bio"><textarea rows={3} className={inp} value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></Lbl>
              <div className="grid grid-cols-2 gap-4">
                <Lbl label="Email"><input className={inp} value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Lbl>
                <Lbl label="Phone"><input className={inp} value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Lbl>
              </div>
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
