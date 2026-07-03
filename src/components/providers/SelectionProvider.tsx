"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { MattressSize } from "@/types/order";
import { enabledSizes } from "@/config/product";

// Shares the selected mattress size + quantity between the Product section
// (where the user picks) and the OrderForm (where it pre-fills the summary).
interface SelectionState {
  size: MattressSize;
  setSize: (s: MattressSize) => void;
  quantity: number;
  setQuantity: (q: number) => void;
}

const SelectionContext = createContext<SelectionState | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState<MattressSize>(
    enabledSizes()[0]?.size ?? "king"
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <SelectionContext.Provider value={{ size, setSize, quantity, setQuantity }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionState {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within <SelectionProvider>");
  }
  return ctx;
}
