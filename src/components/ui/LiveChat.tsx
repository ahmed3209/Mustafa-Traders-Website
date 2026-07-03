"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/config/site";

// Self-contained live-chat widget from the Claude Design prototype: a
// bottom-left toggle + panel with a canned bot reply that points to WhatsApp.
// (Swap for Tawk.to later if a real agent inbox is wanted.)

interface ChatCtx {
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
}
const Ctx = createContext<ChatCtx | null>(null);

export function useChat(): ChatCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}

interface Msg {
  role: "bot" | "user";
  text: string;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<Msg[]>([
    {
      role: "bot",
      text: "Salam! 👋 Welcome to Mustafa Traders. How can we help you today?",
    },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const open = () => setIsOpen(true);
  const toggle = () => setIsOpen((v) => !v);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setLog((l) => [...l, { role: "user", text: t }]);
    setText("");
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTyping(false);
      setLog((l) => [
        ...l,
        {
          role: "bot",
          text: `Shukriya! 😊 For the fastest response, please WhatsApp us at ${site.phone.display} or call ${site.businessHours}.`,
        },
      ]);
    }, 1200);
  };

  return (
    <Ctx.Provider value={{ isOpen, open, toggle }}>
      {children}

      {/* Toggle button (bottom-left) */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Live Chat"
        className="fixed bottom-8 left-8 z-[1000] flex h-[52px] w-[52px] items-center justify-center rounded-full"
        style={{
          background: "#1C1412",
          border: "1px solid rgba(184,134,78,0.3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#B8864E" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-[96px] left-8 z-[999] flex w-[316px] max-w-[calc(100vw-4rem)] flex-col overflow-hidden bg-cream"
          style={{ border: "1px solid #E8DDD0", boxShadow: "0 8px 40px rgba(28,20,18,0.18)" }}
          role="dialog"
          aria-label="Live chat"
        >
          <div className="flex items-center justify-between bg-charcoal px-[18px] py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] items-center justify-center bg-gold font-display text-base font-bold text-charcoal">M</div>
              <div>
                <div className="text-[0.875rem] font-semibold text-cream">Mustafa Traders Support</div>
                <div className="text-[0.7rem] text-cream/50">Typically replies in minutes</div>
              </div>
            </div>
            <button type="button" onClick={toggle} aria-label="Close chat" className="p-1 text-[1.4rem] leading-none text-cream/60">×</button>
          </div>

          <div className="flex h-[220px] flex-col gap-2 overflow-y-auto p-3.5">
            {log.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "bot"
                    ? "max-w-[88%] self-start border border-border-subtle bg-linen px-3 py-2 text-[0.82rem] leading-[1.55] text-charcoal"
                    : "ml-auto max-w-[88%] self-end bg-gold px-3 py-2 text-[0.82rem] leading-[1.55] text-charcoal"
                }
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="self-start bg-linen px-3 py-2 text-[0.8rem] text-text-muted">Typing…</div>
            )}
          </div>

          <div className="flex gap-2 border-t border-border-subtle px-3.5 py-2.5">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Type a message…"
              className="flex-1 border border-border-subtle bg-white px-3 py-2 text-[0.82rem] text-charcoal"
            />
            <button type="button" onClick={send} aria-label="Send" className="bg-gold px-3.5 py-2 text-base font-bold text-charcoal">→</button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
