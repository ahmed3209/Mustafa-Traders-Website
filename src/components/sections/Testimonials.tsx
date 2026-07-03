import { testimonials } from "@/config/testimonials";

// #testimonials — linen zone, 4 review cards.
export function Testimonials() {
  return (
    <section id="testimonials" className="bg-linen px-[5%] py-20 md:py-[88px]">
      <div className="mx-auto max-w-content">
        <div className="bm-rev mb-12 text-center">
          <div className="eyebrow mb-3">Customer Reviews</div>
          <h2
            className="font-display font-bold text-charcoal"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
          >
            Feel the Difference.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`bm-rev bm-d${Math.min(i + 1, 4)} border-[0.5px] border-border-subtle bg-cream p-7`}
            >
              <div
                className="mb-3.5 text-[0.95rem] text-gold"
                style={{ letterSpacing: "3px" }}
                aria-label={`${t.rating} out of 5 stars`}
              >
                {"★".repeat(t.rating)}
              </div>
              <blockquote className="mb-[18px] font-display text-[0.95rem] italic leading-[1.8] text-charcoal">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-[0.8rem] font-semibold text-charcoal">
                {t.name} <span className="font-light text-text-muted">· {t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
