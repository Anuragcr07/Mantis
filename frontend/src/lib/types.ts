export type Sender = "user" | "assistant";

export interface Attachment {
  file: File;
  id: string;
  name: string;
  url: string;
  kind: "image";
}

export interface SourceReference {
  id: string;
  type: "pdf" | "video" | "diagram";
  title: string;
  detail: string; // e.g. "Page 42" or "4:12 – 5:03"
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  attachments?: Attachment[];
  quickReplies?: string[];
  sources?: SourceReference[];
  isTyping?: boolean;
}

export type CauseStatus = "considering" | "ruled-out" | "confirmed";

export interface DiagnosticCause {
  id: string;
  label: string;
  status: CauseStatus;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  estimatedCost: string;
}

export type DiagnosisStatus = "idle" | "diagnosing" | "resolved" | "escalated";

export interface DiagnosticState {
  symptom: string;
  status: DiagnosisStatus;
  confidence: number; // 0 - 100
  causes: DiagnosticCause[];
  sources: SourceReference[];
  spareParts: SparePart[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  icon: "scooter" | "ac" | "washer";
  lastService: string;
  nextService: string;
}
