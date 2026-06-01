export type Bike = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brand_id?: string | null;
  type: string;
  price: number;
  engine: number;
  power: string;
  year: number;
  mileage: string;
  condition: string;
  transmission: string;
  badge: string | null;
  image: string;
  images: string[];
  description: string;
  features: string[];
  available: boolean;
  published: boolean;
  stock_quantity: number;
};

export type Inquiry = {
  id: string;
  bike_id: string | null;
  bike_name: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  follow_up_at: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
};

export type TestRide = {
  id: string;
  bike_id: string | null;
  bike_name: string | null;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  license_url: string | null;
  status: string;
  follow_up_at: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  site_name: string;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  country: string | null;
  sort_order: number;
  published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  sort_order: number;
  published: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

export type Sale = {
  id: string;
  bike_id: string | null;
  bike_name: string;
  sale_price: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  salesperson_id: string | null;
  salesperson_name: string | null;
  sold_at: string;
  notes: string | null;
  created_at: string;
};

export const formatKES = (n: number) => "KES " + n.toLocaleString("en-KE");
