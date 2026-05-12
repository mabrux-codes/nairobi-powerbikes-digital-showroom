import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { WhatsAppFab } from "./whatsapp-fab";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
