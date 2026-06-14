"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, RotateCcw } from "lucide-react";
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

interface AppShellProps {
  onBack?: () => void; // Essential for Customer Garage integration
}

export function AppShell({ onBack }: AppShellProps) {
  // --- STATE ---
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [diagnostic, setDiagnostic] = useState(INITIAL_DIAGNOSTIC_STATE);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = useState(true);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);

  // --- LOGIC ---
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
    if (awaitingReply) return;

    // 1. Add User Message
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

    // 2. Simulate AI "Thinking" and advancing the scripted scenario
    window.setTimeout(() => {
      const stepToPlay = Math.min(scenarioIndex, HORN_SCENARIO.length - 1);
      const nextStep = HORN_SCENARIO[stepToPlay];

      pushAssistantMessage(nextStep.assistantText, nextStep.quickReplies);
      
      // Update the Diagnostic Panel (Gauge, Causes, etc)
      setDiagnostic((prev) => ({ 
        ...prev, 
        ...nextStep.diagnosticPatch,
        status: scenarioIndex >= HORN_SCENARIO.length - 1 ? "resolved" : "diagnosing"
      }));

      setScenarioIndex((prev) => prev + 1);
      setAwaitingReply(false);
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply, []);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setDiagnostic(INITIAL_DIAGNOSTIC_STATE);
    setAwaitingReply(false);
    setScenarioIndex(0);
    setEscalated(false);
  };

  const handleEscalate = () => {
    setEscalated(true);
    setDiagnostic((prev) => ({ ...prev, status: "escalated" }));
    pushAssistantMessage(
      "I've shared your diagnostic data with a Philix technician. They will review the relay and fuse results before contacting you.",
      []
    );
  };

  // Ensure diagnostics are visible when a session starts
  useEffect(() => {
    if (!diagnosticVisible) setDiagnosticVisible(true);
  }, [selectedProduct]);

  return (
    <div className="flex h-full flex-col bg-canvas text-text relative overflow-hidden">
      {/* 1. TOP NAV / HEADER (Internal AppShell) */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-line bg-surface/30 lg:hidden">
        {onBack && (
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text font-medium"
          >
            <ArrowLeft size={14} /> Back to Garage
          </button>
        )}
        <div className="text-[10px] font-mono text-signal uppercase tracking-widest">
          Active_Diagnostic_Session
        </div>
      </div>

      <main className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[280px_1fr_380px]">
        
        {/* 2. SIDEBAR: Product Info & Maintenance */}
        <div className="hidden border-r border-line lg:block bg-surface/20">
          <ProductSidebar
            products={PRODUCTS}
            selected={selectedProduct}
            onSelect={(p) => {
              setSelectedProduct(p);
              handleReset();
            }}
            onReset={handleReset}
          />
        </div>

        {/* 3. CHAT PANEL: The Main Interaction */}
        <div className="flex flex-col min-w-0 bg-canvas">
          <ChatPanel
            product={selectedProduct}
            messages={messages}
            onSend={handleSend}
            onQuickReply={handleQuickReply}
            awaitingReply={awaitingReply}
            onToggleDiagnostics={() => setDiagnosticVisible((prev) => !prev)}
          />
        </div>

        {/* 4. DIAGNOSTIC PANEL: The Visual Expert (Gauge, Causes, Sources) */}
        {diagnosticVisible && (
          <div className="hidden h-full flex-col border-l border-line bg-surface/10 lg:flex overflow-y-auto">
            {/* Desktop Exit/Back Button */}
            {onBack && (
              <div className="px-6 pt-4">
                <button 
                  onClick={onBack}
                  className="group flex items-center gap-2 text-[10px] font-mono text-text-muted hover:text-signal transition-colors"
                >
                  <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" /> 
                  RETURN_TO_GARAGE
                </button>
              </div>
            )}
            
            <DiagnosticPanel
              diagnostic={diagnostic}
              onEscalate={handleEscalate}
              escalated={escalated}
            />
            
            <div className="mt-auto p-6 border-t border-line">
               <button 
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-text-faint hover:text-text transition-colors"
               >
                 <RotateCcw size={12} /> Reset Session
               </button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE TOGGLE (Show diagnostics if hidden) */}
      {!diagnosticVisible && (
        <button 
          onClick={() => setDiagnosticVisible(true)}
          className="fixed bottom-24 right-6 lg:hidden bg-signal text-canvas p-3 rounded-full shadow-lg z-50"
        >
          <Activity size={20} />
        </button>
      )}
    </div>
  );
}