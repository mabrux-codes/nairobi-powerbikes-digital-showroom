import panigale from "@/assets/bike-panigale.jpg";
import bmwGs from "@/assets/bike-bmw-gs.jpg";
import ninjaH2 from "@/assets/bike-ninja-h2.jpg";
import r1m from "@/assets/bike-r1m.jpg";
import ktm from "@/assets/bike-ktm-superduke.jpg";
import cbr from "@/assets/bike-cbr1000.jpg";
import hero from "@/assets/hero-bike.jpg";

const seedMap: Record<string, string> = {
  "ducati-panigale-v4-s": panigale,
  "bmw-r1250-gs": bmwGs,
  "kawasaki-ninja-h2-carbon": ninjaH2,
  "yamaha-yzf-r1m": r1m,
  "ktm-1290-super-duke-r": ktm,
  "honda-cbr1000rr-r-sp": cbr,
};

export const placeholderHero = hero;

export function resolveBikeImage(slug: string | null | undefined, image: string | null | undefined): string {
  if (image && /^https?:\/\//.test(image)) return image;
  if (slug && seedMap[slug]) return seedMap[slug];
  return hero;
}
