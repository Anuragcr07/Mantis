import { ChatMessage, DiagnosticState } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface ChatTurnResponse {
  message: ChatMessage;
  diagnostic: DiagnosticState;
}

/**
 * Send a chat turn to the FastAPI agent.
 *
 * Expected backend contract — POST /api/chat
 * body: { session_id, product_id, text, attachment_urls? }
 * returns: { message: ChatMessage, diagnostic: DiagnosticState }
 */
export async function sendChatMessage(
  sessionId: string,
  productId: string,
  text: string,
  attachmentUrls: string[] = []
): Promise<ChatTurnResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      text,
      attachment_urls: attachmentUrls,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Upload an image for visual diagnosis.
 *
 * Expected backend contract — POST /api/upload (multipart/form-data)
 * returns: { url: string }
 */
export async function uploadAttachment(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Raise an escalation ticket when agent confidence stays low.
 *
 * Expected backend contract — POST /api/escalate
 * body: { session_id, product_id, summary, diagnostic }
 * returns: { ticket_id: string }
 */
export async function createEscalationTicket(
  sessionId: string,
  productId: string,
  diagnostic: DiagnosticState
): Promise<{ ticket_id: string }> {
  const res = await fetch(`${API_BASE}/api/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      summary: diagnostic.symptom,
      diagnostic,
    }),
  });

  if (!res.ok) {
    throw new Error(`Escalation request failed: ${res.status}`);
  }

  return res.json();
}
