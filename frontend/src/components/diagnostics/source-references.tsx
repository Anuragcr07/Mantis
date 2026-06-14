"use client";

import { FileText, PlayCircle, Image, ExternalLink } from "lucide-react";
import { SourceReference } from "@/lib/types";

// 1. Icon mapping with a technical style
const ICONS = {
  pdf: FileText,
  video: PlayCircle,
  diagram: Image,
};

interface SourceReferencesProps {
  sources: SourceReference[];
}

export function SourceReferences({ sources = [] }: SourceReferencesProps) {
  // Empty State: Matches the "Awaiting symptom" placeholder style
  if (sources.length === 0) {
    return (
      <div className="px-1 py-2">
        <p className="text-[11px] font-mono text-text-faint uppercase tracking-wider italic leading-relaxed">
          // No_External_Assets_Cited
        </p>
        <p className="text-[10px] text-text-muted mt-1">
          Reference material will appear here once the assistant cites specific manuals or videos.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sources.map((source, index) => {
        // 2. SAFE ICON LOOKUP: 
        // Force lowercase to match keys and provide FileText as a fallback to prevent "undefined" crash.
        const typeKey = (source.type?.toLowerCase() || "pdf") as keyof typeof ICONS;
        const Icon = ICONS[typeKey] || FileText;

        return (
          <div
            // 3. SAFE KEY:
            // Use index combined with title to guarantee uniqueness and stop browser warnings.
            key={`source-${index}-${source.title}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 p-3 transition-all hover:border-signal/40 hover:bg-surface-2 cursor-pointer shadow-sm"
          >
            {/* Technical Icon Box */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-text-muted group-hover:text-signal transition-colors border border-line/50">
              <Icon className="h-5 w-5" />
            </span>

            {/* Metadata Text */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-text group-hover:text-signal transition-colors">
                {source.title || "Technical Document"}
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                {/* Display the reference detail provided by the backend */}
                <span className="text-[9px] font-mono font-bold text-text-faint uppercase bg-canvas px-1.5 py-0.5 rounded border border-line">
                  {source.detail || "REFERENCE"}
                </span>
                
                {source.type === 'video' && (
                    <span className="text-[9px] font-mono text-confirm animate-pulse">● VIDEO_READY</span>
                )}
              </div>
            </div>

            {/* External Indicator */}
            <ExternalLink size={12} className="text-text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}