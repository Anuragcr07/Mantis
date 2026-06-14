"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { ImagePlus, Mic, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Attachment } from "@/lib/types";

interface ChatComposerProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

// Minimal shape for the Web Speech API — not in default TS lib.dom
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;
    setVoiceSupported(true);

    const recognition: SpeechRecognitionLike = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript as string;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        kind: "image" as const,
      }));
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return;
    onSend(value.trim(), attachments);
    setValue("");
    setAttachments([]);
  };

  return (
    <div className="border-t border-line bg-surface px-4 py-3">
      {attachments.length > 0 && (
        <div className="mb-2 flex gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={attachment.url} alt={attachment.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-canvas/80 text-text"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 text-text-muted hover:text-text"
          title="Attach a photo"
        >
          <ImagePlus className="h-5 w-5" />
        </Button>

        <Input
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Describe what's going on…"
          disabled={disabled}
          className="border-line bg-surface-2 text-text placeholder:text-text-faint focus-visible:ring-signal/40"
        />

        {voiceSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className={`relative shrink-0 ${
              listening ? "text-signal animate-mic-pulse" : "text-text-muted hover:text-text"
            }`}
            title={listening ? "Stop listening" : "Speak instead"}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}

        <Button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          size="icon"
          className="shrink-0 bg-signal text-canvas hover:bg-signal/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
