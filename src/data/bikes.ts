// Brand presentation list — actual bike inventory now lives in the database.
// See src/lib/queries.ts (fetchPublishedBikes) and src/lib/types.ts (Bike).

export const brands = [
  { name: "Yamaha", description: "Japanese precision and racing heritage from the YZR-M1 lineage." },
  { name: "Honda", description: "Reliability and innovation backed by HRC's MotoGP and WSBK programs." },
  { name: "Kawasaki", description: "Heavy-industry engineering and supercharged hyper-sport pedigree." },
  { name: "Suzuki", description: "Lightweight, balanced sport machines with a cult racing following." },
  { name: "Ducati", description: "Italian artistry, desmodromic engines, and unmistakable design." },
  { name: "KTM", description: "Austrian aggression — Ready to Race in every chassis they build." },
  { name: "BMW Motorrad", description: "German engineering for the long road, the racetrack, and beyond." },
  { name: "Aprilia", description: "Noale-built superbikes with the most awarded V4 in WSBK history." },
];

export { formatKES } from "@/lib/types";
export type { Bike } from "@/lib/types";
