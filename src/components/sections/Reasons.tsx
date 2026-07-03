import Image from "next/image";
import { product } from "@/config/product";

// #reasons — charcoal zone. Layer breakdown (image + 4 numbered layers) then a
// 5-reason grid.
export function Reasons() {
  return (
    <section id="reasons" className="bg-charcoal px-[5%] py-20 md:py-[88px]">
      <div className="mx-auto max-w-content">
        <div className="bm-rev mb-14 text-center md:mb-[60px]">
          <div className="eyebrow mb-3">Why Boston Dream Cloud</div>
          <h2
            className="font-display font-bold text-cream"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
          >
            Not All Mattresses
            <br />
            Are Made the Same.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[460px] text-sm font-light leading-[1.8] text-cream/50">
            See what&apos;s inside your Boston Dream Cloud — 4 precision-engineered
            layers working in harmony.
          </p>
        </div>

        {/* Layers breakdown */}
        <div className="mb-[72px] grid grid-cols-1 items-center gap-[60px] md:grid-cols-2">
          <div className="bm-rev bm-d1">
            <Image
              src={product.layersImage.src}
              alt={product.layersImage.alt}
              width={900}
              height={900}
              sizes="(max-width: 768px) 100vw, 600px"
              className="h-auto w-full"
            />
          </div>
          <div>
            {product.layers.map((l, i) => (
              <div
                key={l.title}
                className={`bm-rev bm-d${i + 1} flex items-start gap-[18px] ${
                  i < product.layers.length - 1
                    ? "mb-7 border-b border-cream/[0.08] pb-7"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 min-w-[40px] items-center justify-center border-[1.5px] border-gold font-display text-[0.95rem] font-bold text-gold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-[5px] text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-cream">
                    {l.title}
                  </h3>
                  <p className="text-[0.8125rem] font-light leading-[1.7] text-cream/50">
                    {l.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5 reasons grid */}
        <div className="grid grid-cols-1 gap-px bg-deep sm:grid-cols-2 lg:grid-cols-5">
          {product.reasons.map((r, i) => (
            <div
              key={r.title}
              className={`bm-feat bm-rev bm-d${Math.min(i + 1, 4)} bg-charcoal px-[22px] py-7 text-center`}
            >
              <div className="mb-3 font-display text-2xl font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="mb-2 text-[0.8rem] font-semibold uppercase tracking-[0.05em] text-cream">
                {r.title}
              </h4>
              <p className="text-[0.78rem] font-light leading-[1.65] text-cream/45">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
