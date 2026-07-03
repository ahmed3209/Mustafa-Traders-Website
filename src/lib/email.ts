import { Resend } from "resend";
import { formatPKR } from "@/lib/utils";
import { site } from "@/config/site";
import type { CreateOrderInput } from "@/types/order";

interface OrderEmailData extends CreateOrderInput {
  id: string;
  unitPrice: number;
  totalAmount: number;
  sizeLabel: string;
}

/**
 * Email the owner when a new order arrives. No-ops (returns false) when
 * RESEND_API_KEY / OWNER_EMAIL aren't configured, so orders never fail because
 * email is missing.
 */
export async function sendNewOrderEmail(o: OrderEmailData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) return false;

  const from =
    process.env.RESEND_FROM ?? "Mustafa Traders <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Order ID", o.id],
    ["Name", o.customerName],
    ["Phone", o.phone],
    ["WhatsApp", o.whatsappNumber || o.phone],
    ["City", o.city],
    ["Address", o.address],
    ["Size", o.sizeLabel],
    ["Quantity", String(o.quantity)],
    ["Unit Price", formatPKR(o.unitPrice)],
    ["Total", formatPKR(o.totalAmount)],
    ["Payment", o.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Bank Transfer"],
    ["Notes", o.orderNotes || "—"],
  ];

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1412;">
      <div style="background:#1C1412;padding:20px 24px;">
        <span style="color:#FDFAF6;font-size:18px;font-weight:700;">MUSTAFA</span>
        <span style="color:#B8864E;font-size:11px;letter-spacing:2px;"> TRADERS</span>
      </div>
      <div style="padding:24px;border:1px solid #E8DDD0;border-top:none;">
        <h2 style="margin:0 0 4px;font-size:18px;">New order — ${o.id}</h2>
        <p style="margin:0 0 18px;color:#78716C;font-size:13px;">A new order was placed on the store.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:7px 0;color:#78716C;width:120px;vertical-align:top;">${k}</td><td style="padding:7px 0;font-weight:500;">${v}</td></tr>`
            )
            .join("")}
        </table>
        <p style="margin:20px 0 0;">
          <a href="${site.whatsapp.number ? `https://wa.me/${o.whatsappNumber || o.phone}` : "#"}" style="background:#25D366;color:#fff;text-decoration:none;padding:10px 18px;font-size:13px;font-weight:600;">Message customer on WhatsApp</a>
        </p>
      </div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `New order ${o.id} — ${o.sizeLabel} × ${o.quantity} (${formatPKR(o.totalAmount)})`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] failed to send new-order notification:", err);
    return false;
  }
}
