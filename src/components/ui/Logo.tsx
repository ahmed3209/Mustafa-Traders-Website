// Mustafa Traders business logo lockup: bold serif "MUSTAFA" + gold "TRADERS"
// set off by a thin left rule (mirrors the Claude Design lockup).
export function Logo({ size = 1.5 }: { size?: number }) {
  return (
    <span
      className="inline-flex select-none items-center leading-none"
      aria-label="Mustafa Traders"
    >
      <span
        className="font-display font-bold text-cream"
        style={{ fontSize: `${size}rem`, letterSpacing: "-0.01em" }}
      >
        MUSTAFA
      </span>
      <span
        className="font-body font-semibold uppercase text-gold"
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          borderLeft: "0.5px solid rgba(184,134,78,0.3)",
          paddingLeft: "9px",
          marginLeft: "9px",
          lineHeight: 1.4,
        }}
      >
        Traders
      </span>
    </span>
  );
}
