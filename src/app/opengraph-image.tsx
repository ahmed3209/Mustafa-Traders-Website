import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mustafa Traders — Boston Dream Cloud Pocket Spring Mattress";

// Dynamically generated Open Graph / social share image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1C1412 0%, #2A2520 100%)",
          color: "#FDFAF6",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Business name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 8,
            fontWeight: 700,
            color: "#C9A84C",
          }}
        >
          MUSTAFA&nbsp;TRADERS
        </div>

        {/* Product */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
            Boston Dream Cloud
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontStyle: "italic",
              color: "#C9A84C",
              marginTop: 8,
            }}
          >
            Dream Deeper.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(253,250,246,0.65)",
              marginTop: 28,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Pakistan&apos;s first pocket spring mattress in a box.
          </div>
        </div>

        {/* Footer badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "Arial, sans-serif" }}>
          <div
            style={{
              display: "flex",
              background: "#C9A84C",
              color: "#1C1412",
              fontSize: 24,
              fontWeight: 700,
              padding: "10px 22px",
            }}
          >
            20-Year Warranty
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(253,250,246,0.75)" }}>
            Free delivery across Pakistan
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
