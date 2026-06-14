"use client";

import { Button } from "@/components/ui/button";
import { SparePart } from "@/lib/types";

interface SparePartsPanelProps {
  parts: SparePart[];
}

export function SparePartsPanel({ parts }: SparePartsPanelProps) {
  if (parts.length === 0) {
    return (
      <p className="text-sm text-text-faint">
        Suggested spare parts and cost estimates will appear once a cause is confirmed.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {parts.map((part) => (
          <li
            key={part.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-2 px-3 py-2.5"
          >
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="truncate text-sm text-text">{part.name}</span>
              <span className="font-mono text-xs text-text-muted">{part.partNumber}</span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="font-mono text-sm text-text">{part.estimatedCost}</span>
              <span className="text-xs text-text-muted">Qty {part.quantity}</span>
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant="outline"
        className="border-line bg-transparent text-text hover:bg-surface-2 hover:text-text"
      >
        Request these parts
      </Button>
    </div>
  );
}
