// Customer reviews shown in the Testimonials section.
// Seeded from the Claude Design prototype (Pakistani names + cities).
// Replace with real reviews when available.
export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  rating: number; // 1–5
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "The pocket springs are incredible — I can't feel my husband moving at all. Best sleep investment we've ever made.",
    name: "Fatima A.",
    city: "Karachi",
    rating: 5,
  },
  {
    quote:
      "Ordered online, confirmed by call next morning, delivered in 4 days in a box. Unrolled perfectly. Truly amazing.",
    name: "Hassan M.",
    city: "Lahore",
    rating: 5,
  },
  {
    quote:
      "My back pain improved in the first week. The 8-inch pocket spring support is exactly what I needed. Highly recommend!",
    name: "Zainab K.",
    city: "Islamabad",
    rating: 5,
  },
  {
    quote:
      "Bought King size for my parents as a gift. The 20-Year Warranty sealed the deal for us. Worth every rupee.",
    name: "Ali R.",
    city: "Faisalabad",
    rating: 5,
  },
];
