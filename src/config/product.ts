import type { MattressSize, PaymentMethod } from "@/types/order";

// ─────────────────────────────────────────────────────────────
// Product configuration — single source of truth for the one
// mattress this store sells: Boston Mattress® "Dream Cloud".
//
// Owner-confirmed:
//   • King  78" × 72"  → Rs. 85,000
//   • Queen 78" × 66"  → Rs. 75,000
//   • Single / Double  → not sold at launch (enabled: false)
//   • Warranty: 20 years (key differentiator)
//   • Payment: Advance Bank Transfer only at launch (admin can add COD later)
//   • Discounts: set `originalPrice` above `price` to show a struck-through
//     old price + bold new price (admin-manageable later).
//
// Layout/copy follows the Claude Design "Boston Mattress Store" prototype.
// ─────────────────────────────────────────────────────────────

export interface SizeOption {
  size: MattressSize;
  label: string;
  dimensions: string;
  price: number;
  originalPrice?: number;
  enabled: boolean;
}

export interface GalleryImage {
  src: string; // path under /public
  alt: string;
  // How the image should fit its box. Use "cover" for photos that look good
  // filling the frame, "contain" for graphics/diagrams that must show in full
  // (e.g. the box-process and close-up grid) so nothing gets cropped.
  fit?: "cover" | "contain";
}

export interface HeroStat {
  value: string;
  unit?: string;
  label: string;
}

export interface Layer {
  title: string;
  description: string;
}

export interface Reason {
  title: string;
  description: string;
}

export interface TrustItem {
  label: string;
}

export interface ProductConfig {
  name: string; // "Dream Cloud"
  displayName: string; // "Boston Dream Cloud"
  type: string;
  tagline: string;
  description: string;
  sizes: SizeOption[];
  heroStats: HeroStat[];
  gallery: GalleryImage[]; // carousel (hero + product)
  layersImage: GalleryImage; // cross-section for the layers breakdown
  layers: Layer[]; // 4 engineered layers
  reasons: Reason[]; // 5 reasons grid
  trustStrip: TrustItem[]; // product icon strip
  footerBadges: TrustItem[];
  inStock: boolean;
  warrantyYears: number;
  minQuantity: number;
  maxQuantity: number;
  paymentMethods: PaymentMethod[]; // first item is the default
  deliveryEstimate: string;
}

export const product: ProductConfig = {
  name: "Dream Cloud",
  displayName: "Boston Dream Cloud",
  type: "Pocket Spring Mattress in a Box",
  tagline: "Designed for Better Sleep & Better Mornings",
  description:
    "Pakistan's first pocket spring mattress in a box — your sleep companion for 20 years.",
  sizes: [
    { size: "king", label: "King", dimensions: '78"×72"', price: 85000, enabled: true },
    { size: "queen", label: "Queen", dimensions: '78"×66"', price: 75000, enabled: true },
    { size: "double", label: "Double", dimensions: '54"×75"', price: 0, enabled: false },
    { size: "single", label: "Single", dimensions: '36"×75"', price: 0, enabled: false },
  ],
  heroStats: [
    { value: "20", unit: "yr", label: "Warranty" },
    { value: '8"', label: "Thickness" },
    { value: "4", label: "Layers" },
    { value: "Free", label: "Delivery PK" },
  ],
  gallery: [
    {
      src: "/images/dream-cloud-bedroom.png",
      alt: "Boston Dream Cloud mattress on a wooden bed frame in a styled bedroom",
      fit: "cover", // lifestyle photo — fills the frame nicely
    },
    {
      src: "/images/dream-cloud-details.png",
      alt: "Close-ups of Dream Cloud pocket springs, quilted cover fabric and foam layer",
      fit: "contain", // grid graphic — show in full, don't crop
    },
    {
      src: "/images/dream-cloud-box.png",
      alt: "Boston Dream Cloud mattress shown flat, rolled, and boxed",
      fit: "contain", // box-process graphic — show in full, don't crop
    },
  ],
  layersImage: {
    src: "/images/dream-cloud-layers.png",
    alt: "Boston Dream Cloud cross-section — comfort foam, pocket springs, high-density foam and fire-proof base",
  },
  // 4 engineered layers (from the design's cross-section breakdown).
  layers: [
    {
      title: "Comfort Foam Layer",
      description:
        "Soft, breathable foam that cradles your body for cloud-like comfort. Temperature-regulating and hypoallergenic.",
    },
    {
      title: "Pocket Spring System",
      description:
        "Individually wrapped high-carbon steel springs — rock solid, sag-proof, silent, odor-free. Reduces partner disturbance.",
    },
    {
      title: "High Density Foam",
      description:
        "Strong support maintaining proper spine alignment and long-term durability. Sponge + non-woven cotton felt construction.",
    },
    {
      title: "Fire-Proof Safety Layer",
      description:
        "Advanced fire-proof barrier at the base — industry-standard protection for your safety and peace of mind.",
    },
  ],
  reasons: [
    {
      title: "Perfect Back Support",
      description:
        "Pocket springs conform to your spine's natural curve for orthopedic-grade support every night.",
    },
    {
      title: "Peaceful Sleep",
      description:
        "Independent springs absorb movement — you won't feel your partner shift at night.",
    },
    {
      title: "Premium Comfort",
      description:
        "Plush knitted fabric top + multi-layer foam = the feel of a luxury hotel, in your home.",
    },
    {
      title: "Long-Lasting Quality",
      description:
        "High-carbon steel springs + fire-proof base engineered to last 20 years without sagging.",
    },
    {
      title: "In a Box",
      description:
        "Pakistan's first boxed spring mattress. Easy to carry, easy to set up — just unbox and unroll.",
    },
  ],
  trustStrip: [
    { label: "Pocket Springs" },
    { label: "Breathable Cover" },
    { label: "20-Yr Warranty" },
    { label: "In a Box" },
  ],
  footerBadges: [
    { label: "Premium Pocket Springs" },
    { label: "Better Support Every Night" },
    { label: "Less Motion Transfer" },
    { label: "Quality You Can Trust" },
  ],
  inStock: true,
  warrantyYears: 20,
  minQuantity: 1,
  maxQuantity: 5,
  paymentMethods: ["bank_transfer"], // advance bank transfer only at launch
  deliveryEstimate: "3–7 business days",
};

// Helpers ──────────────────────────────────────────────────────

export const enabledSizes = (): SizeOption[] =>
  product.sizes.filter((s) => s.enabled);

export const getSize = (size: MattressSize): SizeOption | undefined =>
  product.sizes.find((s) => s.size === size);

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Advance Bank Transfer",
  cod: "Cash on Delivery",
};
