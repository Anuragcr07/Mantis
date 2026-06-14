"use client";

import { Check, X } from "lucide-react";
import { DiagnosticCause } from "@/lib/types";

interface CauseTrackerProps {
  causes: DiagnosticCause[];
}

export function CauseTracker({ causes }: CauseTrackerProps) {
  if (causes.length === 0) {
    return (
      <p className="text-sm text-text-faint">
        Possible causes will appear here once you describe the issue.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {causes.map((cause) => (
        <li
          key={cause.id}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface-2 px-3 py-2"
        >
          {cause.status === "confirmed" && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-confirm-dim text-confirm">
              <Check className="h-3.5 w-3.5" />
            </span>
          )}
          {cause.status === "ruled-out" && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text-faint">
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          {cause.status === "considering" && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-signal animate-dot-pulse" />
            </span>
          )}

          <span
            className={
              cause.status === "ruled-out"
                ? "text-sm text-text-faint line-through"
                : cause.status === "confirmed"
                ? "text-sm font-medium text-text"
                : "text-sm text-text-muted"
            }
          >
            {cause.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
