"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MattressSize } from "@/types/order";
import type { ResolvedSize } from "@/lib/pricing";

// Carries server-resolved pricing (base price + admin discount) to the client
// components (Product, OrderForm) so discounts render without another fetch.
interface PricingCtx {
  sizes: ResolvedSize[];
  enabled: ResolvedSize[];
  get: (size: MattressSize) => ResolvedSize | undefined;
}

const Ctx = createContext<PricingCtx | null>(null);

export function PricingProvider({
  sizes,
  children,
}: {
  sizes: ResolvedSize[];
  children: ReactNode;
}) {
  const value: PricingCtx = {
    sizes,
    enabled: sizes.filter((s) => s.enabled),
    get: (size) => sizes.find((s) => s.size === size),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePricing(): PricingCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePricing must be used within <PricingProvider>");
  return ctx;
}
