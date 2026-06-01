import { supabase } from "@/integrations/supabase/client";
import type { Bike, Brand, SiteSettings, TeamMember } from "./types";

export async function fetchPublishedBikes(): Promise<Bike[]> {
  const { data, error } = await supabase.from("bikes").select("*").eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Bike[];
}

export async function fetchAllBikes(): Promise<Bike[]> {
  const { data, error } = await supabase.from("bikes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Bike[];
}

export async function fetchBikeBySlug(slug: string): Promise<Bike | null> {
  const { data, error } = await supabase.from("bikes").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as unknown as Bike | null;
}

export async function fetchBikesByIds(ids: string[]): Promise<Bike[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("bikes").select("*").in("id", ids);
  if (error) throw error;
  return (data ?? []) as unknown as Bike[];
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data as unknown as SiteSettings | null;
}

export async function fetchPublishedBrands(): Promise<Brand[]> {
  const { data, error } = await supabase.from("brands").select("*").eq("published", true)
    .order("sort_order", { ascending: true }).order("name");
  if (error) throw error;
  return (data ?? []) as unknown as Brand[];
}

export async function fetchPublishedTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from("team_members").select("*").eq("published", true)
    .order("sort_order", { ascending: true }).order("name");
  if (error) throw error;
  return (data ?? []) as unknown as TeamMember[];
}
