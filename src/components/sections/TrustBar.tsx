// Trust bar under the hero (#2A2520). Payment item reads "Advance Bank
// Transfer" to match the store's actual payment method.
const items = [
  {
    label: "20-Year Warranty",
    path: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
  },
  {
    label: "Free Doorstep Delivery",
    path: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z",
  },
  {
    label: "Pakistan's First Boxed Spring",
    path: "M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.8 14H18c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21L4.27 3H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11v-2H7.17l1.1-2z",
  },
  {
    label: "Advance Bank Transfer",
    path: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  },
  {
    label: "All Pakistan",
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  },
];

export function TrustBar() {
  return (
    <div
      className="px-[5%] py-[17px]"
      style={{ background: "#2A2520", borderTop: "0.5px solid rgba(184,134,78,0.12)" }}
    >
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-7 gap-y-3.5">
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center">
            <div className="flex items-center gap-2 whitespace-nowrap text-[0.8rem] font-medium tracking-[0.03em] text-cream/75">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#B8864E" aria-hidden="true">
                <path d={it.path} />
              </svg>
              {it.label}
            </div>
            {i < items.length - 1 && (
              <span className="ml-7 hidden h-4 w-px bg-gold/20 md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
