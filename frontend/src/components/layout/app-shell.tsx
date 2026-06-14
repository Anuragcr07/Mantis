"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { DiagnosticPanel } from "@/components/diagnostics/diagnostic-panel";
import { ProductSidebar } from "./product-sidebar";
import {
  HORN_SCENARIO,
  INITIAL_DIAGNOSTIC_STATE,
  INITIAL_MESSAGES,
  PRODUCTS,
} from "@/lib/mock-data";
import { Attachment, ChatMessage, Product } from "@/lib/types";

function nowTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function AppShell() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [diagnostic, setDiagnostic] = useState(INITIAL_DIAGNOSTIC_STATE);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = useState(true);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);

  const currentScenario = useMemo(
    () => HORN_SCENARIO[Math.min(scenarioIndex, HORN_SCENARIO.length - 1)],
    [scenarioIndex]
  );

  const pushAssistantMessage = (text: string, quickReplies?: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text,
        time: nowTime(),
        quickReplies,
      },
    ]);
  };

  const handleSend = (text: string, attachments: Attachment[]) => {
    if (!text && attachments.length === 0) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        time: nowTime(),
        attachments: attachments.length > 0 ? attachments : undefined,
      },
    ]);

    setAwaitingReply(true);

    window.setTimeout(() => {
      const nextStep = HORN_SCENARIO[Math.min(scenarioIndex, HORN_SCENARIO.length - 1)];
      pushAssistantMessage(nextStep.assistantText, nextStep.quickReplies);
      setDiagnostic((prev) => ({ ...prev, ...nextStep.diagnosticPatch }));
      setScenarioIndex((prev) => Math.min(prev + 1, HORN_SCENARIO.length));
      setAwaitingReply(false);
    }, 600);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply, []);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setDiagnostic(INITIAL_DIAGNOSTIC_STATE);
    setAwaitingReply(false);
    setDiagnosticVisible(true);
    setScenarioIndex(0);
    setEscalated(false);
  };

  const handleEscalate = () => {
    setEscalated(true);
  };

  useEffect(() => {
    if (!diagnosticVisible) {
      setDiagnosticVisible(true);
    }
  }, [diagnosticVisible]);

  return (
    <div className="min-h-screen bg-canvas text-text">
      <main className="grid min-h-screen grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)_420px] lg:px-6">
        <ProductSidebar
          products={PRODUCTS}
          selected={selectedProduct}
          onSelect={setSelectedProduct}
          onReset={handleReset}
        />

        <ChatPanel
          product={selectedProduct}
          messages={messages}
          onSend={handleSend}
          onQuickReply={handleQuickReply}
          awaitingReply={awaitingReply}
          onToggleDiagnostics={() => setDiagnosticVisible((prev) => !prev)}
        />

        {diagnosticVisible && (
          <div className="hidden h-full flex-col lg:flex">
            <DiagnosticPanel
              diagnostic={diagnostic}
              onEscalate={handleEscalate}
              escalated={escalated}
            />
          </div>
        )}
      </main>
    </div>
  );
}
