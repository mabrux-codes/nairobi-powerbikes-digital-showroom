export type Bike = {
  id: string;
  slug: string;
  name: string;
  brand: string;
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

export const formatKES = (n: number) => "KES " + n.toLocaleString("en-KE");
