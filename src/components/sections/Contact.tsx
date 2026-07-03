"use client";

import { site } from "@/config/site";
import { useChat } from "@/components/ui/LiveChat";

// #contact — charcoal zone, 3 channel cards.
export function Contact() {
  const { open } = useChat();

  return (
    <section id="contact" className="bg-charcoal px-[5%] py-20 md:py-[88px]">
      <div className="mx-auto max-w-content">
        <div className="bm-rev mb-12 text-center">
          <div className="eyebrow mb-3">Get in Touch</div>
          <h2
            className="font-display font-bold text-cream"
            style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}
          >
            We&apos;re Here to Help.
          </h2>
          <p className="mt-2.5 text-sm font-light text-cream/50">
            Available {site.businessHours}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-deep md:grid-cols-3">
          {/* WhatsApp */}
          <div className="bm-rev bm-d1 bg-charcoal px-7 py-9 text-center">
            <div className="mx-auto mb-[18px] flex h-[52px] w-[52px] items-center justify-center" style={{ background: "rgba(37,211,102,0.12)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
            </div>
            <h3 className="mb-2 text-[0.9375rem] font-semibold text-cream">WhatsApp</h3>
            <p className="mb-[18px] text-[0.8rem] font-light leading-[1.7] text-cream/45">Quick replies during business hours. Message us anytime.</p>
            <a href={site.whatsapp.link()} target="_blank" rel="noopener noreferrer" className="inline-block bg-whatsapp px-[22px] py-2.5 text-[0.8rem] font-semibold tracking-[0.04em] text-white">Chat on WhatsApp</a>
          </div>

          {/* Call */}
          <div className="bm-rev bm-d2 bg-charcoal px-7 py-9 text-center">
            <div className="mx-auto mb-[18px] flex h-[52px] w-[52px] items-center justify-center" style={{ background: "rgba(184,134,78,0.12)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#B8864E" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
            </div>
            <h3 className="mb-2 text-[0.9375rem] font-semibold text-cream">Call Us</h3>
            <p className="mb-[18px] text-[0.8rem] font-light leading-[1.7] text-cream/45">{site.businessHours}. Speak directly with our team.</p>
            <a href={site.phone.tel} className="inline-block bg-gold px-[22px] py-2.5 text-[0.8rem] font-bold tracking-[0.04em] text-charcoal">{site.phone.display}</a>
          </div>

          {/* Live chat */}
          <div className="bm-rev bm-d3 bg-charcoal px-7 py-9 text-center">
            <div className="mx-auto mb-[18px] flex h-[52px] w-[52px] items-center justify-center" style={{ background: "rgba(253,250,246,0.06)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="rgba(253,250,246,0.6)" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
            </div>
            <h3 className="mb-2 text-[0.9375rem] font-semibold text-cream">Live Chat</h3>
            <p className="mb-[18px] text-[0.8rem] font-light leading-[1.7] text-cream/45">Chat right here on the site using the button in the bottom-left corner.</p>
            <button type="button" onClick={open} className="border border-cream/15 bg-cream/[0.08] px-[22px] py-2.5 text-[0.8rem] font-medium tracking-[0.04em] text-cream">Start Chat</button>
          </div>
        </div>
      </div>
    </section>
  );
}
