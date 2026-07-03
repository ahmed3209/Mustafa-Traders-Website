import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Product } from "@/components/sections/Product";
import { Reasons } from "@/components/sections/Reasons";
import { Delivery } from "@/components/sections/Delivery";
import { OrderForm } from "@/components/sections/OrderForm";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { SelectionProvider } from "@/components/providers/SelectionProvider";
import { PricingProvider } from "@/components/providers/PricingProvider";
import { ChatProvider } from "@/components/ui/LiveChat";
import { getPricing, enabledResolved } from "@/lib/pricing";
import { site } from "@/config/site";
import { product } from "@/config/product";

// Prices/discounts are admin-managed → always fetch fresh.
export const dynamic = "force-dynamic";

// Single-scroll landing page — Mustafa Traders (Boston Dream Cloud mattress).
// Layout implements the Claude Design "Boston Mattress Store" prototype.
export default async function HomePage() {
  const pricing = await getPricing();
  const enabled = enabledResolved(pricing);
  const prices = enabled.map((s) => s.effectivePrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": `${site.url}/#store`,
        name: site.name,
        url: site.url,
        telephone: site.phone.display,
        areaServed: "PK",
        priceRange: "₨₨",
        openingHours: "Mo-Sa 10:00-20:00",
      },
      {
        "@type": "Product",
        name: product.displayName,
        description: site.usp,
        brand: { "@type": "Brand", name: "Boston" },
        image: product.gallery.map((g) => `${site.url}${g.src}`),
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "PKR",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: enabled.length,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: site.name },
        },
      },
    ],
  };

  return (
    <ChatProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingProvider sizes={pricing}>
        <SelectionProvider>
          <Navbar />
          <main>
            <Hero />
            <TrustBar />
            <Product />
            <Reasons />
            <Delivery />
            <OrderForm />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
          <WhatsAppFloat />
          <RevealObserver />
        </SelectionProvider>
      </PricingProvider>
    </ChatProvider>
  );
}
