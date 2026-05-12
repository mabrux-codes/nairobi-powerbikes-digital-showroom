import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nairobi Powerbikes" },
      { name: "description", content: "Our story, mission and the team behind Kenya's premier high-performance motorcycle dealership." },
      { property: "og:title", content: "About Nairobi Powerbikes" },
      { property: "og:description", content: "The team and story behind Kenya's premier superbike dealership." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <section className="border-b border-border py-24">
        <div className="container-x">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">// About</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter max-w-3xl leading-[0.95]">
            Built by riders, <span className="text-accent">for riders.</span>
          </h1>
        </div>
      </section>

      <section className="py-20 container-x grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="font-display text-3xl uppercase tracking-tight mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Nairobi Powerbikes started in a small Industrial Area garage in 2017 with a single Ducati and a stubborn belief that Kenya deserved access to the world's finest motorcycles — without the import nightmare.
            </p>
            <p>
              Today we operate Kenya's most trusted high-performance dealership, importing and servicing premium machines from Yamaha, Honda, Kawasaki, Ducati, BMW, KTM and more.
            </p>
            <p>
              Every bike on our floor is hand-selected, fully inspected, and backed by a team of factory-trained technicians who ride what they sell.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-px bg-border">
          {[
            { icon: Target, title: "Mission", body: "Make world-class motorcycles accessible across East Africa, with full transparency and pro support." },
            { icon: Eye, title: "Vision", body: "Build the most respected riding community on the continent — one machine at a time." },
            { icon: Heart, title: "Values", body: "Integrity, craftsmanship, and an obsession with the riding experience." },
            { icon: Target, title: "Promise", body: "If we wouldn't ride it ourselves, we won't sell it to you. Period." },
          ].map((c) => (
            <div key={c.title} className="bg-background p-8">
              <c.icon className="h-6 w-6 text-accent mb-4" />
              <h3 className="font-display text-xl uppercase tracking-tight mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y border-border py-20">
        <div className="container-x">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-12">The Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Kevin Mwangi", role: "Founder & Director" },
              { name: "Sarah Otieno", role: "Head of Sales" },
              { name: "Brian Kamau", role: "Master Technician" },
              { name: "Faith Njeri", role: "Customer Success" },
            ].map((m) => (
              <div key={m.name} className="bg-background border border-border p-6">
                <div className="aspect-square bg-surface-2 mb-4 grid place-items-center font-display text-5xl text-muted-foreground">
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="font-display text-lg uppercase tracking-tight">{m.name}</p>
                <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
