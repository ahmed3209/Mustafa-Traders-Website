import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Order Placed",
  robots: { index: false },
};

// /order-success — mirrors the Claude Design success view. Reads summary params
// passed by the order form.
export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: {
    id?: string;
    name?: string;
    city?: string;
    size?: string;
    qty?: string;
    total?: string;
  };
}) {
  const { id = "—", name = "Customer", city = "your city", size, qty, total } =
    searchParams;

  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-linen px-[5%] py-10">
      <div
        className="w-full max-w-[520px] bg-cream px-9 py-[52px] text-center md:px-11"
        style={{ border: "0.5px solid #E8DDD0", boxShadow: "0 8px 48px rgba(28,20,18,0.1)" }}
      >
        <div className="mx-auto mb-7 flex h-[72px] w-[72px] items-center justify-center bg-gold">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#1C1412" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <div className="eyebrow mb-3">Order Confirmed</div>
        <h1 className="font-display text-[1.875rem] font-bold text-charcoal">
          Shukriya, {name}!
        </h1>
        <p className="mt-2.5 text-[0.9rem] font-light leading-[1.8] text-text-muted">
          Your{" "}
          <strong className="font-semibold text-charcoal">
            Boston Dream Cloud Mattress
          </strong>{" "}
          is heading to{" "}
          <strong className="font-semibold text-charcoal">{city}</strong>.
          Estimated delivery: <strong className="font-semibold">3–7 business days</strong>. We&apos;ll call to confirm.
        </p>

        <div
          className="my-7 px-6 py-5 text-left"
          style={{ background: "#F5EDE0", border: "0.5px solid #E8DDD0" }}
        >
          <div className="mb-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Order Summary
          </div>
          <Row k="Order ID" v={id} gold />
          {size && <Row k="Size" v={size} />}
          {qty && <Row k="Qty" v={qty} />}
          {total && (
            <div className="mt-1.5 flex justify-between border-t border-border-subtle pt-2.5">
              <span className="text-[0.95rem] font-bold">Total</span>
              <span className="font-display text-[1.15rem] font-bold text-gold">{total}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={site.whatsapp.link(`Salam! My order ${id} — I'd like to follow up.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-whatsapp px-4 py-3.5 text-center text-[0.875rem] font-semibold tracking-[0.03em] text-white"
          >
            Track Order on WhatsApp →
          </a>
          <a href={site.phone.tel} className="block bg-linen px-4 py-3 text-center text-[0.875rem] font-medium text-charcoal" style={{ border: "0.5px solid #E8DDD0" }}>
            Call us: {site.phone.display}
          </a>
          <Link href="/" className="block pt-1 text-[0.8rem] text-text-muted hover:text-gold">
            ← Back to store
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ k, v, gold }: { k: string; v: string; gold?: boolean }) {
  return (
    <div className="mb-2 flex justify-between text-[0.875rem]">
      <span className="text-text-muted">{k}</span>
      <span className={gold ? "font-semibold text-gold" : "font-medium text-charcoal"}>{v}</span>
    </div>
  );
}
