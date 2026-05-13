import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — Nairobi Powerbikes" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) { toast.error(error); return; }
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-border p-8 bg-surface">
        <Link to="/" className="font-display text-2xl uppercase italic tracking-tighter block mb-2">
          Nairobi<span className="text-accent">Power</span>
        </Link>
        <h1 className="font-display text-3xl uppercase tracking-tight mb-6">Admin Login</h1>
        <div className="grid gap-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border px-4 py-3 outline-none focus:border-accent" />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border px-4 py-3 outline-none focus:border-accent" />
          </label>
          <button type="submit" disabled={busy} className="bg-accent text-accent-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50">
            {busy ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Admin accounts are created from the Cloud users panel. New signups are disabled.
          </p>
        </div>
      </form>
    </div>
  );
}

// Suppress unused warning
void redirect;
