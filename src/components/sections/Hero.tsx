"use client";

import Image from "next/image";
import { product } from "@/config/product";
import { site } from "@/config/site";
import { useCarousel } from "@/lib/useCarousel";

// #hero — charcoal zone, 2-column (text + image carousel). No Three.js.
export function Hero() {
  const { index, setIndex } = useCarousel(product.gallery.length);

  return (
    <section
      id="hero"
      className="relative grid min-h-[100vh] grid-cols-1 items-center overflow-hidden md:grid-cols-2"
      style={{ background: "#1C1412" }}
    >
      {/* soft gold glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[55%] md:block"
        style={{
          background:
            "radial-gradient(ellipse at 65% 45%, rgba(184,134,78,0.07) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Text */}
      <div
        className="max-w-[660px] px-[6%] py-14 md:py-20 md:pl-[8%] md:pr-[5%]"
        style={{ animation: "bm-fadeUp 0.9s ease both 0.1s" }}
      >
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="h-px w-[18px] bg-gold" />
          <span className="eyebrow">Mustafa Traders · Pakistan</span>
          <span className="h-px w-[18px] bg-gold" />
        </div>

        <h1
          className="font-display font-bold text-cream"
          style={{ fontSize: "clamp(2.6rem,5.5vw,5.5rem)", lineHeight: 1.05 }}
        >
          {product.name},
        </h1>
        <div
          className="font-display italic text-gold"
          style={{
            fontSize: "clamp(2.6rem,5.5vw,5.5rem)",
            lineHeight: 1.05,
            marginBottom: "22px",
          }}
        >
          Dream Deeper.
        </div>

        <p className="mb-9 max-w-[420px] text-base font-light leading-[1.8] text-cream/60">
          Pakistan&apos;s first pocket spring mattress in a box — 20 years of
          premium sleep delivered free to your door.
        </p>

        <div className="mb-14 flex flex-wrap gap-3.5">
          <a href="#order" className="bm-btn-hero">
            Order now
          </a>
          <a href="#reasons" className="bm-btn-ghost">
            What&apos;s inside ↓
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-y-5">
          {product.heroStats.map((s, i) => (
            <div
              key={s.label}
              className={
                i < product.heroStats.length - 1
                  ? "mr-6 border-r border-gold/20 pr-6"
                  : ""
              }
            >
              <div className="font-display text-[1.75rem] font-bold leading-none text-gold">
                {s.value}
                {s.unit && <span className="text-[0.85rem]">{s.unit}</span>}
              </div>
              <div className="mt-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image carousel */}
      <div className="relative flex h-[52vw] min-h-[200px] items-center justify-center px-[6%] py-5 md:h-[84vh] md:min-h-[360px] md:py-10 md:pl-[4%] md:pr-[8%]">
        <div className="relative h-[90%] w-full max-w-[520px]">
          <div
            className="pointer-events-none absolute z-[1] border border-gold/20"
            style={{ top: -10, right: -10, bottom: 10, left: 10 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 overflow-hidden bg-deep">
            {product.gallery.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                priority={i === 0}
                className="object-cover transition-opacity duration-500"
                style={{ opacity: i === index ? 1 : 0 }}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(28,20,18,0.6), transparent)",
              }}
              aria-hidden="true"
            />
          </div>
          <div className="absolute bottom-[-22px] left-1/2 z-[2] flex -translate-x-1/2 gap-2">
            {product.gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className="h-[7px] w-[7px] rounded-full"
                style={{
                  background:
                    i === index ? "#B8864E" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
