import { z } from "zod";
import { product } from "@/config/product";

// Validation schema for the public order form (PRD §13.6).
// Shared between the client form (react-hook-form) and the API route.
export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(\+92|0)3\d{2}-?\d{7}$/, "Enter a valid Pakistani mobile number"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^(\+92|0)3\d{2}-?\d{7}$/, "Enter a valid WhatsApp number")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().min(2, "Please select your city"),
  address: z
    .string()
    .trim()
    .min(10, "Please provide your complete delivery address")
    .max(500),
  mattressSize: z.enum(["single", "double", "queen", "king"]),
  quantity: z.coerce
    .number()
    .int()
    .min(product.minQuantity)
    .max(product.maxQuantity),
  paymentMethod: z.enum(["bank_transfer", "cod"]),
  orderNotes: z.string().trim().max(500).optional().or(z.literal("")),
  // Honeypot anti-spam field — must stay empty (PRD §6 Security).
  website: z.string().max(0).optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
