"use client";

import { FileText, Video, Image } from "lucide-react";
import { SourceReference } from "@/lib/types";

const ICONS: Record<SourceReference["type"], typeof FileText> = {
  pdf: FileText,
  video: Video,
  diagram: Image,
};

interface SourceReferencesProps {
  sources: SourceReference[];
}

export function SourceReferences({ sources }: SourceReferencesProps) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-text-faint">
        Reference material will appear here once the assistant has narrowed down the likely cause.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sources.map((source) => {
        const Icon = ICONS[source.type];
        return (
          <div
            key={source.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-3 text-text-muted">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">{source.title}</p>
              <p className="text-xs text-text-muted">{source.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
