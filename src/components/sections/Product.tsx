"use client";

import Image from "next/image";
import { product } from "@/config/product";
import { site } from "@/config/site";
import { formatPKR } from "@/lib/utils";
import { useCarousel } from "@/lib/useCarousel";
import { useSelection } from "@/components/providers/SelectionProvider";
import { usePricing } from "@/components/providers/PricingProvider";

// #product — cream zone. Gallery (left) + details (right). Size/qty shared
// with the order form via SelectionProvider. Prices/discounts come from the
// admin-managed PricingProvider.
export function Product() {
  const { index, setIndex } = useCarousel(product.gallery.length);
  const { size, setSize, quantity, setQuantity } = useSelection();
  const { enabled, get } = usePricing();
  const current = get(size);
  const unitPrice = current?.effectivePrice ?? 0;
  const total = unitPrice * quantity;

  return (
    <section id="product" className="bg-cream px-[5%] py-20 md:py-[88px]">
      <div className="mx-auto grid max-w-content grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Gallery */}
        <div className="bm-rev">
          <div className="relative aspect-[4/3] overflow-hidden bg-linen">
            {product.gallery.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                priority={i === 0}
                className={`transition-opacity duration-500 ${
                  img.fit === "contain" ? "object-contain" : "object-cover"
                }`}
                style={{ opacity: i === index ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {product.gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View ${img.alt}`}
                aria-current={i === index}
                className="relative h-14 flex-1 overflow-hidden border bg-white transition-colors"
                style={{ borderColor: i === index ? "#B8864E" : "#E8DDD0" }}
              >
                <Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bm-rev bm-d1">
          <div className="eyebrow mb-2.5">Pocket Spring Mattress</div>
          <h2 className="font-display text-[2.25rem] font-bold leading-[1.1] text-charcoal">
            {product.displayName}
          </h2>
          <p className="mt-1.5 text-sm font-light leading-[1.8] text-text-muted">
            Designed for better sleep and better mornings. Pakistan&apos;s first
            pocket spring mattress in a box — your sleep companion for 20 years.
          </p>

          {/* Price + discount */}
          <div className="mb-[22px] mt-5">
            {current?.hasDiscount && (
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-error px-2.5 py-[3px] text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-white">
                  {current.discountLabel || `${current.discountPercent}% OFF`}
                </span>
                <span className="text-[0.75rem] font-semibold text-error">
                  Save {formatPKR(current.savings)}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-baseline gap-3">
              {current?.hasDiscount && (
                <span className="font-display text-[1.15rem] font-medium text-text-muted line-through">
                  {formatPKR(current.price)}
                </span>
              )}
              <span className="font-display text-[1.75rem] font-bold text-gold">
                {formatPKR(unitPrice)}
              </span>
              <span className="bg-[#F0FFF4] px-2.5 py-[3px] text-[0.6875rem] font-bold tracking-[0.05em] text-success">
                FREE DELIVERY
              </span>
            </div>
          </div>

          {/* Size */}
          <div className="mb-5">
            <div className="mb-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-charcoal">
              Select Size
            </div>
            <div className="flex flex-wrap gap-2">
              {enabled.map((s) => {
                const active = s.size === size;
                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSize(s.size)}
                    aria-pressed={active}
                    className="min-h-[44px] cursor-pointer px-4 py-2 text-[0.8125rem] leading-[1.3] transition-all"
                    style={{
                      border: `1.5px solid ${active ? "#B8864E" : "#D4C4B0"}`,
                      color: active ? "#1C1412" : "#78716C",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {s.label}
                    <br />
                    <span className="text-[0.68rem] font-normal opacity-65">
                      {s.dimensions}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6 flex items-center gap-[18px]">
            <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-charcoal">
              Quantity
            </div>
            <div className="flex items-center border-[1.5px] border-border-subtle">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))}
                disabled={quantity <= product.minQuantity}
                aria-label="Decrease quantity"
                className="h-[42px] w-[42px] text-[1.1rem] text-charcoal disabled:opacity-40"
              >
                −
              </button>
              <span className="flex h-[42px] w-[42px] items-center justify-center border-x-[1.5px] border-border-subtle text-[0.95rem] font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + 1))}
                disabled={quantity >= product.maxQuantity}
                aria-label="Increase quantity"
                className="h-[42px] w-[42px] text-[1.1rem] text-charcoal disabled:opacity-40"
              >
                +
              </button>
            </div>
            <div className="text-sm text-text-muted">
              Total:{" "}
              <strong className="font-display text-base text-gold">
                {formatPKR(total)}
              </strong>
            </div>
          </div>

          {/* CTAs */}
          <div className="mb-6 flex flex-col gap-2.5">
            <a href="#order" className="bm-btn-gold w-full">
              Order now — {formatPKR(total)}
            </a>
            <a
              href={site.whatsapp.link(
                "Salam! I'm interested in the Boston Dream Cloud."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-[1.5px] border-whatsapp px-6 py-3 text-sm font-semibold text-success transition-all hover:bg-whatsapp/5"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#25D366" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              WhatsApp to Order
            </a>
          </div>

          {/* Icon trust strip */}
          <div className="grid grid-cols-4 border-[0.5px] border-border-subtle">
            {[
              { icon: "🌀", label: "Pocket Springs" },
              { icon: "🌬️", label: "Breathable Cover" },
              { icon: "🏅", label: "20-Yr Warranty" },
              { icon: "📦", label: "In a Box" },
            ].map((t, i) => (
              <div
                key={t.label}
                className="px-2.5 py-3 text-center"
                style={{ borderRight: i < 3 ? "0.5px solid #E8DDD0" : "none" }}
              >
                <div className="mb-1 text-base" aria-hidden="true">
                  {t.icon}
                </div>
                <div className="text-[0.65rem] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-text-muted">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
