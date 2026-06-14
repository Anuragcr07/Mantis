"use client";

import { useEffect, useRef } from "react";
import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { ChatComposer } from "./chat-composer";
import { ChatMessage, Attachment, Product } from "@/lib/types";

interface ChatPanelProps {
  product: Product;
  messages: ChatMessage[];
  onSend: (text: string, attachments: Attachment[]) => void;
  onQuickReply: (reply: string) => void;
  awaitingReply: boolean;
  onToggleDiagnostics: () => void;
}

export function ChatPanel({
  product,
  messages,
  onSend,
  onQuickReply,
  awaitingReply,
  onToggleDiagnostics,
}: ChatPanelProps) {
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const lastIndex = messages.length - 1;

  return (
    <div className="flex h-full flex-col bg-canvas bg-grid">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface/70 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{product.category}</p>
          <h1 className="font-display text-lg font-semibold text-text">{product.name}</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDiagnostics}
          className="border-line bg-transparent text-text hover:bg-surface-2 hover:text-text lg:hidden"
        >
          <Activity className="h-4 w-4" />
          Diagnosis
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-5 px-5 py-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onQuickReply={onQuickReply}
              disableQuickReplies={awaitingReply || index !== lastIndex}
            />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
      </ScrollArea>

      <ChatComposer onSend={onSend} disabled={awaitingReply} />
    </div>
  );
}
