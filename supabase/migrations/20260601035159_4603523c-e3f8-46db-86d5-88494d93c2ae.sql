-- 1. Add salesperson role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'salesperson';

-- 2. Stock on bikes
ALTER TABLE public.bikes ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 1;

-- 3. Brands table
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  logo_url text,
  description text,
  country text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read brands" ON public.brands FOR SELECT USING (published = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage brands" ON public.brands FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.bikes ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS bikes_brand_id_idx ON public.bikes(brand_id);

-- 4. Team members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  email text,
  phone text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read team" ON public.team_members FOR SELECT USING (published = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage team" ON public.team_members FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER team_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 5. Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update contact messages" ON public.contact_messages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_msg_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 6. Sales
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id uuid REFERENCES public.bikes(id) ON DELETE SET NULL,
  bike_name text NOT NULL,
  sale_price bigint NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  salesperson_id uuid,
  salesperson_name text,
  sold_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage sales" ON public.sales FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "salespeople read their sales" ON public.sales FOR SELECT TO authenticated USING (salesperson_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE INDEX sales_bike_idx ON public.sales(bike_id);
CREATE INDEX sales_sold_at_idx ON public.sales(sold_at DESC);
CREATE TRIGGER sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 7. Lead assignment
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS assigned_to uuid;
ALTER TABLE public.test_rides ADD COLUMN IF NOT EXISTS assigned_to uuid;
CREATE INDEX IF NOT EXISTS inquiries_assigned_idx ON public.inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS test_rides_assigned_idx ON public.test_rides(assigned_to);

-- 8. Salesperson RLS on inquiries / test_rides
CREATE POLICY "salespeople read assigned inquiries" ON public.inquiries FOR SELECT TO authenticated USING (assigned_to = auth.uid());
CREATE POLICY "salespeople update assigned inquiries" ON public.inquiries FOR UPDATE TO authenticated USING (assigned_to = auth.uid()) WITH CHECK (assigned_to = auth.uid());
CREATE POLICY "salespeople read assigned test rides" ON public.test_rides FOR SELECT TO authenticated USING (assigned_to = auth.uid());
CREATE POLICY "salespeople update assigned test rides" ON public.test_rides FOR UPDATE TO authenticated USING (assigned_to = auth.uid()) WITH CHECK (assigned_to = auth.uid());

-- 9. Storage buckets for brand logos and team photos
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read brand logos" ON storage.objects FOR SELECT USING (bucket_id = 'brand-logos');
CREATE POLICY "admins write brand logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update brand logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete brand logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "public read team photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "admins write team photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team-photos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update team photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team-photos' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete team photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team-photos' AND has_role(auth.uid(), 'admin'));