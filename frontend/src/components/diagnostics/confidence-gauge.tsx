"use client";

import { DiagnosisStatus } from "@/lib/types";

interface ConfidenceGaugeProps {
  confidence: number;
  status: DiagnosisStatus;
}

const STATUS_COPY: Record<DiagnosisStatus, string> = {
  idle: "Waiting for a symptom",
  diagnosing: "Narrowing down the cause",
  resolved: "Likely cause identified",
  escalated: "Handed off to a technician",
};

export function ConfidenceGauge({ confidence, status }: ConfidenceGaugeProps) {
  const clamped = Math.max(0, Math.min(100, confidence));
  const angle = -90 + (clamped / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 124" className="w-full max-w-60">
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-alert)" />
            <stop offset="50%" stopColor="var(--color-signal)" />
            <stop offset="100%" stopColor="var(--color-confirm)" />
          </linearGradient>
        </defs>
        <path
          d="M 16 104 A 84 84 0 0 1 184 104"
          fill="none"
          stroke="var(--color-surface-3)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 16 104 A 84 84 0 0 1 184 104"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.9"
        />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "100px 104px",
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <line x1="100" y1="104" x2="100" y2="34" stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="104" r="6" fill="var(--color-text)" />
      </svg>
      <div className="mt-1 flex flex-col items-center gap-1">
        <span className="font-mono text-3xl font-medium tabular-nums text-text">
          {clamped}
          <span className="text-base text-text-muted">%</span>
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
          {STATUS_COPY[status]}
        </span>
      </div>
    </div>
  );
}

