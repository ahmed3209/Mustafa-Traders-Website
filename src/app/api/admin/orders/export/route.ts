import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { listOrders, type OrderFilters, type AdminOrder } from "@/lib/orders";

const HEADERS = [
  "Order ID",
  "Date",
  "Customer",
  "Phone",
  "WhatsApp",
  "City",
  "Address",
  "Size",
  "Qty",
  "Unit Price",
  "Total",
  "Payment",
  "Status",
  "Customer Notes",
  "Admin Notes",
];

function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  // Escape for CSV: wrap in quotes, double internal quotes.
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(orders: AdminOrder[]): string {
  const rows = orders.map((o) =>
    [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.customerName,
      o.phone,
      o.whatsappNumber ?? "",
      o.city,
      o.address,
      o.mattressSize,
      o.quantity,
      o.unitPrice,
      o.totalAmount,
      o.paymentMethod,
      o.status,
      o.orderNotes ?? "",
      o.adminNotes ?? "",
    ]
      .map(cell)
      .join(",")
  );
  // BOM so Excel opens UTF-8 correctly.
  return "﻿" + [HEADERS.map(cell).join(","), ...rows].join("\r\n");
}

// GET /api/admin/orders/export?status=&city=&q=&from=&to=  → CSV download.
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters: OrderFilters = {
    status: searchParams.get("status") || undefined,
    city: searchParams.get("city") || undefined,
    q: searchParams.get("q") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };

  const orders = await listOrders(filters);
  const csv = toCsv(orders);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  });
}
