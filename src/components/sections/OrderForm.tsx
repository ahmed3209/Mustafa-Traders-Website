"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { orderSchema, type OrderFormValues } from "@/lib/validations/order";
import { product } from "@/config/product";
import { PAKISTAN_CITIES } from "@/config/cities";
import { site } from "@/config/site";
import { formatPKR } from "@/lib/utils";
import { useSelection } from "@/components/providers/SelectionProvider";
import { usePricing } from "@/components/providers/PricingProvider";

// #order — cream zone. Form + sticky dark summary. Advance bank transfer.
export function OrderForm() {
  const router = useRouter();
  const { size, setSize, quantity, setQuantity } = useSelection();
  const { enabled, get } = usePricing();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      mattressSize: size,
      quantity,
      paymentMethod: product.paymentMethods[0],
    },
  });

  useEffect(() => {
    setValue("mattressSize", size, { shouldValidate: true });
    setValue("quantity", quantity, { shouldValidate: true });
  }, [size, quantity, setValue]);

  const current = get(size);
  const unitPrice = current?.effectivePrice ?? 0;
  const total = unitPrice * quantity;

  async function onSubmit(values: OrderFormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, mattressSize: size, quantity }),
      });
      if (!res.ok) throw new Error("Order failed");
      const { id } = await res.json();
      const q = new URLSearchParams({
        id,
        name: values.customerName,
        city: values.city,
        size: current?.label ?? "",
        qty: String(quantity),
        total: formatPKR(total),
      });
      router.push(`/order-success?${q.toString()}`);
    } catch {
      setServerError("Something went wrong. Please try again or WhatsApp us.");
      setSubmitting(false);
    }
  }

  const labelCls =
    "mb-[7px] block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-charcoal";
  const errCls = "mt-[5px] text-[0.75rem] text-error";

  return (
    <section
      id="order"
      className="bg-cream px-[5%] py-20 md:py-[88px]"
      style={{ borderTop: "0.5px solid #E8DDD0" }}
    >
      <div className="mx-auto max-w-content">
        <div className="bm-rev mb-12 text-center">
          <div className="eyebrow mb-3">Checkout</div>
          <h2
            className="font-display font-bold text-charcoal"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
          >
            Place Your Order
          </h2>
          <p className="mt-2.5 text-sm font-light text-text-muted">
            Advance bank transfer · Free shipping across Pakistan · We call to
            confirm.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_360px]"
        >
          {/* Form */}
          <div className="bm-rev">
            {/* honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customerName" className={labelCls}>Full Name *</label>
                <input id="customerName" className="field" autoComplete="name" placeholder="e.g. Ahmed Khan" {...register("customerName")} />
                {errors.customerName && <div className={errCls} role="alert">{errors.customerName.message}</div>}
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>Phone Number *</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="03XXXXXXXXX" {...register("phone")} />
                {errors.phone && <div className={errCls} role="alert">{errors.phone.message}</div>}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="whatsappNumber" className={labelCls}>WhatsApp (Optional)</label>
                <input id="whatsappNumber" type="tel" inputMode="tel" className="field" placeholder="Same as phone" {...register("whatsappNumber")} />
              </div>
              <div>
                <label htmlFor="city" className={labelCls}>City *</label>
                <select id="city" className="field" defaultValue="" {...register("city")}>
                  <option value="" disabled>-- Select City --</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <div className={errCls} role="alert">{errors.city.message}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="address" className={labelCls}>Full Delivery Address *</label>
              <textarea id="address" rows={3} className="field" autoComplete="street-address" placeholder="House/Flat No., Street, Area…" style={{ resize: "vertical", lineHeight: 1.6 }} {...register("address")} />
              {errors.address && <div className={errCls} role="alert">{errors.address.message}</div>}
            </div>

            <div className="mb-4">
              <span className={labelCls}>Mattress Size *</span>
              <div className="flex flex-wrap gap-2">
                {enabled.map((s) => {
                  const active = s.size === size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSize(s.size)}
                      aria-pressed={active}
                      className="min-h-[44px] cursor-pointer px-4 py-2 text-[0.8125rem] transition-all"
                      style={{
                        border: `1.5px solid ${active ? "#B8864E" : "#D4C4B0"}`,
                        color: active ? "#1C1412" : "#78716C",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {s.label} ({s.dimensions})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-[18px]">
              <span className={labelCls + " mb-0"}>Quantity</span>
              <div className="flex items-center border-[1.5px] border-border-subtle">
                <button type="button" onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))} disabled={quantity <= product.minQuantity} aria-label="Decrease quantity" className="h-[42px] w-[42px] text-base text-charcoal disabled:opacity-40">−</button>
                <span className="flex h-[42px] w-[42px] items-center justify-center border-x-[1.5px] border-border-subtle text-[0.95rem] font-semibold tabular-nums">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + 1))} disabled={quantity >= product.maxQuantity} aria-label="Increase quantity" className="h-[42px] w-[42px] text-base text-charcoal disabled:opacity-40">+</button>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="orderNotes" className={labelCls}>Order Notes (Optional)</label>
              <textarea id="orderNotes" rows={2} className="field" placeholder="Any special instructions…" style={{ resize: "vertical", lineHeight: 1.6 }} {...register("orderNotes")} />
            </div>

            {/* Payment notice */}
            <div className="mb-5 flex items-center gap-2.5 border-l-[3px] border-gold bg-linen px-4 py-3.5">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#B8864E" aria-hidden="true">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
              <div>
                <div className="text-[0.8125rem] font-semibold text-charcoal">Payment: Advance Bank Transfer</div>
                <div className="mt-0.5 text-[0.75rem] font-light text-text-muted">We&apos;ll share account details on call to confirm your order.</div>
              </div>
            </div>

            {/* hidden payment field for the schema */}
            <input type="hidden" {...register("paymentMethod")} />

            <button type="submit" disabled={submitting} className="bm-btn-gold w-full" style={{ fontSize: "0.9375rem", padding: "1.1rem 2rem", minHeight: 58, letterSpacing: "0.08em" }}>
              {submitting ? (
                <>
                  <span className="inline-block h-[17px] w-[17px] rounded-full border-[2.5px] border-charcoal/25 border-t-charcoal" style={{ animation: "bm-spin 0.7s linear infinite" }} />
                  Placing order…
                </>
              ) : (
                <>Place order → {formatPKR(total)}</>
              )}
            </button>
          </div>

          {/* Sticky summary */}
          <aside className="bm-rev bm-d1 md:sticky md:top-20">
            <div className="bg-charcoal p-7">
              <div className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
                Order Summary
              </div>
              <div className="mb-5 flex items-center gap-3.5 border-b border-cream/10 pb-5">
                <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden bg-deep">
                  <Image src={product.gallery[0].src} alt="" fill sizes="60px" className="object-cover" />
                </div>
                <div>
                  <div className="mb-[3px] font-display text-[0.9rem] font-bold text-cream">{product.displayName}</div>
                  <div className="text-[0.72rem] font-light text-cream/45">Pocket Spring Mattress</div>
                </div>
              </div>
              {[
                ["Size", `${current?.label}`],
                ["Quantity", String(quantity)],
              ].map(([k, v]) => (
                <div key={k} className="mb-[9px] flex justify-between text-[0.8125rem]">
                  <span className="font-light text-cream/50">{k}</span>
                  <span className="font-medium text-cream tabular-nums">{v}</span>
                </div>
              ))}
              <div className="mb-[9px] flex justify-between text-[0.8125rem]">
                <span className="font-light text-cream/50">Unit Price</span>
                <span className="font-medium text-cream tabular-nums">
                  {current?.hasDiscount && (
                    <span className="mr-2 font-light text-cream/40 line-through">
                      {formatPKR(current.price)}
                    </span>
                  )}
                  {formatPKR(unitPrice)}
                </span>
              </div>
              {current?.hasDiscount && (
                <div className="mb-[9px] flex justify-between text-[0.8125rem]">
                  <span className="font-light text-cream/50">
                    Discount{current.discountLabel ? ` (${current.discountLabel})` : ""}
                  </span>
                  <span className="font-semibold text-success tabular-nums">
                    − {formatPKR(current.savings * quantity)}
                  </span>
                </div>
              )}
              <div className="mb-[9px] flex justify-between text-[0.8125rem]">
                <span className="font-light text-cream/50">Delivery</span>
                <span className="font-semibold text-success">FREE</span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between border-t border-cream/10 pt-3.5">
                <span className="text-[0.9rem] font-semibold text-cream">Total</span>
                <span className="font-display text-[1.25rem] font-bold text-gold tabular-nums">{formatPKR(total)}</span>
              </div>
              {serverError && (
                <p className="mt-3 text-[0.8rem] text-error" role="alert" aria-live="polite">{serverError}</p>
              )}
              <div className="mt-4 border-[0.5px] border-gold/20 bg-gold/[0.08] px-3.5 py-3 text-[0.72rem] font-light leading-[1.7] text-cream/50">
                🏦 Advance Bank Transfer · 🚚 Free shipping · 🏅 20-Year Warranty
              </div>
            </div>
            <div className="border-[0.5px] border-t-0 border-border-subtle bg-linen p-[18px]">
              <p className="mb-2.5 text-[0.78rem] font-light leading-[1.7] text-text-muted">Need help? We&apos;re a WhatsApp or call away.</p>
              <a href={site.whatsapp.link()} target="_blank" rel="noopener noreferrer" className="mb-[7px] flex items-center gap-[7px] text-[0.8rem] font-semibold text-success">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#25D366" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                WhatsApp: {site.phone.display}
              </a>
              <a href={site.phone.tel} className="flex items-center gap-[7px] text-[0.8rem] font-semibold text-charcoal">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#1C1412" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                Call: {site.phone.display}
              </a>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
