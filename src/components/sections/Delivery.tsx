import { site } from "@/config/site";

// #delivery — linen zone, 3-step "how it works".
const steps = [
  {
    n: 1,
    title: "Order Online",
    body: "Choose your size, fill in your details, and place your order in under 2 minutes. Advance bank transfer.",
  },
  {
    n: 2,
    title: "We Confirm by Phone",
    body: "Our team calls within 24 hours to verify your order and delivery address. No hidden charges.",
  },
  {
    n: 3,
    title: "Delivered to Your Door",
    body: "Arrives in 3–7 business days in the compact Boston-branded box. Unbox, unroll, sleep better tonight.",
  },
];

export function Delivery() {
  return (
    <section id="delivery" className="bg-linen px-[5%] py-20 md:py-[88px]">
      <div className="mx-auto max-w-content">
        <div className="bm-rev mb-14 text-center">
          <div className="eyebrow mb-3">How It Works</div>
          <h2
            className="font-display font-bold text-charcoal"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
          >
            {site.taglines.delivery}
          </h2>
          <p className="mx-auto mt-2.5 max-w-[400px] text-sm font-light leading-[1.8] text-text-muted">
            Easy to carry. Easy to set up. Made for better sleep.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`bm-rev bm-d${i + 1} border-[0.5px] border-border-subtle bg-cream p-9`}
            >
              <div className="mb-[22px] flex h-16 w-16 items-center justify-center bg-charcoal font-display text-[1.6rem] font-bold text-gold">
                {s.n}
              </div>
              <h3 className="mb-2.5 text-base font-semibold text-charcoal">
                {s.title}
              </h3>
              <p className="text-[0.8125rem] font-light leading-[1.8] text-text-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
