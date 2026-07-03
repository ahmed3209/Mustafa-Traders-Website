"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";

const links = [
  { href: "#product", label: "Mattress" },
  { href: "#reasons", label: "Features" },
  { href: "#delivery", label: "How It Works" },
  { href: "#order", label: "Order" },
  { href: "#contact", label: "Contact" },
];

const PhoneIcon = ({ size = 14, fill = "rgba(253,250,246,0.65)" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-[200] border-b"
        style={{
          background: "rgba(28,20,18,0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: "rgba(184,134,78,0.15)",
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-content items-center justify-between px-[5%]">
          <a href="#hero" aria-label="Mustafa Traders home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[0.8125rem] text-cream/70 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3.5">
            <a
              href={site.phone.tel}
              className="hidden items-center gap-1.5 text-[0.8125rem] font-medium text-cream/65 transition-colors hover:text-cream md:flex"
            >
              <PhoneIcon />
              Call us
            </a>
            <a
              href="#order"
              className="bm-btn-hero"
              style={{ padding: "9px 20px", minHeight: 40, fontSize: "0.8rem" }}
            >
              Order now
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex flex-col items-end gap-[5px] p-1.5 md:hidden"
            >
              <span className="block h-[1.5px] w-[22px] bg-cream" />
              <span className="block h-[1.5px] w-[22px] bg-cream" />
              <span className="block h-[1.5px] w-[14px] bg-cream" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-7 bg-charcoal">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-[22px] top-5 p-2 text-3xl leading-none text-cream/70"
          >
            ×
          </button>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl text-cream"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className="font-display text-3xl text-gold"
          >
            Order now
          </a>
          <a
            href={site.phone.tel}
            className="mt-2 text-sm text-cream/55"
          >
            Call us: {site.phone.display}
          </a>
        </div>
      )}
    </>
  );
}
