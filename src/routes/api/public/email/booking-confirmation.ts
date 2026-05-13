import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Best-effort booking confirmation endpoint.
// Once the email domain + transactional email infra are configured, swap the
// stub below for a real send via the queue. For now it logs the booking and
// returns 200 so the UI flow stays clean.
export const Route = createFileRoute("/api/public/email/booking-confirmation")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { bookingId } = await request.json() as { bookingId?: string };
          if (!bookingId) return new Response(JSON.stringify({ ok: false, error: "missing bookingId" }), { status: 400 });
          const { data } = await supabaseAdmin
            .from("test_rides").select("*").eq("id", bookingId).maybeSingle();
          if (!data) return new Response(JSON.stringify({ ok: false }), { status: 404 });
          // TODO: enqueue confirmation email via configured email infrastructure.
          console.log("[booking-confirmation]", data.email, data.bike_name, data.preferred_date);
          return new Response(JSON.stringify({ ok: true, queued: false }), { status: 200, headers: { "Content-Type": "application/json" } });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ ok: false }), { status: 500 });
        }
      },
    },
  },
});
