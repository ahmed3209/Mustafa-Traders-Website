import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";
import { product } from "@/config/product";

const quickLinks = [
  { href: "#product", label: "The Mattress" },
  { href: "#reasons", label: "Features" },
  { href: "#delivery", label: "How It Works" },
  { href: "#order", label: "Order Now" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer
      className="px-[5%] pb-7 pt-14"
      style={{ background: "#1C1412", borderTop: "0.5px solid rgba(184,134,78,0.15)" }}
    >
      <div className="mx-auto max-w-content">
        <div className="mb-11 grid grid-cols-1 gap-11 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-[18px]">
              <Logo size={1.6} />
            </div>
            <p className="mb-5 max-w-[280px] text-[0.8125rem] font-light leading-[1.8] text-cream/40">
              &ldquo;Feel the Difference, Sleep the Difference.&rdquo; Premium
              pocket spring comfort delivered nationwide across Pakistan.
            </p>
            <div className="flex gap-2.5">
              <a href={site.whatsapp.link()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center" style={{ background: "rgba(37,211,102,0.1)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
              </a>
              <a href={site.phone.tel} aria-label="Call" className="flex h-9 w-9 items-center justify-center" style={{ background: "rgba(184,134,78,0.1)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#B8864E" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">Quick Links</div>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-[0.8125rem] font-light text-cream/45 hover:text-gold">{l.label}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">Contact</div>
            <div className="flex flex-col gap-2.5 text-[0.8125rem] font-light text-cream/45">
              <div>📞 {site.phone.display}</div>
              <div>📱 WhatsApp Available</div>
              <div>🕐 {site.businessHours}</div>
              <div>🇵🇰 Pakistan Nationwide</div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mb-5 flex flex-wrap justify-center gap-7 border-t border-gold/10 py-5">
          {product.footerBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.06em] text-cream/35">
              <span className="text-gold">◆</span> {b.label}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 pt-5">
          <div className="text-[0.72rem] font-light text-cream/[0.28]">© {new Date().getFullYear()} Mustafa Traders. All rights reserved.</div>
          <div className="flex items-center gap-[18px]">
            <Link href="/privacy-policy" className="text-[0.72rem] text-cream/[0.28] hover:text-gold">Privacy Policy</Link>
            <Link href="/return-policy" className="text-[0.72rem] text-cream/[0.28] hover:text-gold">Return Policy</Link>
            <Link href="/admin" className="text-[0.68rem] text-cream/[0.15] hover:text-gold">Admin ↗</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
