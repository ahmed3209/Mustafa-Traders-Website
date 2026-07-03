// Business / contact configuration (UI/UX Guide §1, §6).
// Public values are also surfaced via NEXT_PUBLIC_* env vars.

const rawPhone = process.env.NEXT_PUBLIC_PHONE ?? "03324989289";
const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP ?? "923324989289";

export const site = {
  name: "Mustafa Traders", // business / store name
  product: "Dream Cloud", // product model
  productName: "Boston Dream Cloud", // full product name as marketed
  usp: "Pakistan's First Pocket Spring Mattress in a Box",
  description:
    "The Boston Dream Cloud pocket spring mattress from Mustafa Traders — Pakistan's first mattress in a box. Better support, less motion transfer, 20-year warranty. Free nationwide delivery.",
  url: "https://mustafatraders.vercel.app",

  taglines: {
    hero: "Dream Cloud, Dream Deeper",
    product: "Designed for Better Sleep & Better Mornings",
    delivery: "Small Box. Big Comfort.",
  },

  phone: {
    display: "0332-4989289",
    raw: rawPhone,
    tel: `tel:+92${rawPhone.replace(/^0/, "")}`,
  },

  whatsapp: {
    number: rawWhatsApp,
    defaultMessage:
      "Salam! I'm interested in the Boston Dream Cloud mattress. Please guide me.",
    link(message?: string): string {
      const text = encodeURIComponent(message ?? this.defaultMessage);
      return `https://wa.me/${this.number}?text=${text}`;
    },
  },

  businessHours: "Mon–Sat, 10am–8pm PKT",
  deliveryArea: "Nationwide (all of Pakistan)",
} as const;
