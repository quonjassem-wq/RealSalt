import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import logo from "@/assets/logo.png";
<img src={logo} />

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const initial = useMemo<UIMessage[]>(() => [], []);
  const { messages, sendMessage, status } = useChat({ id: "salt-chat", messages: initial, transport });
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9 }); }, [messages, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const v = input.trim();
    setInput("");
    await sendMessage({ text: v });
  }

  return (
    <>
      <button onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="brand-gradient fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg shadow-brand-glow/30 transition-transform hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="glass fixed bottom-24 right-6 z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-border/50 p-4">
              <img src={logo.url} alt="" className="h-8 w-8 rounded-md" />
              <div>
                <div className="text-sm font-semibold">Salt Bot</div>
                <div className="text-[10px] text-muted-foreground">ask me anything about salt</div>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground">hey! ask me about pricing, the key system, release date, anything.</p>
              )}
              {messages.map((m) => {
                const text = m.parts.map((p: any) => (p.type === "text" ? p.text : "")).join("");
                return (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user" ? "brand-gradient text-primary-foreground" : "bg-surface"}`}>
                      {text}
                    </div>
                  </div>
                );
              })}
              {busy && <div className="text-xs text-muted-foreground">…</div>}
            </div>
            <form onSubmit={submit} className="flex gap-2 border-t border-border/50 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="message..."
                className="flex-1 rounded-lg bg-surface px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-brand-glow/60" />
              <button disabled={busy || !input.trim()} className="brand-gradient inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
