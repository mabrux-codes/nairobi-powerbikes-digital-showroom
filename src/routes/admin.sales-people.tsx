import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createTeamUser, listTeamUsers, deleteTeamUser } from "@/lib/admin-users.functions";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/sales-people")({ component: SalesPeopleAdmin });

type TeamUser = { id: string; email: string; name: string; created_at: string; roles: string[] };

function SalesPeopleAdmin() {
  const fnList = useServerFn(listTeamUsers);
  const fnCreate = useServerFn(createTeamUser);
  const fnDelete = useServerFn(deleteTeamUser);

  const [users, setUsers] = useState<TeamUser[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "salesperson" as "salesperson" | "admin" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const r = await fnList();
      setUsers(r.users);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fnCreate({ data: form });
      toast.success("Account created — share credentials with them");
      setForm({ name: "", email: "", password: "", role: "salesperson" });
      setCreating(false);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setSubmitting(false); }
  };

  const remove = async (u: TeamUser) => {
    if (!confirm(`Delete account ${u.email}?`)) return;
    try { await fnDelete({ data: { userId: u.id } }); toast.success("Deleted"); load(); }
    catch (e) { toast.error((e as Error).message); }
  };

  const inp = "w-full bg-background border border-border px-3 py-2 outline-none focus:border-accent text-sm";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight">Sales Team</h1>
          <p className="font-mono text-xs text-muted-foreground mt-2">Create accounts for salespeople. They sign in at /login and access their dashboard at /sales.</p>
        </div>
        <button onClick={() => setCreating((v) => !v)} className="bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
          <UserPlus className="h-3 w-3" /> New User
        </button>
      </div>

      {creating && (
        <form onSubmit={submit} className="border border-border bg-surface p-6 mb-8 grid gap-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <Lbl label="Full name"><input required className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Lbl>
            <Lbl label="Role">
              <select className={inp} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "salesperson" | "admin" })}>
                <option value="salesperson">Salesperson</option>
                <option value="admin">Admin</option>
              </select>
            </Lbl>
          </div>
          <Lbl label="Email"><input required type="email" className={inp} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Lbl>
          <Lbl label="Temporary password (min 8 chars)"><input required minLength={8} type="text" className={inp} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Lbl>
          <div className="flex gap-3">
            <button disabled={submitting} className="bg-accent text-accent-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50">{submitting ? "Creating..." : "Create account"}</button>
            <button type="button" onClick={() => setCreating(false)} className="border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest">Cancel</button>
          </div>
        </form>
      )}

      <div className="border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Roles</th><th className="p-3">Created</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.name || "—"}</td>
                <td className="p-3 font-mono text-xs">{u.email}</td>
                <td className="p-3">
                  {u.roles.length === 0 ? <span className="text-muted-foreground">none</span> : u.roles.map((r) => (
                    <span key={r} className="inline-block bg-surface border border-border text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 mr-1">{r}</span>
                  ))}
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(u)} className="text-muted-foreground hover:text-accent"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Lbl({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{label}</span>{children}</label>;
}
