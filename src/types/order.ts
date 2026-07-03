// Domain types for Boston PocketSpring Mattress.
// Mirrors the Supabase schema in /supabase/schema.sql (PRD §12).

// Only Queen and King are sold at launch. `single` / `double` are reserved
// so pricing/specs can be enabled later from the product config without a
// type migration.
export type MattressSize = "single" | "double" | "queen" | "king";

// Bank transfer (advance) is the only method at launch. COD and others can be
// toggled on by the admin later — keep the union open for that.
export type PaymentMethod = "bank_transfer" | "cod";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderStatusChange {
  status: OrderStatus;
  changedAt: string; // ISO timestamp
  note?: string;
}

export interface Order {
  id: string; // e.g. "BPS-2026-0001"
  createdAt: string;
  updatedAt: string;

  // Customer
  customerName: string;
  phone: string; // Pakistani format: 03XX-XXXXXXX
  whatsappNumber?: string;

  // Delivery
  city: string;
  address: string;

  // Product
  mattressSize: MattressSize;
  quantity: number; // 1–5
  unitPrice: number; // PKR at time of order (after any discount)
  totalAmount: number; // unitPrice × quantity

  // Meta
  paymentMethod: PaymentMethod;
  orderNotes?: string;
  adminNotes?: string;

  // Status
  status: OrderStatus;
  statusHistory: OrderStatusChange[];
}

// Payload accepted by POST /api/orders (server computes price/total/id/status).
export interface CreateOrderInput {
  customerName: string;
  phone: string;
  whatsappNumber?: string;
  city: string;
  address: string;
  mattressSize: MattressSize;
  quantity: number;
  paymentMethod: PaymentMethod;
  orderNotes?: string;
}
