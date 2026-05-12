import panigale from "@/assets/bike-panigale.jpg";
import bmwGs from "@/assets/bike-bmw-gs.jpg";
import ninjaH2 from "@/assets/bike-ninja-h2.jpg";
import r1m from "@/assets/bike-r1m.jpg";
import ktm from "@/assets/bike-ktm-superduke.jpg";
import cbr from "@/assets/bike-cbr1000.jpg";

export type Bike = {
  id: string;
  name: string;
  brand: string;
  type: "Sport" | "Naked" | "Adventure" | "Touring";
  price: number; // KES
  engine: number; // cc
  power: string;
  year: number;
  mileage: string;
  condition: "Brand New" | "Certified Pre-Owned" | "Pre-Owned";
  transmission: string;
  badge?: string;
  image: string;
  description: string;
  features: string[];
};

export const bikes: Bike[] = [
  {
    id: "ducati-panigale-v4-s",
    name: "Ducati Panigale V4 S",
    brand: "Ducati",
    type: "Sport",
    price: 4_250_000,
    engine: 1103,
    power: "214 HP",
    year: 2024,
    mileage: "0 km",
    condition: "Brand New",
    transmission: "Quick Shift",
    badge: "New Arrival",
    image: panigale,
    description:
      "The pinnacle of Ducati's superbike engineering. Desmosedici Stradale V4 engine, electronics derived from MotoGP, and Öhlins suspension.",
    features: ["Öhlins NIX-30 forks", "Brembo Stylema calipers", "MotoGP-derived electronics", "Cornering ABS EVO"],
  },
  {
    id: "bmw-r1250-gs",
    name: "BMW R 1250 GS Triple Black",
    brand: "BMW",
    type: "Adventure",
    price: 3_800_000,
    engine: 1254,
    power: "136 HP",
    year: 2023,
    mileage: "4,200 km",
    condition: "Certified Pre-Owned",
    transmission: "6-Speed",
    badge: "Verified",
    image: bmwGs,
    description:
      "The benchmark adventure tourer. ShiftCam boxer twin, electronic suspension, and ride modes built for Africa's toughest routes.",
    features: ["Dynamic ESA", "Hill Start Control", "ABS Pro", "Riding Modes Pro"],
  },
  {
    id: "kawasaki-ninja-h2-carbon",
    name: "Kawasaki Ninja H2 Carbon",
    brand: "Kawasaki",
    type: "Sport",
    price: 6_100_000,
    engine: 998,
    power: "228 HP",
    year: 2024,
    mileage: "0 km",
    condition: "Brand New",
    transmission: "Quick Shift",
    badge: "Exclusive",
    image: ninjaH2,
    description:
      "Supercharged hyper-sport with carbon fiber bodywork. Closed-course velocity that redefines what a street bike can be.",
    features: ["Supercharged engine", "Carbon fiber upper cowl", "Brembo Stylema", "Öhlins TTX36 rear shock"],
  },
  {
    id: "yamaha-yzf-r1m",
    name: "Yamaha YZF-R1M",
    brand: "Yamaha",
    type: "Sport",
    price: 4_450_000,
    engine: 998,
    power: "200 HP",
    year: 2024,
    mileage: "0 km",
    condition: "Brand New",
    transmission: "Quick Shift",
    badge: "Limited",
    image: r1m,
    description:
      "Crossplane crankshaft inline-four, Öhlins ERS electronic suspension, carbon fiber bodywork. The R1M is the closest thing to a YZR-M1 you can ride on the street.",
    features: ["Öhlins ERS", "Carbon fiber bodywork", "GPS data logger", "Communication Control Unit"],
  },
  {
    id: "ktm-1290-super-duke-r",
    name: "KTM 1290 Super Duke R Evo",
    brand: "KTM",
    type: "Naked",
    price: 2_950_000,
    engine: 1301,
    power: "180 HP",
    year: 2024,
    mileage: "850 km",
    condition: "Certified Pre-Owned",
    transmission: "6-Speed PASC",
    image: ktm,
    description:
      "The Beast. A 75-degree V-twin, semi-active WP suspension, and a frame engineered for unfiltered street violence.",
    features: ["Semi-active WP suspension", "MTC traction control", "Cornering ABS", "Quickshifter+"],
  },
  {
    id: "honda-cbr1000rr-r-sp",
    name: "Honda CBR1000RR-R Fireblade SP",
    brand: "Honda",
    type: "Sport",
    price: 3_650_000,
    engine: 999,
    power: "215 HP",
    year: 2024,
    mileage: "0 km",
    condition: "Brand New",
    transmission: "Quick Shift",
    image: cbr,
    description:
      "RC213V-derived chassis, Öhlins Smart EC 2.0 semi-active suspension, and Brembo Stylema calipers. Built for the track, homologated for the road.",
    features: ["Öhlins Smart EC 2.0", "Brembo Stylema", "Aerodynamic winglets", "Throttle by wire"],
  },
];

export const formatKES = (n: number) =>
  "KES " + n.toLocaleString("en-KE");

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
