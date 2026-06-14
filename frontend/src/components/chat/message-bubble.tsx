"use client";

import { Wrench } from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickReply: (reply: string) => void;
  disableQuickReplies?: boolean;
}

export function MessageBubble({ message, onQuickReply, disableQuickReplies }: MessageBubbleProps) {
  const isAssistant = message.sender === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      {isAssistant && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-signal">
          <Wrench className="h-4 w-4" />
        </span>
      )}

      <div className={`flex max-w-[85%] flex-col gap-2 ${isAssistant ? "items-start" : "items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAssistant
              ? "rounded-tl-sm bg-surface-2 text-text"
              : "rounded-tr-sm bg-signal-dim text-text"
          }`}
        >
          {message.isTyping ? (
            <span className="flex items-center gap-1 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-typing-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-typing-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-typing-bounce [animation-delay:300ms]" />
            </span>
          ) : (
            <p className="whitespace-pre-line">{message.text}</p>
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex gap-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                disabled={disableQuickReplies}
                onClick={() => onQuickReply(reply)}
                className="rounded-full border border-line-strong bg-transparent px-3 py-1.5 text-xs text-text transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <span className="px-1 font-mono text-[11px] text-text-faint">{message.time}</span>
      </div>
    </div>
  );
}
