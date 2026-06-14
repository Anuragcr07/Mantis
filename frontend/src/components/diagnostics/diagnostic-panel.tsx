"use client";

import { AlertTriangle, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfidenceGauge } from "./confidence-gauge";
import { CauseTracker } from "./cause-tracker";
import { SourceReferences } from "./source-references";
import { SparePartsPanel } from "./spare-parts-panel";
import { DiagnosticState, DiagnosisStatus } from "@/lib/types";

interface DiagnosticPanelProps {
  diagnostic: DiagnosticState;
  onEscalate: () => void;
  escalated: boolean;
}

const STATUS_STYLES: Record<DiagnosisStatus, string> = {
  idle: "bg-surface-3 text-text-muted",
  diagnosing: "bg-signal-dim text-signal",
  resolved: "bg-confirm-dim text-confirm",
  escalated: "bg-alert-dim text-alert",
};

const STATUS_LABEL: Record<DiagnosisStatus, string> = {
  idle: "Idle",
  diagnosing: "Diagnosing",
  resolved: "Resolved",
  escalated: "Escalated",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

export function DiagnosticPanel({ diagnostic, onEscalate, escalated }: DiagnosticPanelProps) {
  const lowConfidence = diagnostic.status === "diagnosing" && diagnostic.confidence < 35;

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Live diagnosis</p>
          <h2 className="font-display text-lg font-semibold text-text">{diagnostic.symptom}</h2>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[diagnostic.status]}`}
        >
          {STATUS_LABEL[diagnostic.status]}
        </span>
      </header>

      <div className="rounded-xl border border-line bg-surface-2 px-4 py-5">
        <ConfidenceGauge confidence={diagnostic.confidence} status={diagnostic.status} />
      </div>

      <Section title="Possible causes">
        <CauseTracker causes={diagnostic.causes} />
      </Section>

      <Section title="Reference material">
        <SourceReferences sources={diagnostic.sources} />
      </Section>

      <Section title="Spare parts">
        <SparePartsPanel parts={diagnostic.spareParts} />
      </Section>

      <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
        {lowConfidence && (
          <p className="flex items-start gap-2 text-xs text-text-muted">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
            Confidence is still low. You can hand this off to a technician at any point.
          </p>
        )}
        <Button
          onClick={onEscalate}
          disabled={escalated}
          variant="outline"
          className="border-line bg-transparent text-text hover:bg-surface-2 hover:text-text disabled:opacity-60"
        >
          <LifeBuoy className="h-4 w-4" />
          {escalated ? "Ticket raised — technician notified" : "Escalate to a technician"}
        </Button>
      </div>
    </div>
  );
}
